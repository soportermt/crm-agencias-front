# Registro de Cambios para Despliegue en Servidor Estático (Subdominio /app)

Este documento detalla todas las modificaciones realizadas en el proyecto para asegurar su correcto funcionamiento al ser exportado como un sitio web estático y alojado bajo el subdominio o subdirectorio `/app`.

## 1. Configuración de Next.js (`next.config.mjs`)

Para permitir la exportación estática y configurar la ruta base, se realizaron los siguientes ajustes en el archivo de configuración:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // Habilita la exportación estática (genera la carpeta out/)
  basePath: '/app',          // Configura el subdominio/subdirectorio de la aplicación
  images: {
    unoptimized: true,       // Deshabilita la optimización automática de imágenes (requerido para exportaciones estáticas completas sin servidor Node)
  },
  trailingSlash: true,       // (Opcional) Agrega una barra al final de las URLs, recomendado para compatibilidad con servidores web como Apache o Nginx
};

export default nextConfig;
```

## 2. Reestructuración de Rutas Dinámicas

Next.js requiere conocer todos los posibles valores de las rutas dinámicas (carpetas como `[id]`) durante el tiempo de construcción (`build time`) si se utiliza una exportación estática. Para un CRM donde los IDs de clientes y pagos son dinámicos, esto no es posible. 

Por lo tanto, se migraron las rutas dinámicas al uso de **Parámetros de Consulta (Query Parameters)**:

- **De:** `/clientes/[id]` (ej. `/clientes/123`)
- **A:** `/clientes/detalle?id=123`

### Pasos aplicados:
1. Se renombraron las carpetas `[id]` a `detalle` en:
   - `src/app/(crm)/clientes/detalle/page.js`
   - `src/app/(crm)/pagos/detalle/page.js`
2. En lugar de usar `params.id`, los componentes ahora utilizan el hook `useSearchParams()` de Next.js para leer el `id` desde la URL.
3. Todo componente cliente (`"use client"`) que haga uso de `useSearchParams()` se envolvió en un bloque `<Suspense fallback={...}>` en su respectivo `page.js`. Esto previene errores de Next.js durante la fase de exportación estática.

## 3. Actualización de Enlaces (`<Link>`)

Todos los enlaces en las tablas y componentes que apuntaban a las antiguas rutas dinámicas fueron actualizados.

- Se cambió ``href={`/clientes/${row.id}`}`` a ``href={`/clientes/detalle?id=${row.id}`}`` en `ClientTable.js`.
- Se cambió ``href={`/pagos/${row.id}`}`` a ``href={`/pagos/detalle?id=${row.id}`}`` en `IngresosTable.js` y `EgresosTable.js`.

Adicionalmente, se corrigió un problema de rutas relativas:
- En `BookingTableHeader.js`, el botón de nueva reserva usaba una etiqueta HTML nativa `<a href="reservaciones/crear">`. Estando en `/reservaciones`, esto provocaba que el navegador navegara hacia `/reservaciones/reservaciones/crear`.
- Se cambió por el componente `<Link href="/reservaciones/crear">` de Next.js. El componente `<Link>` inyecta automáticamente el prefijo `/app` a cualquier ruta absoluta que inicie con `/`.

## 4. Corrección de Rutas de Imágenes (Logo, Avatares, etc.)

Cuando se usa `output: 'export'` y `basePath: '/app'`, Next.js no antepone automáticamente el `basePath` a las rutas de imágenes en crudo. Para asegurar que las imágenes carguen correctamente tanto en desarrollo como en producción (dentro de `/app`), se actualizaron todas las rutas estáticas de las imágenes:

1. **Logo (`2bt2025.png`)**: 
   - Modificado en `src/components/layout/Header.js` y `src/app/login/page.js`.
   - Se reemplazó `src="/2bt2025.png"` por `src="/app/2bt2025.png"`.

2. **Avatares y Placeholders**:
   - Modificado en `ClientProfileHeader.js` y `ClientProfileChat.js` (placeholder) a `src="/app/avatar-placeholder.jpg"`.
   - Modificado en `RightBar.js` para los contactos en la barra lateral derecha a `src="/app/avatars/avatar-female-06.png"`, etc.
   - En `RightBar.js` también se reemplazó la etiqueta nativa `<img>` por el componente de Next.js `<Image>`.

## Instrucciones para el Despliegue

Cada vez que necesites generar la versión para subir al servidor, debes ejecutar:

```bash
pnpm build
```

Una vez terminado el proceso:
1. Se generará una carpeta llamada `out/` en la raíz del proyecto.
2. Todo el contenido dentro de la carpeta `out/` es el que debes subir a tu servidor web (FTP, cPanel, Nginx, Apache, etc.).
3. Asegúrate de colocar estos archivos exactamente dentro del directorio público que corresponde al subdominio o subcarpeta `/app` de tu dominio principal.
