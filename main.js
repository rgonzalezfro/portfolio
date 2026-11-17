// Interacciones mínimas: año, medidores de skills, reveal y nav activa.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// ?noreveal=1 desactiva las animaciones (útil para capturas o pruebas)
const disableReveal = new URLSearchParams(window.location.search).has("noreveal");

// Año del footer
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// Medidores: 5 segmentos según data-level
document.querySelectorAll(".meter").forEach((meter) => {
  const level = Number(meter.dataset.level ?? 0);
  for (let i = 0; i < 5; i++) {
    const segment = document.createElement("span");
    if (i < level) segment.dataset.on = "true";
    meter.append(segment);
  }
});

const fillMeter = (meter) => {
  meter.querySelectorAll("span").forEach((segment) => {
    if (segment.dataset.on === "true") segment.classList.add("on");
  });
};

if (!reduceMotion && !disableReveal && "IntersectionObserver" in window) {
  // Reveal de secciones y tarjetas
  const revealTargets = document.querySelectorAll(
    ".section-head, .entry, .panel, .project, .contact-card, .education",
  );
  revealTargets.forEach((element) => element.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  // Los medidores se llenan cuando entran en pantalla
  const meterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fillMeter(entry.target);
        meterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  document.querySelectorAll(".meter").forEach((meter) => meterObserver.observe(meter));

  // Link activo en la nav
  const links = [...document.querySelectorAll(".nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === id));
      });
    },
    { rootMargin: "-40% 0px -50% 0px" },
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  document.querySelectorAll(".meter").forEach(fillMeter);
}
