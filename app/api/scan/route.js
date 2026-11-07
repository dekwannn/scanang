import { buildSystemPrompt, RESPONSE_SCHEMA } from "../../../lib/prompt";
import { getLanguage } from "../../../lib/languages";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_IMAGE_BASE64 = 1_500_000; // ~1.1 MB setelah dikompres di browser
const MAX_QUESTION = 300;
const HEDGE_AFTER_MS = 6_000; // normalnya model utama menjawab ±2-4 detik
const TOTAL_BUDGET_MS = 27_000;

function fail(status, code, message) {
  return Response.json({ ok: false, code, message }, { status });
}

// Model utama + cadangan. Bisa diatur lewat env tanpa mengubah kode.
function getModels() {
  const primary = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const fallbacks = (process.env.GEMINI_FALLBACK_MODELS || "gemini-3.5-flash-lite,gemini-flash-lite-latest")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([primary, ...fallbacks])];
}

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fail(500, "NO_KEY", "Server belum dikonfigurasi: GEMINI_API_KEY belum diisi.");
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return fail(400, "BAD_REQUEST", "Format permintaan tidak valid.");
  }

  const image = typeof body.image === "string" ? body.image : "";
  const question = typeof body.question === "string" ? body.question.trim().slice(0, MAX_QUESTION) : "";
  const lang = getLanguage(body.lang);

  if (!image || !/^[A-Za-z0-9+/=]+$/.test(image)) {
    return fail(400, "NO_IMAGE", "Foto tidak ditemukan atau rusak.");
  }
  if (image.length > MAX_IMAGE_BASE64) {
    return fail(413, "TOO_LARGE", "Foto terlalu besar.");
  }

  const payload = {
    systemInstruction: { parts: [{ text: buildSystemPrompt(lang.name) }] },
    contents: [
      {
        role: "user",
        parts: [
          { inline_data: { mime_type: "image/jpeg", data: image } },
          {
            text: question
              ? `Pertanyaan wisatawan: "${question}"`
              : "Jelaskan foto ini untuk wisatawan. Tidak ada pertanyaan tambahan (isi jawaban dengan string kosong).",
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      // Tugas ini butuh pengenalan + penjelasan singkat, bukan penalaran panjang.
      // Thinking rendah memangkas waktu respons dari ±10 dtk ke ±2-4 dtk.
      thinkingConfig: { thinkingLevel: "low" },
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  const started = Date.now();
  const { winner, lastFailure } = await hedgedCall(getModels(), apiKey, payload, started);
  if (winner) return finish(winner.data, winner.model, started);

  if (lastFailure?.reason === "quota") {
    return fail(429, "QUOTA", "Layanan sedang sangat sibuk. Coba lagi sebentar lagi, atau baca halaman Etiket Bali.");
  }
  if (lastFailure?.reason === "timeout") {
    return fail(504, "TIMEOUT", "Layanan terlalu lama merespons. Periksa koneksi lalu coba lagi.");
  }
  if (lastFailure?.reason === "blocked") {
    return fail(422, "BLOCKED", "Foto ini tidak dapat diproses. Coba foto lain.");
  }
  return fail(502, "AI_ERROR", "Layanan sedang bermasalah. Silakan coba lagi.");
}

// Hedged request: panggil model utama; bila belum menjawab dalam HEDGE_AFTER_MS
// atau gagal, panggil model cadangan berikutnya secara paralel. Jawaban sukses
// pertama yang dipakai, sisanya dibatalkan.
function hedgedCall(models, apiKey, payload, started) {
  return new Promise((resolve) => {
    const controllers = [];
    let next = 0;
    let pending = 0;
    let done = false;
    let lastFailure = null;
    let hedgeTimer = null;

    const finishAll = (winner) => {
      if (done) return;
      done = true;
      clearTimeout(hedgeTimer);
      controllers.forEach((c) => c.abort());
      resolve({ winner, lastFailure });
    };

    const launch = () => {
      if (done || next >= models.length) return false;
      const remaining = TOTAL_BUDGET_MS - (Date.now() - started);
      if (remaining < 2500) return false;
      const model = models[next++];
      const controller = new AbortController();
      controllers.push(controller);
      pending++;
      callGemini(model, apiKey, payload, remaining, controller).then((outcome) => {
        pending--;
        if (done) return;
        if (outcome.ok) return finishAll({ model, data: outcome.data });
        lastFailure = outcome;
        console.warn(`Model ${model} gagal (${outcome.reason})`);
        if (!outcome.retryable) return finishAll(null);
        if (!launch() && pending === 0) finishAll(null);
      });
      clearTimeout(hedgeTimer);
      hedgeTimer = setTimeout(() => {
        if (!done) console.warn(`Model ${model} lambat, menyalakan cadangan paralel`);
        launch();
      }, HEDGE_AFTER_MS);
      return true;
    };

    if (!launch()) finishAll(null);
  });
}

async function callGemini(model, apiKey, payload, timeoutMs, controller = new AbortController()) {
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Gemini error", model, res.status, detail.slice(0, 300));
      if (res.status === 429) return { ok: false, reason: "quota", retryable: true };
      if (res.status >= 500 || res.status === 404) return { ok: false, reason: "server", retryable: true };
      return { ok: false, reason: "client", retryable: false };
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    if (!candidate || candidate.finishReason === "SAFETY") {
      return { ok: false, reason: "blocked", retryable: false };
    }
    const text = candidate.content?.parts?.map((p) => p.text || "").join("") || "";
    try {
      return { ok: true, data: JSON.parse(text) };
    } catch {
      console.error("JSON parse gagal:", model, text.slice(0, 300));
      return { ok: false, reason: "bad_output", retryable: true };
    }
  } catch (err) {
    if (err.name === "AbortError") return { ok: false, reason: "timeout", retryable: true };
    console.error("Fetch error", model, err);
    return { ok: false, reason: "network", retryable: true };
  } finally {
    clearTimeout(timer);
  }
}

function finish(raw, model, started) {
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const list = (v) => (Array.isArray(v) ? v.filter((s) => typeof s === "string" && s.trim()).slice(0, 5) : []);

  // Penjaga topik di sisi server: bila model menandai foto di luar topik, seluruh isi
  // jawabannya DIBUANG. Hanya status "out_of_scope" yang dikirim; teks penolakan dibuat
  // oleh UI dalam bahasa pengguna. Jadi jawaban di luar konteks tidak pernah sampai ke pengguna.
  if (raw?.relevan_bali === false) {
    return Response.json({
      ok: true,
      status: "out_of_scope",
      result: { objek: str(raw.objek).slice(0, 60), relevan_bali: false },
      model, ms: Date.now() - started,
    });
  }

  const result = {
    objek: str(raw.objek),
    kategori: str(raw.kategori),
    penjelasan: str(raw.penjelasan),
    boleh: list(raw.boleh),
    jangan: list(raw.jangan),
    tips: str(raw.tips),
    kepekaan: ["rendah", "sedang", "tinggi"].includes(raw.kepekaan) ? raw.kepekaan : "sedang",
    yakin: Math.max(0, Math.min(1, Number(raw.yakin) || 0)),
    relevan_bali: true,
    // Pertanyaan di luar topik: jawabannya dibuang, UI menampilkan penolakan.
    pertanyaan_relevan: raw.pertanyaan_relevan !== false,
    jawaban: raw.pertanyaan_relevan === false ? "" : str(raw.jawaban),
  };
  return Response.json({ ok: true, status: "ok", result, model, ms: Date.now() - started });
}
