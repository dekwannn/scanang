/** @type {import('next').NextConfig} */
const nextConfig = {
  // Saat `npm run dev`, Next.js memblokir file JS yang diminta dari alamat selain localhost.
  // Izinkan IP laptop di jaringan lokal agar bisa dites dari HP (tombol kamera dll. butuh JS).
  // Tidak berpengaruh pada deploy production (Vercel).
  allowedDevOrigins: ["192.168.2.216", "100.103.173.4", "*.local"],
};

export default nextConfig;
