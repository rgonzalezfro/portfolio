# Sitio personal

Una sola página con mi experiencia profesional. Sin frameworks, sin dependencias, sin build:
`index.html`, `styles.css` y `main.js`.

```
.
├─ index.html
├─ styles.css
├─ main.js
├─ cv-rafael-gonzalez-frowein.pdf
├─ robots.txt
└─ .nojekyll
```

## Verlo local

Abrí `index.html` en el navegador o servilo por HTTP:

```bash
npx serve .
```

## Editar contenido

Todo el texto está en `index.html`. Los medidores de skills usan `data-level="1..5"`.
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
- El PDF de descarga es una copia del CV; si lo actualizás, reemplazá el archivo.
