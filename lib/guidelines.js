// Pedoman etika wisatawan di Bali.
// Sumber utama: Surat Edaran Gubernur Bali No. 4 Tahun 2023 tentang Tatanan Baru
// bagi Wisatawan Mancanegara Selama Berada di Bali, ditambah etika umum yang lazim
// berlaku di pura dan upacara Bali.
// CATATAN: verifikasi ulang butir-butir di bawah dengan teks resmi SE sebelum submit.

export const GUIDELINE_SOURCE =
  "Surat Edaran Gubernur Bali No. 4 Tahun 2023 (Tatanan Baru bagi Wisatawan Mancanegara)";

export const KEWAJIBAN = [
  "Memuliakan kesucian pura, pratima (simbol suci), dan simbol keagamaan lainnya.",
  "Menghormati adat istiadat, tradisi, seni, budaya, dan kearifan lokal masyarakat Bali.",
  "Berpakaian sopan dan pantas saat berkunjung ke tempat suci, daya tarik wisata, dan tempat umum.",
  "Berperilaku sopan di kawasan suci, daya tarik wisata, restoran, jalan, dan tempat umum.",
  "Didampingi pemandu wisata berlisensi saat mengunjungi daya tarik wisata.",
  "Menukar uang di tempat penukaran resmi dan bertransaksi dengan Rupiah / QRIS.",
  "Mematuhi peraturan lalu lintas dan memiliki SIM yang berlaku jika berkendara.",
  "Menginap di akomodasi yang berizin.",
];

export const LARANGAN = [
  "Memasuki utama mandala dan madya mandala (area utama) pura, kecuali untuk sembahyang dengan busana adat Bali.",
  "Memanjat pohon atau bangunan yang disakralkan.",
  "Berperilaku yang menodai kesucian tempat suci, misalnya berfoto tidak senonoh atau tanpa busana.",
  "Membuang sampah sembarangan atau mencemari danau, mata air, sungai, laut, dan tempat umum.",
  "Menggunakan plastik sekali pakai (kantong, sedotan, styrofoam).",
  "Berkata kasar, membuat gaduh, atau bersikap agresif kepada aparat, masyarakat, maupun wisatawan lain.",
  "Bekerja atau berusaha tanpa dokumen resmi.",
  "Terlibat perdagangan ilegal flora, fauna, benda budaya, atau narkotika.",
];

export const ETIKA_UMUM = [
  "Kenakan kamen (sarung) dan selendang (senteng) di pinggang saat memasuki area pura; bahu tertutup.",
  "Jangan menginjak, melangkahi, atau memindahkan canang/sesajen di jalan atau trotoar.",
  "Jangan duduk lebih tinggi dari pemangku (pendeta) atau sesajen saat upacara berlangsung.",
  "Jangan berjalan di depan orang yang sedang sembahyang; minta izin sebelum memotret upacara.",
  "Banyak pura meminta perempuan yang sedang menstruasi dan orang yang berduka (cuntaka) tidak masuk; ikuti papan petunjuk setempat.",
  "Saat Nyepi, seluruh Bali hening 24 jam: tidak keluar penginapan, tidak menyalakan lampu terang, tidak membuat keramaian.",
  "Beri jalan bila ada iring-iringan upacara (melasti, ngaben, odalan); jangan menyela barisan.",
  "Gunakan tangan kanan saat memberi atau menerima sesuatu.",
];

export function guidelinesAsText() {
  const list = (arr) => arr.map((s) => `- ${s}`).join("\n");
  return [
    `Sumber: ${GUIDELINE_SOURCE}`,
    "KEWAJIBAN WISATAWAN:",
    list(KEWAJIBAN),
    "LARANGAN WISATAWAN:",
    list(LARANGAN),
    "ETIKA UMUM DI PURA & UPACARA:",
    list(ETIKA_UMUM),
  ].join("\n");
}
