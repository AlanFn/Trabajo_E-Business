# V-TECH React

Sitio frontend de V-TECH construido con React y Vite. Incluye Inicio/Nosotros, Catalogo, Contacto y el panel `/admin` para administrar productos.

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

## Campos de producto

El modelo mantiene compatibilidad con productos antiguos que solo tienen `imagenUrl`.

- `precio`: texto opcional. Si contiene un numero, el catalogo lo muestra como `Gs. 120.000`. Si esta vacio, muestra `Precio a consultar`.
- `imagenUrl`: imagen principal o fallback para productos antiguos.
- `imagenes`: lista de imagenes del producto. Si tiene elementos, el catalogo y el admin la usan como galeria. Si esta vacia, se usa `imagenUrl`.

Todas las imagenes pasan por `normalizarImagenUrl`, que convierte enlaces compartidos de Google Drive a:

```text
https://drive.google.com/thumbnail?id=ID&sz=w700
```

## Google Sheets

La hoja `productos` debe tener estas columnas:

```text
id, nombre, categoria, subcategoria, tipo, descripcionCorta, descripcionLarga,
colores, talles, medidas, caracteristicas, propiedades, estadoStock, precio,
activo, destacado, imagenUrl, imagenes, fechaCreacion, fechaActualizacion
```

Las columnas nuevas para esta etapa son:

```text
precio
imagenes
```

Formato de `imagenes`: varias URLs separadas por `|`.

```text
https://drive.google.com/file/d/ID_1/view|https://drive.google.com/file/d/ID_2/view
```

Formato de `precio`: numero o texto simple. Recomendado:

```text
120000
```

## Carrito de consulta

El catalogo usa un carrito persistente en `localStorage` con la clave:

```text
vtech_cart
```

Cada item guarda producto, imagen principal, precio, color, talle y cantidad. Si se agrega el mismo producto con el mismo color y talle, se suma cantidad. El drawer del carrito genera una unica consulta por WhatsApp con subtotales y total estimado cuando todos los productos tienen precio.

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
- Agregar manualmente en Google Sheets las columnas `precio` e `imagenes`.
- Copiar el contenido actualizado de `apps-script/productos.gs` en el editor de Apps Script.
- Guardar el proyecto de Apps Script.
- Ir a Deploy > Manage deployments.
- Editar el Web App existente o crear una nueva version.
- Seleccionar la nueva version y desplegar.
- Mantener el acceso del Web App igual que el despliegue actual.
- Si cambia la URL del Web App, actualizar `appsScriptUrl` en `src/config/apiConfig.js`.

Apps Script soporta las acciones `listar`, `crear`, `editar`, `ocultar`, `reactivar` y `eliminarDefinitivo`, y devuelve respuestas JSON con `ok`, `producto`, `productos`, `id` o `error` segun corresponda.
