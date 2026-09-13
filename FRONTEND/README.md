# Cinerama · Frontend React

Aplicación React con Vite, independiente de `BACKEND`.

## Ejecutar

Requiere Node.js 22.12 o superior. Desde esta carpeta:

```sh
npm ci
npm run dev
```

Vite muestra la dirección local. La ruta de inicio es `/WebHome`.

## Comprobar

```sh
npm run lint
npm run build
npm run format:check
```

## Organización

- `src/App.jsx`: rutas y composición principal.
- `src/features/public/pages`: pantallas públicas.
- `src/features/public/components`: elementos compartidos.
- `src/features/public/styles`: estilos del sitio.
- `public`: recursos estáticos.

## Alcance de esta entrega

Página de inicio con carrusel de tres películas, avance manual y automático, pausa y gesto táctil. Incluye catálogo por categorías, búsqueda por título sin distinguir tildes, estados vacíos, imágenes alternativas y menú móvil. La navegación apunta a secciones de esta misma página. Las animaciones respetan la preferencia de movimiento reducido.

Los datos están en `src/features/public/data/catalog.js`, los controles visuales en `components` y los hooks del carrusel y las animaciones en `hooks`. Las imágenes usan los enlaces del prototipo original y dependen de conexión a internet.

Todavía no se incluyen las páginas de detalle, sedes, compra, usuarios ni el panel administrativo. Tampoco se conecta con el backend. Esas funcionalidades se integrarán en entregas posteriores; el catálogo no representa disponibilidad comercial real.

Para revisar la portada: alternar las tres categorías, buscar un título con y sin tildes, probar un título inexistente, cambiar y pausar el carrusel, abrir el menú en móvil y navegar a una ruta inexistente para volver al inicio.
