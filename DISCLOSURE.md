# AI & Technology Disclosure – Sopan

| Komponen | Isi |
|---|---|
| Nama Produk | Sopan – Bali Culture Lens |
| Framework / Frontend | Next.js (App Router), React |
| Backend / Runtime | Next.js Route Handler di Node.js (Vercel Functions) |
| Database / Storage | Tidak ada. Preferensi bahasa disimpan di `localStorage` browser. Foto tidak disimpan di server. |
| Hosting / Deployment | Vercel |
| AI Model / API / Method | Google Gemini Flash (Gemini API, free tier), dengan multimodal prompting dan structured output (JSON schema), thinking level rendah, dan hedged fallback antar-model (gemini-3.5-flash → gemini-3.5-flash-lite → gemini-flash-lite-latest) |
| Peran AI dalam Produk | (1) Computer vision: mengenali objek/situasi budaya dari foto. (2) LLM: menjelaskan makna serta do & don't sesuai pedoman, dalam bahasa pengguna, dan menjawab pertanyaan lanjutan. (3) Speech AI: Web Speech API untuk suara ke teks dan teks ke suara. |
| Dataset / Data Source | Surat Edaran Gubernur Bali No. 4/2023 dan etika umum pura/upacara, diringkas di `lib/guidelines.js` sebagai konteks prompt. Tidak ada pelatihan model. |
| Open-source Libraries | next, react, react-dom, lucide-react (ikon) |
| Template / Boilerplate | Tidak ada (ditulis dari nol) |
| AI Coding Assistant | Claude (Anthropic) dipakai untuk membantu menulis kode dan dokumentasi. Seluruh kode telah dipahami dan diuji oleh tim. |
| Pre-existing Components | Tidak ada. Project dibuat khusus untuk kompetisi ini. |
| Third-party Assets / Credits | Font Poppins (SIL Open Font License). Foto landing page dari Unsplash (Unsplash License), sumber tiap foto di `lib/photos.js`. |

## Data & Privasi
- Foto dikirim ke Gemini API hanya untuk diproses dan tidak disimpan oleh server Sopan.
- Pada free tier, Google dapat menggunakan data permintaan untuk meningkatkan layanannya.
  Pengguna diingatkan agar tidak memotret wajah orang lain tanpa izin.
- Pada Chrome, pengenalan suara diproses oleh server Google.
- API key hanya ada di environment variable server dan tidak pernah dikirim ke browser.

Pernyataan: Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas
penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.
