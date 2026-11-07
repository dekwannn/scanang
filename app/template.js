// template.js di-mount ulang setiap navigasi, jadi animasi masuk berjalan di tiap pindah halaman.
export default function Template({ children }) {
  return <div className="route-enter">{children}</div>;
}
