import Link from "next/link";
import { CircleCheck, CircleX, Landmark, Camera, ArrowRight } from "lucide-react";
import { KEWAJIBAN, LARANGAN, ETIKA_UMUM, GUIDELINE_SOURCE } from "../../lib/guidelines";

export const metadata = { title: "Etiket Bali – Scanang" };

const GROUPS = [
  { icon: CircleCheck, title: "Kewajiban wisatawan", items: KEWAJIBAN, color: "var(--ok)" },
  { icon: CircleX, title: "Larangan wisatawan", items: LARANGAN, color: "var(--no)" },
  { icon: Landmark, title: "Etika di pura & upacara", items: ETIKA_UMUM, color: "var(--basalt)" },
];

export default function Etiket() {
  return (
    <div className="page">
      <header className="page-head">
        <span className="label">Panduan resmi</span>
        <h1>Etiket Bali</h1>
        <p>Ringkasan aturan resmi dan etika umum untuk wisatawan. Halaman ini selalu bisa dibuka, juga saat layanan scan sedang sibuk.</p>
      </header>

      <div className="rules">
        {GROUPS.map((g) => (
          <section key={g.title} className="rule-group" aria-labelledby={`g-${g.items.length}-${g.title.length}`}>
            <div className="rule-group-head">
              <g.icon size={20} style={{ color: g.color }} aria-hidden="true" />
              <h2 id={`g-${g.items.length}-${g.title.length}`}>{g.title}</h2>
            </div>
            <ul className="rule-list">
              {g.items.map((s, i) => <li key={i}><span>{s}</span></li>)}
            </ul>
          </section>
        ))}
      </div>

      <p className="fineprint source">Sumber: {GUIDELINE_SOURCE}, dan etika umum masyarakat Bali.</p>
      <div className="actions">
        <Link href="/scan" className="btn btn-ink">
          <Camera size={20} aria-hidden="true" /> Scan sekarang
          <ArrowRight size={18} className="arrow" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
