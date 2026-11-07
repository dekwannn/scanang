"use client";

import { useEffect } from "react";

// Animasi muncul saat di-scroll untuk elemen bertanda [data-reveal].
// Elemen hanya disembunyikan bila JS berjalan DAN posisinya masih di bawah layar,
// jadi tanpa JS (atau bila script gagal) semua konten tetap terlihat.
export default function Reveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("reveal-wait");
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add("reveal-wait");
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  return null;
}
