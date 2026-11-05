# Registro de Cambios para Despliegue en Servidor Estático (Subdominio /app)

Este documento detalla todas las modificaciones realizadas en el proyecto para asegurar su correcto funcionamiento al ser exportado como un sitio web estático (`output: 'export'`) y alojado bajo el subdominio o subdirectorio `/app`.

---

## 1. Configuración de Next.js (`next.config.mjs`) y Scripts

El repositorio mantiene una configuración apta para el desarrollo dinámico. Los ajustes de exportación se aplican únicamente en el pipeline de build estático.

**Configuración del repositorio (`pnpm dev` y ejecución dinámica):**

```javascript
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  async rewrites() { /* solo en desarrollo */ },
};
```

En local, `NEXT_PUBLIC_BASE_PATH` no está definido en `.env.local`, así que `basePath` queda vacío y los `rewrites` siguen activos.

**Configuración aplicada solo por el build estático:**

```javascript
{
  output: 'export',
  basePath: '/app',
  images: { unoptimized: true },
  trailingSlash: true,
}
```

No agregar estos valores al `next.config.mjs` que usa `pnpm dev`.

> **Nota sobre `rewrites`:** Las reglas de `rewrites` quedaron restringidas al entorno de desarrollo (`NODE_ENV === 'development'`), ya que Next.js no permite usarlas junto con `output: 'export'`. En la compilación estática no se aplican y las peticiones a APIs externas se manejan directamente mediante la URL completa configurada en las variables de entorno.

> **Nota sobre `package.json`:** Se actualizó el script de compilación a `"build": "next build"` (eliminando el flag experimental `--turbopack` en build) para garantizar la recolección, prerenderizado y exportación completa de páginas estáticas.

> **Nota sobre el modo local:** el `next.config.mjs` del repositorio solo define `basePath` a partir de `NEXT_PUBLIC_BASE_PATH` (vacío en `.env.local`) y los `rewrites` de desarrollo. `output: 'export'`, `images.unoptimized` y `trailingSlash` pertenecen al pipeline de build estático y no deben añadirse al config que usa `pnpm dev`.

---

## 2. Manejo de Conectividad y APIs (`src/lib/axios.js`)

La instancia `connectivityApi` usa `NEXT_PUBLIC_CONNECTIVITY_API_URL` como `baseURL` (con fallback a `http://localhost:4000/`). El comportamiento depende del entorno:

- **Desarrollo (`pnpm dev`):** `axios.js` sustituye la URL absoluta por la ruta relativa `/api-connectivity` conservando el `pathname`, y el `rewrite` de `next.config.mjs` envía `/api-connectivity/:path*` a `https://ia.rutamayatravel.com/:path*`. En local se ignora el host de la variable; solo se usa su ruta.
- **Build estático (`output: 'export'`):** no existen `rewrites`; las peticiones van directamente a la URL absoluta configurada en el entorno, que queda embebida en el bundle en tiempo de compilación.

Cada paquete debe apuntar a su propio servicio de conectividad:

| Paquete | `NEXT_PUBLIC_CONNECTIVITY_API_URL` |
|---|---|
| `crm_estatico.zip` | `https://ia.rutamayatravel.com/2b/crm/` |
| `crmdev_estatico.zip` | `https://ia.rutamayatravel.com/2b/crmdev/` |
| `crmdemo_estatico.zip` | `https://ia.rutamayatravel.com/2b/crmdemo/` |

> La misma variable se usa en `QuoteCard.js` (PDFs de cotizaciones), `ChatPanel.js` (adjuntos), `useSocket.js` (WebSocket) y en los servicios `conectividad`, `mensajeria`, `notifications`, `quotes` y `templates`. Un valor equivocado deja esas funciones apuntando al entorno incorrecto.

Se mantiene el soporte completo de intercepción para autenticación con Bearer token en `localStorage` y el ciclo de refresco asíncrono con cola de peticiones (`failedQueue`).

---

## 3. Reestructuración de Rutas Dinámicas a Parámetros de Consulta (Query Parameters)

Next.js requiere conocer todos los posibles valores de las rutas dinámicas (carpetas como `[id]`) durante el tiempo de construcción (`build time`) si se utiliza una exportación estática. Para un CRM donde los IDs de clientes, vendedores, pagos y reservaciones son dinámicos y consultados desde base de datos externa, se migraron todas las rutas dinámicas al uso de **Parámetros de Consulta (Query Parameters)**:

- **De:** `/clientes/[id]` (ej. `/clientes/123`) ➔ **A:** `/clientes/detalle?id=123`
- **De:** `/pagos/[id]` ➔ **A:** `/pagos/detalle?id=123`
- **De:** `/vendedores/[id]` ➔ **A:** `/vendedores/detalle?id=123`
- **De:** `/reservaciones/editar/[id]` ➔ **A:** `/reservaciones/editar?id=123`

### Pasos aplicados:
1. **Creación de páginas estáticas:**
   - `src/app/(crm)/clientes/detalle/page.js`: Carga el perfil del cliente, tabs de conversaciones, correos, cotizaciones, historial de compras y documentos usando `useSearchParams().get("id")`.
   - `src/app/(crm)/pagos/detalle/page.js`: Carga el desglose, historial de pagos y modal de registro.
   - `src/app/(crm)/vendedores/detalle/page.js`: Carga la información del vendedor, documentos y tabla de ventas asociadas.
   - `src/app/(crm)/reservaciones/editar/page.js`: Inicializa el contexto de edición de reserva y su formulario integral.
2. **Eliminación de carpetas dinámicas antiguas:**
   - Se eliminaron completamente las carpetas `src/app/(crm)/clientes/[id]`, `src/app/(crm)/pagos/[id]`, `src/app/(crm)/vendedores/[id]` y `src/app/(crm)/reservaciones/editar/[id]`, garantizando cero rutas `ƒ (Dynamic)` en la compilación.
3. **Envoltura obligatoria con `<Suspense>`:**
   - Cada componente que lee `useSearchParams()` se dividió en un componente de contenido interno y un componente de exportación por defecto envuelto en `<Suspense fallback={...}>`. Esto previene desajustes de hidratación y permite que Next.js prerenderice la estructura base en tiempo de compilación.
   - Aplica también a la vista de Mensajería (`src/app/(crm)/mensajeria/page.js`), la cual utiliza `useSearchParams` para el parámetro `clientId`.

---

## 4. Actualización Exhaustiva de Enlaces (`<Link>`)

Todos los enlaces en las tablas y componentes fueron sincronizados con las nuevas rutas estáticas con query parameters:

- En `ClientTable.js`: Se actualizó a `<Link href={`/clientes/detalle?id=${row.id}`} passHref>`.
- En `ClientInfoPanel.js` y `ChatPanel.js`: Se actualizó a `href={`/clientes/detalle?id=${clientInfo.id}`}`.
- En `BookingPriceBreakdown.js`: Se actualizó a `href={`/clientes/detalle?id=${vendedor?.value}`}`.
- En `VendedoresTable.js`: Se actualizó a `<Link href={`/vendedores/detalle?id=${row.id}`} passHref target="_blank">`.
- En `IngresosTable.js`:
  - Enlace en folio a `href={`/reservaciones/editar?id=${row.id_venta}`}`.
  - Enlace en acciones a `href={`/pagos/detalle?id=${row.id}`}`.
- En `EgresosTable.js`:
  - Enlace en folio a `href={`/reservaciones/editar?id=${row.id_venta}`}`.
  - Enlace en acciones a `href={`/pagos/detalle?id=${row.id}`}`.
- En `BookingsList.js`: Se actualizó a `href={`/reservaciones/editar?id=${row.id_venta}`}`.
- En `InfoTableVendedor.js`: Se actualizó a `href={`/reservaciones/editar?id=${row.id_venta}`}`.
- En `ClientProfilePurchases.js`: Se corrigió el enlace de folio a `href={`/reservaciones/editar?id=${row.id}`}`.
- En `calendario/page.js`: Se actualizó a `href={`/reservaciones/editar?id=${ev.id_venta}`}`.
- En `BookingTableHeader.js`: Se sustituyó la etiqueta HTML nativa `<a href="reservaciones/crear">` por `<Link href="/reservaciones/crear">` para respetar el prefijo `/app`.

> **Regla recurrente: enlaces internos y `basePath`.** `next/link` solo antepone el `basePath` a rutas absolutas que empiezan por `/`. Un `href` relativo como `caja/pagos/123` o un `<a href>` nativo no recibe el prefijo `/app`; el navegador lo resuelve contra la URL actual y el síntoma es una URL como `https://crm.2businesstravel.com/caja/pagos/detalle?id=6` sin `/app`. Todos los enlaces internos deben usar `Link` con una ruta absoluta (`/...`) o `withBasePath`.
>
> Correcciones aplicadas: en `CajaTable.js` el `<a href>` relativo se reemplazó por `Link` con `/caja/pagos/${id}`; en `BookingsList.js`, `IngresosTable.js` y `EgresosTable.js` se agregó la barra inicial a `/reservaciones/editar/${row.id_venta}`. En la variante con query params, el enlace equivalente de caja es `/caja/pagos/detalle?id=${id}`.

---

## 5. Corrección de Rutas de Imágenes y Recursos Estáticos

Cuando se utiliza `output: 'export'` con `basePath: '/app'`, los recursos referenciados fuera del pipeline de componentes de Next.js (como Canvas, etiquetas HTML directas o librerías de generación de PDF) requieren el prefijo `/app/`:

1. **Fuentes de React-PDF (`src/components/pdf/fonts.js`)**:
   - Se configuraron las rutas con prefijo `/app/fonts/`:
     - `/app/fonts/Inter-Regular.ttf`
     - `/app/fonts/Inter-Medium.ttf`
     - `/app/fonts/Inter-SemiBold.ttf`
     - `/app/fonts/Inter-Bold.ttf`
     - `/app/fonts/Inter-MediumItalic.ttf`

2. **Imágenes e Iconos de React-PDF (`src/components/pdf/BookingPdf.js`)**:
   - Se configuraron rutas absolutas con `/app/pdf/`:
     - `/app/pdf/header-pdf.png`
     - `/app/pdf/bed.png` (Hospedaje)
     - `/app/pdf/van.png` (Traslados)
     - `/app/pdf/plane.png` (Vuelos)
     - `/app/pdf/map.png` (Tours)
     - `/app/pdf/plus.png` (Otros servicios)
     - `/app/pdf/location.png`
     - `/app/pdf/email.png`
     - `/app/pdf/phone-call.png`
   - Fallback de logotipo: si la agencia no cuenta con logotipo cargado en servidor, se utiliza `/app/vjnexuswa.jpg` en lugar del archivo inexistente `logo-placeholder.png`.

3. **Logotipo en `Sidebar.js`**:
   - Por defecto usa `brand.logo` (`/app/vjnexuswa.jpg` o `/app/2bt2025.png` según el dominio).
   - Para logotipos remotos de agencias se asegura protocolo seguro `https://` y se añade manejador `onError` que recurre a `brand.logo` en caso de falla de carga.

4. **Avatares en `RightBar.js`**:
   - Se configuró el prefijo explícito `/app/avatars/...` para la generación de avatares predeterminados.

5. **Logotipo de la pantalla de login (`src/app/login/page.js`)**:
   - `next/image` recibe `brand.logo`, ya prefijado con `withBasePath`, y `unoptimized` para que use ese `src` tal cual.

6. **Logotipos de agencia dependientes del entorno**:
   - `Sidebar.js`, `BookingPdf.js` y `GeneralTab.js` construyen la URL del logotipo a partir de `NEXT_PUBLIC_API_URL` (`{API_URL}/images/agencia/...`), de modo que cada versión del CRM consume el logotipo de su propio endpoint y no el de producción.
7. **Branding dinámico por dominio (`src/lib/brand.js`, `src/hooks/useBrand.js`)**:
   - `2businesstravel.com` usa `/2bt2025.png` y `/favicon-2b.ico`; `vjnexus.com.mx` usa `/vjnexuswa.jpg` y `/favicon.ico`.
   - Las rutas se prefijan con `withBasePath`, por lo que en local (`pnpm dev`, sin `NEXT_PUBLIC_BASE_PATH`) se sirven desde la raíz.
   - El logo se resuelve con `useBrand` en login, header y sidebar; el favicon y el título se resuelven en cliente desde `src/app/layout.js`.
   - Override de QA: `?brand=2b` fuerza 2B y `?brand=auto` lo limpia.

---

## 6. Configuración del Servidor Web (`public/.htaccess`)

El archivo `.htaccess` de Apache / cPanel / Plesk se genera en cada compilación a partir de `deploy/htaccess.template` y se incluye automáticamente en la carpeta de distribución `out/`. Además de las reescrituras, define la **política de caché**, necesaria porque el export estático de Next no puede usar `headers()` de `next.config.mjs`:

- **HTML y payloads RSC (`.txt`)**: `no-cache, must-revalidate`. El `index.html` referencia los chunks `_next` por hash de contenido; si el HTML quedara cacheado, pediría hashes que ya no existen tras un despliegue.
- **Assets con hash de contenido en el nombre** (opcional, ver más abajo): `public, max-age=31536000, immutable`.
- **Assets inexistentes**: se corta la reescritura (`RewriteRule … - [L]`) para que Apache devuelva su **404 natural** en lugar del fallback a `index.html`. Sin esta regla, una petición a un chunk ausente recibía `index.html` con `Content-Type: text/html`, y el navegador intentaba ejecutar HTML como JavaScript (`SyntaxError: Unexpected token '<'` / `ChunkLoadError`).

> **Compatibilidad:** se usa `- [L]` (404 natural) en lugar de `[R=404,L]` porque el flag `R` con códigos distintos de 3xx solo está soportado en Apache 2.4+ y provoca **error 500** en Apache 2.2 o en servidores LiteSpeed. Por la misma razón **no** se usa `mod_expires`: sus directivas (`ExpiresActive`, `ExpiresByType`) exigen `AllowOverride Indexes`, que muchos hostings no habilitan, y `mod_headers` ya cubre la política de caché. Si tras desplegar un chunk ausente devolviera el `index.html` del sitio en vez de un 404, significa que hay un `ErrorDocument 404` en la configuración del vhost.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /app/

  # 1) Si el archivo o directorio existe fisicamente, servir directamente
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 2) Assets inexistentes -> cortar aqui para que NO caigan en el fallback
  #    de la aplicacion. Sin esto, un chunk ausente recibe index.html
  #    (text/html) y el navegador intenta ejecutarlo como JavaScript.
  #    [L] sin sustitucion deja que Apache devuelva su 404 natural.
  RewriteRule ^_next/ - [L]
  RewriteRule \.(js|mjs|css|map|json|txt|webmanifest|woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|avif|ico|wasm)$ - [L]

  # 3) Soporte para trailingSlash de Next.js (si existe carpeta/index.html)
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)/?$ $1/index.html [L]

  # 4) Soporte para archivos con extension .html
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # 5) Fallback a index.html unicamente para rutas de la aplicacion
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_mime.c>
  AddType font/ttf .ttf
  AddType font/woff .woff
  AddType font/woff2 .woff2
  AddType image/svg+xml .svg
</IfModule>

<IfModule mod_headers.c>
  # HTML y payloads RSC (.txt): siempre validar si existe una version nueva
  <FilesMatch "\.(html|txt)$">
    Header set Cache-Control "no-cache, must-revalidate"
    Header set Pragma "no-cache"
  </FilesMatch>

  # CORS para fuentes y estaticos usados por react-pdf y canvas
  <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|font.css|css|js|svg)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>
```

**Opcional — caché larga para los assets hasheados.** Los archivos de `_next/static` llevan un hash de contenido de 16 hex en el nombre, así que son inmutables por definición. Se añadiría dentro de `<IfModule mod_headers.c>`, activándolo solo después de verificar en el servidor que el resto funciona:

```apache
  <FilesMatch "[0-9a-f]{16}\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
```

---

## 7. Funcionalidades Recientes y Cambios Documentados

Durante esta preparación se incorporaron y documentaron formalmente cambios recientes del proyecto:

1. **Exportación a CSV en Perfil de Clientes (`ClientProfilePurchases.js`)**:
   - Función `exportToCSV` para descarga del historial de compras con BOM UTF-8 (`\uFEFF`), escape de caracteres y delimitadores, generando archivos con formato `historial_compras_AAAA-MM-DD.csv`.
   - Botón `ExportButton` conectado y deshabilitado automáticamente si no existen registros.
2. **Navegación directa desde folios**:
   - Integración de hipervínculos en las columnas de folio en `IngresosTable.js`, `EgresosTable.js` y `ClientProfilePurchases.js` directamente hacia `/reservaciones/editar?d=...`.
3. **Módulo de Vuelos y Otros Servicios (`BookingPdf.js`, `VueloForm.js`, `OtrosForm.js`)**:
   - Nuevas secciones para desglose de vuelos y servicios adicionales en el comprobante PDF con sus respectivos iconos vectoriales.
4. **Sistema de Refresh Tokens**:
   - Manejo de tokens JWT revocables con rotación y almacenamiento en `localStorage`, garantizando compatibilidad con clientes estáticos.
5. **Estandarización E.164**:
   - Validación y normalización de números de teléfono en formularios de clientes.
6. **WebSockets y Notificaciones**:
   - Conexión reactiva en tiempo real mediante `useSocket` en `RightBar.js` y `ChatPanel.js`.

---

## 8. Control de Versiones (`.gitignore`)

Se verificó la exclusión en `.gitignore` para:
- Carpeta temporal `/tmp/`
- Archivos empaquetados `*.zip`

---

## Instrucciones de Compilación y Generación de Paquetes ZIP

### 1. Versiones y entornos

Se generan tres versiones del CRM, una por subdominio. Cada una define su propio `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_CONNECTIVITY_API_URL` en `deploy/env/`:

| Versión   | Archivo de entorno        | `NEXT_PUBLIC_API_URL`                        | `NEXT_PUBLIC_CONNECTIVITY_API_URL`          | Paquete generado |
| --------- | ------------------------- | -------------------------------------------- | ------------------------------------------- | ---------------- |
| Demo      | `deploy/env/.env.crmdemo` | `https://crmdemo.2businesstravel.com/admin/` | `https://ia.rutamayatravel.com/2b/crmdemo/` | `crmdemo.2b.zip` |
| Desarrollo| `deploy/env/.env.crmdev`  | `https://crmdev.2businesstravel.com/admin/`  | `https://ia.rutamayatravel.com/2b/crmdev/`  | `crmdev.2b.zip`  |
| Producción| `deploy/env/.env.crm`     | `https://crm.2businesstravel.com/admin/`     | `https://ia.rutamayatravel.com/2b/crm/`     | `crm.2b.zip`     |

> **Importante — precedencia de variables de entorno:** Next.js resuelve `.env.production.local` > `.env.local` > `.env.production` > `.env`. El script carga los valores del entorno correspondiente en el proceso de compilación; las variables del proceso tienen prioridad sobre los archivos `.env`, por lo que `.env.local` no puede hacer que las tres versiones apunten al mismo endpoint.

### 2. Ejecución Automática (recomendada)

Dentro del directorio `crm_2bussiness`:

```powershell
powershell -ExecutionPolicy Bypass -File "scripts\build_static.ps1"
```

El script carga las variables de cada entorno directamente al proceso (por encima de `.env.local`), genera `.htaccess` desde la plantilla, ejecuta `pnpm build`, verifica `.htaccess`, `vjnexuswa.jpg`, las cinco páginas estáticas y el endpoint API correcto en los bundles; crea el `.zip` en la raíz con `make_zip.cjs` y restaura `out/`, `.htaccess` y las variables de proceso previas. Rechaza sobrescribir paquetes existentes.

### 3. Ejecución Manual paso a paso

```bash
pnpm build
```

Comprimir el contenido de la carpeta `out/`:

#### En Windows (PowerShell):
```powershell
node scripts\make_zip.cjs out crm.2b.zip
```

> **No usar `Compress-Archive`.** La versión de PowerShell 5.1 de Windows guarda las rutas internas con backslash y rompe el despliegue en Linux (ver sección 9.6). El script `scripts/build_static.ps1` ya usa `make_zip.cjs`.

#### En Linux / macOS / Bash:
```bash
cd out && zip -r ../crm.2b.zip . && cd ..
```

### 4. Verificación local antes de subir

El sitio usa `basePath: '/app'`, por lo que para probarlo localmente el contenido del zip debe servirse dentro de una carpeta `app/`. Con `trailingSlash: true` cada ruta es un directorio con su `index.html`, así que no se necesitan reglas de reescritura:

```powershell
Expand-Archive -LiteralPath "crm_estatico.zip" -DestinationPath "tmp\serve\app" -Force
node tmp\static_server.cjs tmp\serve 4321
```

Luego abrir `http://localhost:4321/app/`. Para el resto de rutas recordar la barra final: `http://localhost:4321/app/login/`, `http://localhost:4321/app/dashboard/`, etc.

### 5. Despliegue en el Servidor Web (cPanel / Apache / Hosting)
1. Subir el `.zip` correspondiente al servidor.
2. Descomprimir el contenido dentro de la carpeta correspondiente a la ruta `/app` de tu dominio (por ejemplo: `public_html/app/` o `/var/www/html/app/`).
3. Comprobar que la raíz de `/app` contenga directamente:
   - `index.html`
   - `.htaccess`
   - `_next/`
   - `login/`
   - `dashboard/`
   - `clientes/`
   - `vendedores/`
   - `pagos/`
   - `reservaciones/`
   - `fonts/`
   - `pdf/`
   - `vjnexuswa.jpg`, etc.

---

## 9. Actualización: `basePath` configurable y empaquetado por subdominio

Las tres versiones se publican en la carpeta `app` de su propio subdominio (`public_html/app/`), por lo que `basePath` es siempre `/app`. Lo que cambia entre versiones son `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_CONNECTIVITY_API_URL`:

| Versión    | Env                       | `NEXT_PUBLIC_BASE_PATH` | `NEXT_PUBLIC_API_URL`                          | `NEXT_PUBLIC_CONNECTIVITY_API_URL`          | Paquete         |
| ---------- | ------------------------- | ----------------------- | ---------------------------------------------- | ------------------------------------------- | --------------- |
| Producción | `deploy/env/.env.crm`     | `/app`                  | `https://crm.2businesstravel.com/admin/`        | `https://ia.rutamayatravel.com/2b/crm/`     | `crm.2b.zip`     |
| Desarrollo | `deploy/env/.env.crmdev`  | `/app`                  | `https://crmdev.2businesstravel.com/admin/`     | `https://ia.rutamayatravel.com/2b/crmdev/`  | `crmdev.2b.zip`  |
| Demo       | `deploy/env/.env.crmdemo` | `/app`                  | `https://crmdemo.2businesstravel.com/admin/`    | `https://ia.rutamayatravel.com/2b/crmdemo/` | `crmdemo.2b.zip` |

`next.config.mjs` lee el `basePath` desde `NEXT_PUBLIC_BASE_PATH`, de modo que las tres compilaciones comparten exactamente el mismo código fuente y el mismo `basePath`.

> **No cambiar el `basePath` sin cambiar la ubicación de despliegue.** Si el contenido del zip se descomprime directamente en la raíz del subdominio en lugar de en `app/`, hay que compilar con `NEXT_PUBLIC_BASE_PATH` vacío; de lo contrario todos los recursos (`_next/`, `fonts/`, `pdf/`, `vjnexuswa.jpg`) se pedirán con el prefijo `/app/` y devolverán 404.

### 9.1 Prefijado de recursos estáticos (`src/utils/basePath.js`)

Con `basePath` variable, Next.js prefija automáticamente sus propios recursos (`_next/`) y los enlaces de `next/link` y `next/router`, pero **no** las rutas absolutas escritas a mano. Se añadió el helper:

```javascript
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBasePath = (path) => `${BASE_PATH}${path}`;
```

Aplicado en:

- `src/components/pdf/fonts.js` (`/fonts/*.ttf`).
- `src/components/pdf/BookingPdf.js` (iconos `/pdf/*` y logotipo de respaldo `/vjnexuswa.jpg`).
- `src/components/layout/Sidebar.js` (logotipo por defecto).
- `src/lib/brand.js` (logos y favicons por marca).
- `src/components/layout/RightBar.js` (avatares `/avatars/*`).
- `src/app/login/page.js` (logotipo de login).
- `src/components/configuracion/GeneralTab.js` (respaldo del logotipo).
- `src/services/auth.service.js` (`window.location.href` al cerrar sesión apuntaba a `/login` sin `basePath`).

> `next/image` con `images.unoptimized: true` no aplica el `basePath`, por lo que se le pasa el `src` ya prefijado.

### 9.2 Logotipos dependientes del entorno

Los logotipos de agencia se construyen desde `NEXT_PUBLIC_API_URL` (`{NEXT_PUBLIC_API_URL}images/agencia/...`) en `Sidebar.js`, `BookingPdf.js` y `GeneralTab.js`. Se eliminaron las URLs absolutas que apuntaban a `crm.2businesstravel.com` en las tres versiones.

### 9.3 Rutas dinámicas migradas a query params

Además de las cuatro rutas ya documentadas, se migró:

- **De:** `/caja/pagos/[id]` ➔ **A:** `/caja/pagos/detalle?id=...`

Quedando en total cinco rutas estáticas: `clientes/detalle`, `pagos/detalle`, `vendedores/detalle`, `reservaciones/editar` y `caja/pagos/detalle`. Cada una usa `useSearchParams()` y está envuelta en `<Suspense>`. Se eliminaron todas las carpetas `[id]`.

Enlaces actualizados en `ClientTable`, `VendedoresTable`, `IngresosTable`, `EgresosTable`, `CajaTable`, `BookingsList`, `InfoTableVendedor`, `ClientProfilePurchases`, `BookingPriceBreakdown`, `ChatPanel`, `ClientInfoPanel`, `calendario/page.js` y `BookingTableHeader` (etiqueta `<a>` reemplazada por `<Link>`).

### 9.4 `.htaccess` generado por compilación

`public/.htaccess` **no** se versiona: se genera en cada compilación a partir de `deploy/htaccess.template` con el `RewriteBase` correspondiente (`/app/`) y se elimina al finalizar el script.

La plantilla incluye además la política de caché y la regla de 404 para assets inexistentes (ver sección 6). Dos consecuencias prácticas:

- **No volver a un `.htaccess` sin esas reglas.** Sin el 404 real, un chunk ausente devuelve el `index.html` con `text/html` y el navegador falla al ejecutarlo como JavaScript; sin el `no-cache` del HTML, el navegador sigue pidiendo los hashes de la build anterior.
- **Al desplegar, subir el contenido sin borrar `_next/`** (sobrescribir). Un usuario con la aplicación ya abierta seguirá solicitando los chunks de la build anterior; si se borran, fallará hasta que recargue. Conviene limpiar los `_next/static/*` huérfanos de forma periódica, conservando al menos la build anterior.
- **Si hay CDN delante** (Cloudflare u otro), purgar la caché tras cada despliegue, o configurar una Cache Rule de *bypass* para `/app/*.html` y `/app/**/index.txt`.

Verificación rápida tras subir:

```bash
curl -sI https://crm.2businesstravel.com/app/dashboard/ | grep -i cache-control
# no-cache, must-revalidate, max-age=0

curl -sI https://crm.2businesstravel.com/app/_next/static/chunks/noexiste-0000000000000000.js | head -1
# HTTP/1.1 404

curl -sI https://crm.2businesstravel.com/app/_next/static/chunks/328-7455dc71c07362fa.js | grep -i cache-control
# public, max-age=31536000, immutable
```

### 9.5 Script único de compilación y empaquetado

```powershell
powershell -ExecutionPolicy Bypass -File "scripts\build_static.ps1"
```

Para cada versión: carga su `.env` en el proceso (las variables de proceso tienen prioridad sobre `.env.local`), escribe `public/.htaccess`, ejecuta `pnpm build`, verifica la presencia de `.htaccess`, `vjnexuswa.jpg` y las cinco rutas `detalle`/`editar`, comprueba que el bundle apunte al `NEXT_PUBLIC_API_URL` y al `basePath` correctos, y genera el `.zip` correspondiente en la raíz del proyecto.

El `.zip` se genera con `scripts/make_zip.cjs` (ver 9.6), **nunca** con `Compress-Archive`.

### 9.6 Empaquetado compatible con Linux (`scripts/make_zip.cjs`)

`Compress-Archive` de **Windows PowerShell 5.1** guarda las rutas internas del zip con **backslash** (`_next\static\css\...`) en vez de `/`. El archivo se abre bien en Windows y `tar`/7-Zip lo normalizan al listarlo (por eso el fallo pasa desapercibido), pero al descomprimirlo en el servidor Linux el árbol `_next/` no se reconstruye: los archivos de la raíz (que no llevan separador) sí caen en su sitio, mientras `_next/` queda vacío o con nombres que contienen backslash literal.

Síntoma observado: el HTML carga pero los assets dan **403/404**:

```
https://crmdev.2businesstravel.com/app/_next/static/css/<hash>.css  -> 403
403 Forbidden
You don't have permission to access this resource.
Server unable to read htaccess file, denying access to be safe
```

Por eso el empaquetado ya **no** usa `Compress-Archive`: `scripts/make_zip.cjs` (Node) escribe un ZIP estándar con separadores `/` y permisos Unix explícitos (carpetas `755`, archivos `644`). `scripts/build_static.ps1` lo invoca con:

```powershell
node scripts\make_zip.cjs out <paquete>.zip
```

Verificación de un zip antes de subirlo (debe dar `WITH_BACKSLASH=0` y `WITH_SLASH>0`), o comprobando con `tar` que las rutas usan `/`:

```powershell
tar -tf crmdev.2b.zip | findstr "_next/static/css"
# _next/static/css/<hash>.css   (con "/", nunca "\")
```

> Si un zip generado antes de este cambio ya se descomprimió en el servidor, hay que **borrar el contenido de `app/` y volver a extraer** el zip nuevo; extraerlo encima deja `_next/` corrupto.

### 9.7 Branding dinámico: build estático vs desarrollo local

El cambio de marca (logo, favicon y título) funciona igual en local y en producción; la única diferencia es el prefijo de los assets. Para que el build estático no condicione el desarrollo local, se mantienen separadas estas responsabilidades:

**Solo en build estático**

- `NEXT_PUBLIC_BASE_PATH=/app` se define únicamente en `deploy/env/*` y `.env.production`.
- `src/utils/basePath.js` prefija logos y favicons solo cuando esa variable existe.
- `next.config.mjs` lee `basePath` desde la variable; en `pnpm dev` queda vacío.
- La generación de `.htaccess`, `output: 'export'`, `images.unoptimized` y `trailingSlash` pertenecen al pipeline de empaquetado estático, no al config del repositorio.

**Igual en local y producción**

- `src/lib/brand.js` resuelve la marca por dominio.
- `src/hooks/useBrand.js` y `src/components/BrandSync.js` aplican logo y título en cliente.
- El script inline de `src/app/layout.js` cambia favicon, título y precarga el logo.
- El override de QA `?brand=2b` / `?brand=auto` funciona en ambos modos.

**Reglas para no romper `pnpm dev`**

- No agregar `NEXT_PUBLIC_BASE_PATH` a `.env.local`.
- No agregar `output: 'export'` ni `images.unoptimized` global a `next.config.mjs`.
- No versionar `public/.htaccess` ni los archivos de entorno de despliegue.
- Mantener `basePath` y `withBasePath` leyendo la variable de entorno, nunca un valor fijo.

**Verificación local**

1. `pnpm dev`.
2. Abrir `http://localhost:3000/login` (o el puerto configurado): logo VJ Nexus, favicon por defecto y título de VJ Nexus.
3. Abrir `?brand=2b`: logo `/2bt2025.png`, favicon `/favicon-2b.ico` y título 2B.
4. Abrir `?brand=auto`: vuelve a VJ Nexus.
5. En Network, los assets deben pedirse sin `/app`.

**Verificación del build estático**

1. Compilar con el entorno que define `NEXT_PUBLIC_BASE_PATH=/app`.
2. Confirmar que `out/login/index.html` contiene `/app/2bt2025.png`, `/app/vjnexuswa.jpg` y `/app/favicon-2b.ico`.
3. Servir `out` dentro de una carpeta `app/` y comprobar que esos assets responden 200.
