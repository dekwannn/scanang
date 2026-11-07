/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight, ScanLine, BookOpen, Check, X, Camera, Search, Volume2,
  Globe, ScrollText, ShieldCheck, WifiOff, MessageCircleQuestion, Eye,
  Lightbulb, Info,
} from "lucide-react";
import { img, photo } from "../lib/photos";
import Reveal from "../components/Reveal";

const Photo = ({ k, w, h, eager = false }) => (
  <img src={img(k, w, h)} alt={photo(k).alt} width={w} height={h}
    loading={eager ? "eager" : "lazy"} decoding="async" />
);

const FACTS = [
  { value: "8", label: "languages" },
  { value: "Free", label: "no sign-up" },
  { value: "Web", label: "no app to install" },
];

const STEPS = [
  { icon: Camera, title: "Take a photo", text: "Point your phone at a temple gate, an offering, a ceremony or your outfit." },
  { icon: Search, title: "Sopan reads it", text: "It identifies what is in the photo and checks Bali's official rules for visitors." },
  { icon: Volume2, title: "Listen and ask", text: "Hear the answer in your language. Ask a follow-up question by voice or text." },
];

const ANSWER = [
  { icon: Info, title: "What it is", text: "The name of the object or ceremony, in Balinese and your language." },
  { icon: BookOpen, title: "What it means", text: "Why it matters to Balinese people, in one or two sentences." },
  { icon: Check, title: "What to do", text: "Up to four short, concrete actions that show respect." },
  { icon: X, title: "What to avoid", text: "Up to four things that would offend, based on official rules." },
  { icon: Lightbulb, title: "A practical tip", text: "One thing to remember for the rest of your trip." },
];

const DIRECTIONS = [
  { color: "#f7f3e8", name: "White", dir: "East", deity: "Iswara" },
  { color: "#c8402f", name: "Red", dir: "South", deity: "Brahma" },
  { color: "#f2a91f", name: "Yellow", dir: "West", deity: "Mahadewa" },
  { color: "#1f2b57", name: "Dark blue", dir: "North", deity: "Wisnu" },
];

const FEATURES = [
  { icon: Eye, title: "Recognises Balinese scenes", text: "Canang sari, penjor, pura gates, odalan, ngaben, melasti, kamen and selendang." },
  { icon: Globe, title: "Speaks your language", text: "English, Indonesian, Chinese, Russian, Japanese, Korean, French and German." },
  { icon: MessageCircleQuestion, title: "Answers follow-up questions", text: "“Can I take photos here?” The photo stays in context for every question." },
  { icon: ScrollText, title: "Based on official rules", text: "Bali Governor Circular No. 4/2023 and common temple etiquette." },
  { icon: ShieldCheck, title: "Honest when unsure", text: "If the photo is unclear, Sopan tells you to ask a local or the pemangku." },
  { icon: WifiOff, title: "Works when busy", text: "Backup systems take over automatically. The etiquette guide works offline." },
];

const FAQ = [
  { q: "Is Sopan free?", a: "Yes. There is no account, no subscription and nothing to install. Open the website on your phone." },
  { q: "Do you keep my photos?", a: "No. A photo is sent once to be analysed and is not stored by Sopan." },
  { q: "What if the answer is wrong?", a: "Sopan shows how confident it is. When it is unsure, it says so. Local signs and the advice of locals always come first." },
  { q: "Where do the rules come from?", a: "From Bali Governor Circular No. 4/2023 for foreign visitors, plus etiquette commonly observed at temples and ceremonies." },
];

export default function Landing() {
  return (
    <div className="lp">
      <Reveal />

      {/* 1. HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="kicker">Bali culture guide for visitors</span>
            <h1>Know what it means before you step on it.</h1>
            <p className="lead">
              Take a photo of a temple, an offering or a ceremony. Sopan tells you what it is,
              what to do and what to avoid, spoken in your language.
            </p>
            <div className="cta-row">
              <Link href="/scan" className="btn btn-ink">
                <ScanLine size={20} aria-hidden="true" /> Start scanning
                <ArrowRight size={18} className="arrow" aria-hidden="true" />
              </Link>
              <Link href="/etiket" className="btn btn-line">
                <BookOpen size={20} aria-hidden="true" /> Read the etiquette
              </Link>
            </div>
            <dl className="facts">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="phone" aria-label="Example result for a canang sari">
            <div className="phone-shot">
              <Photo k="canang" w={640} h={480} eager />
              <span className="scanline" aria-hidden="true" />
              <span className="vf tl" /><span className="vf tr" /><span className="vf bl" /><span className="vf br" />
            </div>
            <div className="phone-body">
              <div className="phone-title">
                <span className="label">Example result</span>
                <span className="chip tinggi">Sensitivity: high</span>
              </div>
              <h3>Canang sari</h3>
              <p>A daily offering of thanks, placed fresh every morning.</p>
              <div className="demo-row ok"><Check size={15} aria-hidden="true" /> Walk around it carefully</div>
              <div className="demo-row no"><X size={15} aria-hidden="true" /> Don't step on it or move it</div>
              <div className="demo-audio">
                <span className="bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                Reading aloud in English
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="section section-alt" id="how">
        <div className="container">
          <header className="section-head" data-reveal>
            <span className="kicker">How it works</span>
            <h2>Three steps, a few seconds.</h2>
          </header>
          <ol className="grid-3 steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card" data-reveal style={{ "--d": `${i * 90}ms` }}>
                <div className="card-top">
                  <span className="tile"><s.icon size={22} aria-hidden="true" /></span>
                  <span className="step-no">{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. WHAT YOU GET */}
      <section className="section">
        <div className="container two-col">
          <header className="section-head sticky" data-reveal>
            <span className="kicker">Every answer</span>
            <h2>Five things you get from one photo.</h2>
            <p className="sub">Short enough to read while you walk. Every answer can also be read aloud.</p>
          </header>
          <ul className="answer-list">
            {ANSWER.map((a, i) => (
              <li key={a.title} data-reveal style={{ "--d": `${i * 60}ms` }}>
                <span className="tile sm"><a.icon size={18} aria-hidden="true" /></span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. EXAMPLE: CANANG MEANING */}
      <section className="section section-alt">
        <div className="container two-col center">
          <figure className="photo-card" data-reveal>
            <Photo k="flowers" w={900} h={900} />
          </figure>
          <div data-reveal>
            <span className="kicker">Example of what Sopan explains</span>
            <h2>The four colours of a canang sari.</h2>
            <p className="sub">Each flower colour faces the direction of the god it honours.</p>
            <table className="dir-table">
              <thead>
                <tr><th scope="col">Colour</th><th scope="col">Direction</th><th scope="col">Honours</th></tr>
              </thead>
              <tbody>
                {DIRECTIONS.map((d) => (
                  <tr key={d.name}>
                    <td><span className="swatch" style={{ background: d.color }} aria-hidden="true" />{d.name}</td>
                    <td>{d.dir}</td>
                    <td>{d.deity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section className="section">
        <div className="container">
          <header className="section-head" data-reveal>
            <span className="kicker">Features</span>
            <h2>Made for use on the street.</h2>
          </header>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feature" data-reveal style={{ "--d": `${(i % 3) * 90}ms` }}>
                <span className="tile"><f.icon size={22} aria-hidden="true" /></span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="section section-alt">
        <div className="container two-col">
          <header className="section-head" data-reveal>
            <span className="kicker">Questions</span>
            <h2>Before you start.</h2>
          </header>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q} data-reveal>
                <summary>{f.q}<span className="plus" aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-card" data-reveal>
            <div>
              <h2>Ready for your next temple visit?</h2>
              <p className="sub">Open the camera and take your first photo.</p>
            </div>
            <Link href="/scan" className="btn btn-ink">
              <Camera size={20} aria-hidden="true" /> Open the camera
              <ArrowRight size={18} className="arrow" aria-hidden="true" />
            </Link>
          </div>
          <p className="credits">Photos: <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a></p>
        </div>
      </section>
    </div>
  );
}
