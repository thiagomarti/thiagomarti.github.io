# CV interactivo — Thiago Martiñá

Sitio estático (HTML + CSS + JS puro, sin build). Se sube directo a GitHub Pages.

## Cómo publicarlo en tu-usuario.github.io

1. Creá un repositorio en GitHub que se llame **exactamente** `TU-USUARIO.github.io`
   (reemplazá TU-USUARIO por tu nombre de usuario de GitHub, en minúsculas).
2. Subí estos 3 archivos (`index.html`, `styles.css`, `script.js`) a la raíz del repo.
3. Andá a **Settings → Pages** del repo y confirmá que la fuente sea la rama `main` / carpeta raíz
   (en un repo `usuario.github.io` normalmente ya se publica solo, sin configurar nada).
4. En unos minutos el sitio va a estar en `https://TU-USUARIO.github.io`.

## Antes de subirlo, reemplazá:

- En `index.html`, sección **Contacto**: cambiá `TU-USUARIO` en los dos links
  (`github.com/TU-USUARIO` y `linkedin.com/in/TU-USUARIO`) por tus usuarios reales.

## Si preferís que viva en un repo con otro nombre (no el dominio raíz)

Se puede, pero la URL queda `usuario.github.io/nombre-del-repo`. Avisame y te ajusto
si querés esa variante (no requiere casi cambios, esto ya funciona con rutas relativas).

## Estructura

```
index.html   → contenido y estructura de las secciones
styles.css   → estilos (Bricolage Grotesque), modo oscuro y versión imprimible
script.js    → toggle ES/EN
```
