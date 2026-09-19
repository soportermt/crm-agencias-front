# Registro de Cambios para Despliegue en Servidor Estático (Subdominio /app)

Este documento detalla todas las modificaciones realizadas en el proyecto para asegurar su correcto funcionamiento al ser exportado como un sitio web estático (`output: 'export'`) y alojado bajo el subdominio o subdirectorio `/app`.

---

## 1. Configuración de Next.js (`next.config.mjs`) y Scripts

Para permitir la exportación estática y configurar la ruta base, se implementaron los siguientes ajustes en el archivo de configuración:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // Habilita la exportación estática (genera la carpeta out/)
  basePath: '/app',          // Configura el subdominio/subdirectorio de la aplicación
  images: {
    unoptimized: true,       // Deshabilita la optimización automática de imágenes (requerido para exportaciones estáticas sin servidor Node)
  },
  trailingSlash: true,       // Agrega una barra al final de las URLs, recomendado para compatibilidad con servidores web como Apache o Nginx
};

export default nextConfig;
```

> **Nota sobre `rewrites`:** Las reglas de `rewrites` quedaron restringidas al entorno de desarrollo (`NODE_ENV === 'development'`), ya que Next.js no permite usarlas junto con `output: 'export'`. En la compilación estática no se aplican y las peticiones a APIs externas se manejan directamente mediante la URL completa configurada en las variables de entorno.

> **Nota sobre `package.json`:** Se actualizó el script de compilación a `"build": "next build"` (eliminando el flag experimental `--turbopack` en build) para garantizar la recolección, prerenderizado y exportación completa de páginas estáticas.

---

## 2. Manejo de Conectividad y APIs (`src/lib/axios.js`)

En `src/lib/axios.js`:
- Se configuró la instancia `connectivityApi` para apuntar directamente a `NEXT_PUBLIC_CONNECTIVITY_API_URL` (o fallback local) como `baseURL`, eliminando el desvío condicional por proxy `/api-connectivity` que dependía de reescrituras de servidor inexistentes en modo estático.
- Se mantiene el soporte completo de intercepción para autenticación con Bearer token en `localStorage` y el ciclo de refresco asíncrono con cola de peticiones (`failedQueue`).

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
   - Fallback de logotipo: si la agencia no cuenta con logotipo cargado en servidor, se utiliza `/app/2bt2025.png` en lugar del archivo inexistente `logo-placeholder.png`.

3. **Logotipo en `Sidebar.js`**:
   - Por defecto apunta a `/app/2bt2025.png`.
   - Para logotipos remotos de agencias se asegura protocolo seguro `https://` y se añade manejador `onError` que recurre a `/app/2bt2025.png` en caso de falla de carga.

4. **Avatares en `RightBar.js`**:
   - Se configuró el prefijo explícito `/app/avatars/...` para la generación de avatares predeterminados.

5. **Logotipo de la pantalla de login (`src/app/login/page.js`)**:
   - `next/image` no aplica el `basePath` cuando `images.unoptimized` está activo, por lo que el `src` se declaró explícitamente como `/app/2bt2025.png`.

6. **Logotipos de agencia dependientes del entorno**:
   - `Sidebar.js`, `BookingPdf.js` y `GeneralTab.js` construyen la URL del logotipo a partir de `NEXT_PUBLIC_API_URL` (`{API_URL}/images/agencia/...`), de modo que cada versión del CRM consume el logotipo de su propio endpoint y no el de producción.

---

## 6. Configuración del Servidor Web (`public/.htaccess`)

Se creó el archivo `public/.htaccess` optimizado para servidores Apache / cPanel / Plesk, el cual se incluye automáticamente en la carpeta de distribución `out/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /app/

  # Si el archivo o directorio existe fisicamente, servir directamente
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Soporte para trailingSlash de Next.js (si existe carpeta/index.html)
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)/?$ $1/index.html [L]

  # Soporte para archivos con extension .html
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Fallback a index.html para rutas cliente
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_mime.c>
  AddType font/ttf .ttf
  AddType font/woff .woff
  AddType font/woff2 .woff2
  AddType image/svg+xml .svg
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|font.css|css|js|svg)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>
```

---

## 7. Funcionalidades Recientes y Cambios Documentados

Durante esta preparación se incorporaron y documentaron formalmente cambios recientes del proyecto:

1. **Exportación a CSV en Perfil de Clientes (`ClientProfilePurchases.js`)**:
   - Función `exportToCSV` para descarga del historial de compras con BOM UTF-8 (`\uFEFF`), escape de caracteres y delimitadores, generando archivos con formato `historial_compras_AAAA-MM-DD.csv`.
   - Botón `ExportButton` conectado y deshabilitado automáticamente si no existen registros.
2. **Navegación directa desde folios**:
   - Integración de hipervínculos en las columnas de folio en `IngresosTable.js`, `EgresosTable.js` y `ClientProfilePurchases.js` directamente hacia `/reservaciones/editar?id=...`.
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

Se generan tres versiones del CRM, una por subdominio. La única diferencia entre ellas es `NEXT_PUBLIC_API_URL`, definida en `deploy/env/`:

| Versión   | Archivo de entorno        | `NEXT_PUBLIC_API_URL`                        | Paquete generado        |
| --------- | ------------------------- | -------------------------------------------- | ----------------------- |
| Demo      | `deploy/env/.env.crmdemo` | `https://crmdemo.2businesstravel.com/admin/` | `crmdemo_estatico.zip`  |
| Desarrollo| `deploy/env/.env.crmdev`  | `https://crmdev.2businesstravel.com/admin/`  | `crmdev_estatico.zip`   |
| Producción| `deploy/env/.env.crm`     | `https://crm.2businesstravel.com/admin/`     | `crm_estatico.zip`      |

> **Importante — precedencia de variables de entorno:** Next.js resuelve `.env.production.local` > `.env.local` > `.env.production` > `.env`. Como `.env.local` (entorno local del desarrollador) apuntaría siempre a un solo endpoint y ocultaría el valor de `.env.production`, el script copia el entorno correspondiente a `.env.production` **y además** exporta las variables al proceso de compilación, ya que las variables del proceso tienen prioridad sobre todos los archivos `.env`. Sin este paso las tres versiones se compilarían contra el mismo endpoint.

### 2. Ejecución Automática (recomendada)

Dentro del directorio `crm_2bussiness`:

```powershell
powershell -ExecutionPolicy Bypass -File "scripts\build_static.ps1"
```

El script, para cada subdominio: copia su entorno a `.env.production`, exporta las variables al proceso, ejecuta `pnpm build`, verifica que la salida contenga `.htaccess`, `2bt2025.png` y las rutas con parámetros de consulta, **comprueba que el bundle apunte realmente a `{host}/admin/`** y genera el `.zip` en la raíz del proyecto. Al finalizar restaura el `.env.production` original.

### 3. Ejecución Manual paso a paso

```bash
pnpm build
```

Comprimir el contenido de la carpeta `out/`:

#### En Windows (PowerShell):
```powershell
Get-ChildItem -Path "out\*" -Force | Compress-Archive -DestinationPath "crm_estatico.zip" -Force
```

#### En Linux / macOS / Bash:
```bash
cd out && zip -r ../crm_estatico.zip . && cd ..
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
   - `2bt2025.png`, etc.
