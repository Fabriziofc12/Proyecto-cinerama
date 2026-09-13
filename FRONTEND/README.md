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

Esta entrega incorpora la base de React, el layout compartido y la recuperación de rutas inexistentes. Todavía no se conecta con el backend.
