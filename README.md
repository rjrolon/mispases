# Pases Salones VIP — Bootstrap + Responsive

Sitio estático listo para **GitHub Pages**, hecho con **Bootstrap 5** y diseño adaptativo para móviles.

## Estructura
- `index.html` — UI + filtros (offcanvas en móvil, barra en desktop)
- `assets/styles.css` — estilos mínimos (encima de Bootstrap)
- `assets/app.js` — carga y render de datos
- `data/pases.json` — **tu base de datos** en JSON (una fila por tarjeta/beneficio)

## Cómo publicar en GitHub Pages
1. Subí todo a un repo (raíz del proyecto).
2. En el repo: **Settings → Pages → Source: Deploy from a branch**, Branch **main**, Folder **/**.
3. Abrí la URL que te da GitHub Pages (forma `https://usuario.github.io/repo/`).

## Actualizar datos
- Editá `data/pases.json` y hacé commit/push. GitHub Pages se actualiza solo.
- Cada objeto representa un beneficio de pase para una tarjeta específica.
