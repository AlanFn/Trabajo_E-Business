# V-TECH React

Sitio frontend de V-TECH construido con React y Vite. Incluye las paginas Inicio/Nosotros, Catalogo, Contacto y el panel `/admin` para administrar productos.

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La app queda disponible en:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

El resultado se genera en `dist/`.

## Panel admin

Entrar a:

```text
http://127.0.0.1:5173/admin
```

Desde `/admin` se pueden crear, editar, ocultar, reactivar y eliminar definitivamente productos. La eliminacion definitiva esta permitida solo para productos ocultos.

## Productos y catalogo

El catalogo usa `src/services/productosService.js`. Puede funcionar en modo local o remoto segun `src/config/apiConfig.js`:

- `modo: "local"` usa los productos base de `src/data/products.js` y guarda cambios simulados en `localStorage`.
- `modo: "remoto"` consulta Google Sheets mediante Apps Script.

Los productos publicos se filtran por `activo === true`. Los productos ocultos siguen visibles en `/admin`, pero no aparecen en el catalogo publico.

## Imagenes de productos

Las imagenes del catalogo se administran desde `/admin` mediante el campo `imagenUrl`. Se aceptan enlaces directos de imagen y enlaces compartidos de Google Drive; `src/utils/imagenes.js` normaliza URLs de Drive al formato de thumbnail.

Si una imagen no carga, la card muestra el fallback `Sin imagen`.

## Imagenes institucionales

Las imagenes de Inicio/Nosotros estan en:

```text
public/images/inicio/hero.png
public/images/inicio/nosotros.jpeg
public/images/inicio/sectores.jpeg
```

Sus rutas se configuran en `src/pages/HomePage.jsx`.

## Contacto

El sitio usa estos datos principales:

- Email: `Ventas@vtech.com.py`
- WhatsApp: configurado en `src/utils/whatsapp.js`
- Instagram y Threads: configurados en `src/pages/ContactPage.jsx`

El email se muestra en Contacto con enlace `mailto:Ventas@vtech.com.py`.

## Apps Script

El script remoto esta en `apps-script/productos.gs`.

Antes de produccion:

- Reemplazar `ADMIN_API_TOKEN` en Apps Script por un token real y seguro.
- Configurar el mismo token en `src/config/apiConfig.js`.
- Configurar `PRODUCTOS_API_CONFIG.appsScriptUrl` con la URL publicada del Web App de Apps Script.
- Verificar que la hoja `productos` tenga estas columnas:

```text
id, nombre, categoria, subcategoria, tipo, descripcionCorta, descripcionLarga,
colores, talles, medidas, caracteristicas, propiedades, estadoStock, activo,
destacado, imagenUrl, fechaCreacion, fechaActualizacion
```

Apps Script soporta las acciones `listar`, `crear`, `editar`, `ocultar`, `reactivar` y `eliminarDefinitivo`, y devuelve respuestas JSON con `ok`, `producto`, `productos`, `id` o `error` segun corresponda.
