# Sitio personal

Una sola página con mi experiencia profesional. Sin frameworks, sin dependencias, sin build:
`index.html`, `styles.css`, `main.js` e `i18n.js`.

```
.
├─ index.html
├─ styles.css
├─ main.js
├─ i18n.js
├─ cv-rafael-gonzalez-frowein.pdf
├─ cv-rafael-gonzalez-frowein-en.pdf
├─ robots.txt
└─ .nojekyll
```

## Idiomas

El sitio carga en **inglés** por defecto. Con el selector `EN / ES` del encabezado se cambia a
español; la elección se guarda en `localStorage` y también se puede compartir con `?lang=es`.

- El HTML está escrito en inglés (idioma por defecto y fallback sin JavaScript).
- Los textos en español viven en `i18n.js`, identificados con `data-i18n` en el HTML.
- `main.js` aplica la traducción y actualiza `lang`, `title`, metadata y `aria-label`s.
- El botón de CV descarga `cv-rafael-gonzalez-frowein-en.pdf` en inglés y
  `cv-rafael-gonzalez-frowein.pdf` en español (se cambia con `data-i18n-href`).
- Para traducir un texto nuevo: agregale `data-i18n="mi.clave"` y sumá la clave en `i18n.js`.
- Para agregar otro idioma: copiá el bloque de `es`, traducilo y sumá el botón en `.lang-switch`.

## Verlo local

Abrí `index.html` en el navegador o servilo por HTTP:

```bash
npx serve .
```

## Editar contenido

Todo el texto en inglés está en `index.html`. Los medidores de skills usan `data-level="1..5"`.
Para agregar una sección, copiá un bloque `<section class="section" id="...">` y sumá el
link en `.nav`.

`?noreveal=1` desactiva las animaciones (útil para capturas).

## Publicar en GitHub Pages

Este repo **es** el sitio, así que no hace falta build ni Actions:

1. Subí el repo a GitHub.
2. Settings → Pages → **Source: Deploy from a branch**.
3. Branch `main`, carpeta `/ (root)`. Guardar.

En un minuto queda en `https://<usuario>.github.io/<repo>/`.

## Notas

- Fuentes: Inter + JetBrains Mono desde Google Fonts, con fallback a system-ui.
- Respeta `prefers-reduced-motion`.
- Metadatos Open Graph y JSON-LD `Person`.
- El PDF de descarga es una copia del CV; si lo actualizás, reemplazá el archivo correspondiente
  (`-en.pdf` para inglés, sin sufijo para español).
