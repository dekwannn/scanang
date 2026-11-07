"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera, ImageUp, BookOpen, Check, X, Lightbulb, Volume2, Square, Mic, Send,
  RotateCcw, TriangleAlert, Globe, LoaderCircle, MessageCircleQuestion, Info, Ban,
} from "lucide-react";
import { LANGUAGES, getLanguage, t } from "../../lib/languages";

// Kompres foto di browser: sisi terpanjang maks 1024px, JPEG 70%.
async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
  return { dataUrl, base64: dataUrl.split(",")[1] };
}

export default function Scan() {
  const [lang, setLang] = useState("en");
  const [photo, setPhoto] = useState(null); // { dataUrl, base64 }
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);

  const cameraRef = useRef(null);
  const uploadRef = useRef(null);
  const recRef = useRef(null);

  const L = getLanguage(lang);
  const ui = t(lang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scanang.lang");
      if (saved) setLang(saved);
    } catch {}
    setCanSpeak("speechSynthesis" in window);
    setCanListen(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function changeLang(code) {
    setLang(code);
    try { localStorage.setItem("scanang.lang", code); } catch {}
  }

  async function callAI(base64, q) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, lang, question: q || "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.message || "Terjadi kesalahan. Coba lagi.");
      setResult(data.result);
      return data.result;
    } catch (e) {
      setError(navigator.onLine === false ? "Tidak ada koneksi internet." : e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    stopSpeaking();
    setResult(null);
    setQuestion("");
    try {
      const img = await compressImage(file);
      setPhoto(img);
      const r = await callAI(img.base64, "");
      if (r?.relevan_bali === false) speak(ui.oosTitle);
      else if (r) speak(summaryText(r));
    } catch {
      setError("Foto tidak bisa dibaca. Coba foto lain.");
    }
  }

  async function ask(q) {
    const text = (q ?? question).trim();
    if (!text || !photo) return;
    stopSpeaking();
    const r = await callAI(photo.base64, text);
    if (r?.relevan_bali === false) speak(ui.oosTitle);
    else if (r?.pertanyaan_relevan === false) speak(ui.offTopic);
    else if (r?.jawaban) speak(r.jawaban);
  }

  function summaryText(r) {
    return [
      r.objek + ".",
      r.penjelasan,
      r.boleh?.length ? `${ui.dos}: ${r.boleh.join(". ")}.` : "",
      r.jangan?.length ? `${ui.donts}: ${r.jangan.join(". ")}.` : "",
    ].join(" ");
  }

  function speak(text) {
    if (!canSpeak || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = L.speech;
    const voice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith(L.code));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  }

  function stopSpeaking() {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { recRef.current?.stop(); return; }
    stopSpeaking();
    const rec = new SR();
    rec.lang = L.speech;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setQuestion(text);
      ask(text);
    };
    rec.onerror = () => setError("Suara tidak terdengar jelas. Coba lagi atau ketik pertanyaan.");
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function rescan() {
    stopSpeaking();
    setPhoto(null);
    setResult(null);
    setError("");
    setQuestion("");
    cameraRef.current?.click();
  }

  const pct = result ? Math.round(result.yakin * 100) : 0;

  return (
    <div className="page">
      <header className="page-head">
        <span className="label">Bali culture lens</span>
        <h1>{ui.heading}</h1>
        <p>{ui.tagline}</p>
      </header>

      <div className="field">
        <label htmlFor="lang" className="label">Language · Bahasa</label>
        <div className="select-wrap">
          <Globe size={18} aria-hidden="true" />
          <select id="lang" value={lang} onChange={(e) => changeLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Input disembunyikan secara visual (bukan display:none) dan dibuka lewat <label htmlFor>,
          cara paling andal di semua browser HP, termasuk Safari iOS. */}
      <input ref={cameraRef} id="camera-input" className="file-input" type="file" accept="image/*" capture="environment" onChange={onFile} tabIndex={-1} />
      <input ref={uploadRef} id="upload-input" className="file-input" type="file" accept="image/*" onChange={onFile} tabIndex={-1} />

      {!photo && (
        <>
          <label htmlFor="camera-input" className="viewfinder" role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cameraRef.current?.click(); } }}>
            <span className="vf tl" /><span className="vf tr" /><span className="vf bl" /><span className="vf br" />
            <span className="vf-icon"><Camera size={28} aria-hidden="true" /></span>
            <span className="vf-hint">{ui.vfHint}</span>
            <span className="sr-only">{ui.scan}</span>
          </label>
          <div className="actions">
            <label htmlFor="camera-input" className="btn btn-ink" role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cameraRef.current?.click(); } }}>
              <Camera size={20} aria-hidden="true" /> {ui.scan}
            </label>
            <label htmlFor="upload-input" className="btn btn-quiet" role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); uploadRef.current?.click(); } }}>
              <ImageUp size={18} aria-hidden="true" /> {ui.upload}
            </label>
            <Link href="/etiket" className="btn btn-quiet">
              <BookOpen size={18} aria-hidden="true" /> {ui.etiquette}
            </Link>
          </div>
        </>
      )}

      {photo && (
        <div className={`shot${loading ? " scanning" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.dataUrl} alt="Foto yang dipindai" />
          {loading && <span className="scanline" aria-hidden="true" />}
        </div>
      )}

      {loading && (
        <div className="status" role="status">
          <LoaderCircle size={18} className="spin" aria-hidden="true" /> {ui.analyzing}
        </div>
      )}

      {error && (
        <div className="notice error" role="alert">
          <TriangleAlert size={18} aria-hidden="true" /> <span>{error}</span>
        </div>
      )}

      {result && !loading && result.relevan_bali === false && (
        <article className="result oos" aria-live="polite">
          <div className="result-head">
            <span className="oos-icon"><Ban size={22} aria-hidden="true" /></span>
            <h2>{ui.oosTitle}</h2>
            {result.objek && (
              <p className="fineprint">{ui.oosDetected}: {result.objek}</p>
            )}
          </div>
          <div className="result-body">
            <div className="block">
              <p>{ui.oosText}</p>
              <ul className="oos-list">
                {ui.oosExamples.map((s) => <li key={s}><Check size={16} aria-hidden="true" />{s}</li>)}
              </ul>
            </div>
          </div>
        </article>
      )}

      {result && !loading && result.relevan_bali !== false && (
        <article className="result" aria-live="polite">
          <div className="result-head">
            <span className="label">{ui.what}</span>
            <h2>{result.objek}</h2>
            <div className="meta-row">
              <span className={`chip ${result.kepekaan}`}>
                {ui.sensitivity}: {ui.levels[result.kepekaan] || result.kepekaan}
              </span>
              <span className="confidence" title="Confidence">
                <span className="meter"><i style={{ width: `${pct}%` }} /></span>
                {pct}%
              </span>
            </div>
            {result.yakin < 0.5 && (
              <div className="notice warn"><TriangleAlert size={18} aria-hidden="true" /> <span>{ui.lowConfidence}</span></div>
            )}
          </div>

          <div className="result-body">
            {result.pertanyaan_relevan === false && (
              <div className="block">
                <div className="notice warn"><Info size={18} aria-hidden="true" /> <span>{ui.offTopic}</span></div>
              </div>
            )}
            {result.jawaban && (
              <div className="block">
                <div className="block-title label"><MessageCircleQuestion size={15} aria-hidden="true" /> {ui.answer}</div>
                <p className="answer">{result.jawaban}</p>
              </div>
            )}

            <div className="block">
              <div className="block-title label">{ui.meaning}</div>
              <p>{result.penjelasan}</p>
            </div>

            {result.boleh?.length > 0 && (
              <div className="block">
                <div className="block-title label">{ui.dos}</div>
                <ul className="list ok">
                  {result.boleh.map((s, i) => <li key={i}><Check size={16} aria-hidden="true" />{s}</li>)}
                </ul>
              </div>
            )}

            {result.jangan?.length > 0 && (
              <div className="block">
                <div className="block-title label">{ui.donts}</div>
                <ul className="list no">
                  {result.jangan.map((s, i) => <li key={i}><X size={16} aria-hidden="true" />{s}</li>)}
                </ul>
              </div>
            )}

            {result.tips && (
              <div className="block">
                <div className="block-title label"><Lightbulb size={15} aria-hidden="true" /> {ui.tip}</div>
                <p>{result.tips}</p>
              </div>
            )}
          </div>

          <div className="result-foot">
            {canSpeak && (
              speaking ? (
                <button className="btn btn-quiet btn-block" onClick={stopSpeaking}>
                  <Square size={16} aria-hidden="true" /> {ui.stop}
                </button>
              ) : (
                <button className="btn btn-quiet btn-block" onClick={() => speak(result.jawaban || summaryText(result))}>
                  <Volume2 size={18} aria-hidden="true" /> {ui.listen}
                </button>
              )
            )}

            <form className="ask" onSubmit={(e) => { e.preventDefault(); ask(); }}>
              <label htmlFor="q" className="sr-only">{ui.ask}</label>
              <input id="q" type="text" value={question} maxLength={300}
                placeholder={ui.askPlaceholder} onChange={(e) => setQuestion(e.target.value)} />
              {canListen && (
                <button type="button" className={`btn btn-quiet icon-btn${listening ? " live" : ""}`}
                  onClick={listen} aria-label={ui.speak} aria-pressed={listening} title={ui.speak}>
                  <Mic size={18} aria-hidden="true" />
                </button>
              )}
              <button type="submit" className="btn btn-ink icon-btn" disabled={!question.trim() || loading}
                aria-label={ui.ask} title={ui.ask}>
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            {listening && <p className="fineprint">{ui.listening}</p>}
            <p className="fineprint">{ui.disclaimer}</p>
          </div>
        </article>
      )}

      {photo && !loading && (
        <div className="actions">
          <button className="btn btn-ink" onClick={rescan}>
            <RotateCcw size={18} aria-hidden="true" /> {ui.newScan}
          </button>
        </div>
      )}
    </div>
  );
}
