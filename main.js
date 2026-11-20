// Interacciones mínimas: idioma, año, medidores de skills, reveal y nav activa.

// ---------------------------------------------------------------
// Idioma (inglés por defecto, español opcional)
// ---------------------------------------------------------------

const DEFAULT_LANG = "en";
const SUPPORTED_LANGS = ["en", "es"];
const LANG_STORAGE_KEY = "portfolio.lang";
const translations = window.PORTFOLIO_TRANSLATIONS ?? {};

const langButtons = [...document.querySelectorAll("[data-set-lang]")];
const langStatus = document.getElementById("lang-status");

// Guardamos el contenido original (el inglés que está en el HTML) para poder volver.
const translatable = [...document.querySelectorAll("[data-i18n]")].map((element) => ({
  element,
  key: element.getAttribute("data-i18n"),
  html: element.innerHTML,
}));

const I18N_ATTRS = ["aria-label", "title", "alt", "content", "href"];
const translatableAttrs = [
  ...document.querySelectorAll(I18N_ATTRS.map((attr) => `[data-i18n-${attr}]`).join(",")),
].map((element) => ({
  element,
  attrs: I18N_ATTRS.map((attr) => ({
    attr,
    key: element.getAttribute(`data-i18n-${attr}`),
    original: element.getAttribute(attr) ?? "",
  })).filter((entry) => entry.key),
}));

const readLangFromUrl = () => {
  const value = new URLSearchParams(window.location.search).get("lang");
  return SUPPORTED_LANGS.includes(value) ? value : null;
};

const readStoredLang = () => {
  try {
    const value = localStorage.getItem(LANG_STORAGE_KEY);
    return SUPPORTED_LANGS.includes(value) ? value : null;
  } catch {
    return null;
  }
};

const storeLang = (lang) => {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // localStorage puede estar bloqueado (modo privado); seguimos sin persistir.
  }
};

const syncLangParam = (lang) => {
  try {
    const url = new URL(window.location.href);
    if (lang === DEFAULT_LANG) url.searchParams.delete("lang");
    else url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
  } catch {
    // Si el navegador bloquea history, no es crítico.
  }
};

const applyLanguage = (lang, { announce = false } = {}) => {
  const dict = lang === DEFAULT_LANG ? {} : translations[lang] ?? {};

  translatable.forEach(({ element, key, html }) => {
    const value = dict[key] ?? html;
    if (element.tagName === "TITLE") element.textContent = value;
    else element.innerHTML = value;
  });

  translatableAttrs.forEach(({ element, attrs }) => {
    attrs.forEach(({ attr, key, original }) => {
      element.setAttribute(attr, dict[key] ?? original);
    });
  });

  const meterTemplate = dict["meter.level"] ?? "level {n} of 5";
  document.querySelectorAll(".meter").forEach((meter) => {
    const level = Number(meter.dataset.level ?? 0);
    meter.setAttribute("aria-label", meterTemplate.replace("{n}", String(level)));
  });

  document.documentElement.lang = lang;

  langButtons.forEach((button) => {
    const active = button.dataset.setLang === lang;
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  if (announce && langStatus) {
    langStatus.textContent =
      lang === "es" ? "Idioma cambiado a español" : "Language changed to English";
  }
};

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.setLang;
    if (!SUPPORTED_LANGS.includes(lang) || lang === document.documentElement.lang) return;
    applyLanguage(lang, { announce: true });
    storeLang(lang);
    syncLangParam(lang);
  });
});

applyLanguage(readLangFromUrl() ?? readStoredLang() ?? DEFAULT_LANG);

// ---------------------------------------------------------------
// Interacciones
// ---------------------------------------------------------------

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
