# Registro de Cambios para Despliegue en Servidor Estático (Subdominio /app)

Este documento detalla todas las modificaciones realizadas en el proyecto para asegurar su correcto funcionamiento al ser exportado como un sitio web estático (`output: 'export'`) y alojado bajo el subdominio o subdirectorio `/app`.

## 1. Configuración de Next.js (`next.config.mjs`) y Scripts

Para permitir la exportación estática y configurar la ruta base, se realizaron los siguientes ajustes en el archivo de configuración:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // Habilita la exportación estática (genera la carpeta out/)
  basePath: '/app',          // Configura el subdominio/subdirectorio de la aplicación
  images: {
    unoptimized: true,       // Deshabilita la optimización automática de imágenes (requerido para exportaciones estáticas completas sin servidor Node)
  },
  trailingSlash: true,       // Agrega una barra al final de las URLs, recomendado para compatibilidad con servidores web como Apache o Nginx
};

export default nextConfig;
```

> **Nota sobre `rewrites`:** Se eliminaron las reglas de `rewrites` en `next.config.mjs` debido a que Next.js no permite el uso de `rewrites` junto con `output: 'export'`. Las peticiones a APIs externas se manejan directamente mediante la URL completa configurada en las variables de entorno.

> **Nota sobre `axios.js` y conectividad:** En `src/lib/axios.js` se configuró `connectivityApi` para apuntar directamente a `NEXT_PUBLIC_CONNECTIVITY_API_URL` sin intentar reescrituras locales de proxy.

> **Nota sobre `package.json`:** Se actualizó el script de compilación a `"build": "next build"` (eliminando el flag experimental `--turbopack` en build) para garantizar la correcta recolección y exportación de páginas estáticas.

## 2. Reestructuración de Rutas Dinámicas y Manejo de `useSearchParams`

Next.js requiere conocer todos los posibles valores de las rutas dinámicas (carpetas como `[id]`) durante el tiempo de construcción (`build time`) si se utiliza una exportación estática. Para un CRM donde los IDs de clientes, vendedores, pagos y reservaciones son dinámicos, esto no es viable con rutas en el sistema de archivos.

Por lo tanto, se migraron todas las rutas dinámicas al uso de **Parámetros de Consulta (Query Parameters)**:

- **De:** `/clientes/[id]` (ej. `/clientes/123`) ➔ **A:** `/clientes/detalle?id=123`
- **De:** `/pagos/[id]` ➔ **A:** `/pagos/detalle?id=123`
- **De:** `/vendedores/[id]` ➔ **A:** `/vendedores/detalle?id=123`
- **De:** `/reservaciones/editar/[id]` ➔ **A:** `/reservaciones/editar?id=123`

### Pasos aplicados:
1. Se crearon las páginas estáticas correspondientes en:
   - `src/app/(crm)/clientes/detalle/page.js`
   - `src/app/(crm)/pagos/detalle/page.js`
   - `src/app/(crm)/vendedores/detalle/page.js`
   - `src/app/(crm)/reservaciones/editar/page.js`
2. **Eliminación de carpetas dinámicas:** Las carpetas antiguas `[id]` fueron eliminadas por completo para evitar errores de compilación (`generateStaticParams`).
3. En lugar de usar `params.id`, los componentes utilizan el hook `useSearchParams()` de Next.js para leer el parámetro `id` (`const id = searchParams.get("id")`).
4. **Envoltura con `<Suspense>`:** Todo componente que hace uso de `useSearchParams()` se dividió en dos: un componente interno con la lógica y un componente exportado por defecto que envuelve al interno en un bloque `<Suspense fallback={...}>`. Esto es un requisito estricto de Next.js para prevenir errores de hidratación y permitir la generación estática.
   - Aplica también a la página de **Mensajería** (`src/app/(crm)/mensajeria/page.js`), la cual utiliza `useSearchParams` para el parámetro `clientId`.

## 3. Actualización de Enlaces (`<Link>`)

Todos los enlaces en las tablas y componentes que apuntaban a las antiguas rutas dinámicas fueron actualizados:

- En `ClientTable.js`: Se cambió ``href={`/clientes/${row.id}`}`` a ``href={`/clientes/detalle?id=${row.id}`}``.
- En `ClientInfoPanel.js` y `ChatPanel.js`: Se cambió ``href={`/clientes/${clientInfo.id}`}`` a ``href={`/clientes/detalle?id=${clientInfo.id}`}``.
- En `RightBar.js`: Se cambió ``href={`/clientes/${contact.id}`}`` a ``href={`/clientes/detalle?id=${contact.id}`}``.
- En `IngresosTable.js` y `EgresosTable.js`: Se cambió ``href={`/pagos/${row.id}`}`` a ``href={`/pagos/detalle?id=${row.id}`}``.
- En `VendedoresTable.js`: Se cambió ``href={`/vendedores/${row.id}`}`` a ``href={`/vendedores/detalle?id=${row.id}`}``.
- En `BookingsList.js` e `InfoTableVendedor.js`: Se cambió ``href={`reservaciones/editar/${row.id_venta}`}`` a ``href={`/reservaciones/editar?id=${row.id_venta}`}``.
- En `calendario/page.js`: Se cambió ``href={`/reservaciones/editar/${ev.id_venta}`}`` a ``href={`/reservaciones/editar?id=${ev.id_venta}`}``.
- En `BookingTableHeader.js`: Se cambió la etiqueta HTML nativa `<a href="reservaciones/crear">` por el componente `<Link href="/reservaciones/crear">` de Next.js para asegurar el correcto enrutamiento bajo el prefijo `/app`.

## 4. Corrección de Rutas de Imágenes y Recursos Estáticos

Cuando se usa `output: 'export'` y `basePath: '/app'`:

1. **Logos e Imágenes (`next/image`)**:
   - Con `output: 'export'` e `images: { unoptimized: true }`, las imágenes estáticas locales se configuraron con el prefijo explícito `/app/`:
     - En `Header.js` y `login/page.js`: `/app/2bt2025.png`.

2. **Fuentes e Imágenes de React-PDF (`@react-pdf/renderer`)**:
   - Dado que React-PDF se ejecuta en el navegador/canvas fuera del pipeline de Next.js, se configuraron rutas absolutas con `/app/`:
     - En `src/components/pdf/fonts.js`: `/app/fonts/Inter-...ttf`.
     - En `src/components/pdf/BookingPdf.js`: `/app/pdf/header-pdf.png`, `bed.png`, `van.png`, `map.png`, `location.png`, `email.png`, `phone-call.png`.

## 5. Control de Versiones (`.gitignore`)

Se agregaron al `.gitignore` las exclusiones para la carpeta temporal `/tmp/` y archivos comprimidos `*.zip` generados durante el empaquetado.

---

## Instrucciones de Compilación y Generación del Paquete ZIP

### 1. Compilación del proyecto
Para generar los archivos estáticos optimizados, ejecuta en la terminal dentro de la carpeta `crm_2bussiness`:

```bash
pnpm build
```

Esto generará la carpeta `out/` con todos los archivos HTML, JS, CSS y recursos estáticos.

### 2. Compresión directa del contenido (ZIP)
Para subir al servidor, se debe comprimir **el contenido directo** de la carpeta `out/` (sin incluir la carpeta contenedora `out/` en la raíz del zip).

#### En Windows (PowerShell):
```powershell
Get-ChildItem -Path "out\*" -Force | Compress-Archive -DestinationPath "crm_estatico.zip" -Force
```

#### En Linux / macOS / Bash:
```bash
cd out && zip -r ../crm_estatico.zip . && cd ..
```

### 3. Despliegue en el Servidor Web
1. Sube el archivo `crm_estatico.zip` al servidor web (cPanel, Plesk, Nginx, Apache, FTP, etc.).
2. Descomprime el contenido directamente en la carpeta pública correspondiente a la ruta `/app` de tu dominio (ejemplo: `public_html/app/` o `/var/www/html/app/`).
3. Al descomprimir, la raíz del directorio `/app` debe contener directamente archivos como `index.html`, `login/`, `dashboard/`, `_next/`, `2bt2025.png`, etc.
