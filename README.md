# Sopan – Bali Culture Lens

## Description
**Sopan** adalah pemandu etika budaya Bali berbasis AI. Wisatawan cukup memotret apa yang ada
di depannya (pura, canang sari, upacara, penjor, pakaian), lalu AI menjelaskan maknanya serta
apa yang **boleh** dan **jangan** dilakukan, dalam bahasa wisatawan, lengkap dengan suara.

## Problem & Target User
- **Masalah:** pelanggaran norma oleh wisatawan (masuk area utama pura, menginjak canang,
  berpakaian tidak pantas) kerap terjadi dan viral. Pemprov Bali sampai menerbitkan
  SE Gubernur Bali No. 4/2023, tetapi aturan tersebut berbentuk teks, sedangkan wisatawan butuh
  panduan **di tempat dan saat itu juga**, dalam bahasanya sendiri.
- **Target user:** wisatawan mancanegara dan domestik di Bali, serta pemandu wisata, pengelola
  desa wisata, dan pengelola pura sebagai pengguna sekunder.

## Key Features (MVP v1.0)
1. **Scan foto**: kamera HP, lalu AI vision mengenali objek atau situasi budaya.
2. **Kartu etika**: Apa ini, Makna, Boleh, Jangan, Tips, dan tingkat kepekaan.
3. **Multibahasa**: EN, ID, ZH, RU, JA, KO, FR, DE.
4. **Dengarkan**: jawaban dibacakan (text-to-speech).
5. **Tanya lanjutan**: ketik atau bicara (speech-to-text), dengan konteks foto.
6. **Indikator keyakinan**: bila AI ragu, pengguna diarahkan bertanya ke warga atau pemangku.
7. **Halaman Etiket Bali**: ringkasan aturan resmi, tetap bisa dibaca tanpa AI.
8. **Penanganan error**: kuota habis, timeout, foto rusak, offline.

## Tech Stack
| Lapisan | Teknologi |
|---|---|
| Frontend | Next.js (App Router), React, CSS biasa, ikon Lucide, font Poppins |
| Backend | Next.js Route Handler (`/api/scan`, Node.js) |
| Database | Tidak ada (MVP stateless; preferensi bahasa di `localStorage`) |
| AI | Google Gemini Flash via Gemini API (free tier) |
| Speech | Web Speech API browser (SpeechRecognition & SpeechSynthesis) |
| Hosting | Vercel |

## AI Implementation
- **Model:** Gemini Flash (multimodal vision + bahasa), nama model diatur via `GEMINI_MODEL`.
- **Input:** foto (dikompres di browser menjadi JPEG maks. 1024px), bahasa pilihan, dan
  pertanyaan opsional.
- **Konteks (grounding):** pedoman SE Gubernur Bali 4/2023 dan etika umum pura disisipkan ke
  *system instruction* ([lib/guidelines.js](lib/guidelines.js), [lib/prompt.js](lib/prompt.js)).
- **Output:** JSON terstruktur (`responseSchema`): `objek`, `kategori`, `penjelasan`, `boleh[]`,
  `jangan[]`, `tips`, `kepekaan`, `yakin`, `relevan_bali`, `jawaban`.
- **Kenapa AI diperlukan:** situasi budaya di lapangan sangat beragam dan harus dikenali dari
  gambar, lalu dijelaskan dalam banyak bahasa. Hal ini tidak bisa dilakukan dengan aturan statis.
- **Responsible AI:** skor keyakinan dan peringatan saat ragu, larangan mengarang, penolakan
  terhadap instruksi tersembunyi di foto, serta disclaimer di setiap hasil.
- **Penjaga topik (2 lapis):** (1) prompt membatasi model hanya pada budaya & etika Bali dan
  mewajibkan flag `relevan_bali` / `pertanyaan_relevan`; (2) server membuang seluruh isi jawaban
  bila foto di luar topik (mis. foto laptop) dan mengosongkan `jawaban` bila pertanyaan di luar
  topik (mis. "buatkan kode Python"). UI lalu menampilkan penolakan standar beserta contoh foto
  yang didukung, sehingga jawaban di luar konteks tidak pernah sampai ke pengguna.
- **Kode AI utama:** [app/api/scan/route.js](app/api/scan/route.js).

## Architecture / Data Flow
```
User (HP) -> Frontend Next.js -> kompres foto -> POST /api/scan
          -> Server: validasi + system prompt (pedoman) -> Gemini API
          -> JSON terstruktur -> Kartu etika + Text-to-Speech -> Tanya lanjutan (loop)
```

## Installation / Run Instructions
```bash
npm install
cp .env.example .env.local   # lalu isi GEMINI_API_KEY
npm run dev                  # buka http://localhost:3000
```
Deploy ke Vercel: import repo, lalu isi Environment Variables `GEMINI_API_KEY` dan `GEMINI_MODEL`.
Kamera dan mikrofon membutuhkan HTTPS (otomatis di Vercel) atau `localhost`.

## Deployment URL
_TODO: isi URL Vercel_

## Demo Account
Tidak diperlukan (tanpa login).

## Known Limitations
- Akurasi bergantung pada kualitas foto dan pengetahuan model, sehingga bisa keliru untuk
  upacara yang sangat spesifik di desa adat tertentu.
- Free tier Gemini memiliki batas kuota per menit/hari. Saat kuota habis, pengguna diarahkan ke
  halaman Etiket Bali.
- Speech-to-text paling stabil di Chrome. Di browser lain tersedia kotak ketik sebagai cadangan.
- Pedoman masih berupa ringkasan. Belum mencakup aturan khusus tiap pura (awig-awig).
- Fallback saat ini antar-model Gemini (hedged request: model cadangan dipanggil paralel bila
  model utama lambat > 6 detik atau error). Fallback ke penyedia AI lain direncanakan untuk final.

## Third-party Resources / Credits
- Next.js, React, lucide-react (MIT / ISC)
- Font Poppins (SIL Open Font License, via Google Fonts)
- Foto landing page dari Unsplash (Unsplash License), daftar dan tautan sumber di `lib/photos.js`
- Google Gemini API (Google AI Studio)
- Web Speech API (bawaan browser)
- Surat Edaran Gubernur Bali No. 4 Tahun 2023, sebagai sumber pedoman

Lihat juga [DISCLOSURE.md](DISCLOSURE.md).

## Team Members
_TODO: Nama – Peran_
