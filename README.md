# Photo Grid

Una galería de imágenes que carga imágenes mientras haces scroll. Es responsive, tiene tests, manejo de errores y navega bien con teclado.

## Empezar

```bash
npm setup
```

Abre http://localhost:5174/ y verás la galería de imágenes.

## Qué hace

- Muestra una galería de imágenes
- Conforme scrolleas hacia abajo, carga más automáticamente
- Clickea una imagen para eliminarla (con animación suave)
- Funciona en mobile (2 columnas), tablet (3) y desktop (4)
- Puedes navegar con las flechas del teclado

## Cómo está montado

### La estructura

```
src/
├── components/      ImageCard, ImageGrid, ErrorMessage, Loader
├── hooks/           useImages, useInfiniteScroll, useFocusNavigation
├── services/        Llamadas a la API
├── types/           Tipos TypeScript
└── tests/           Todo testeado
```

### Los hooks importantes

**useImages**: Maneja el estado de imágenes, carga progresiva, errores. Usa AbortController para cancelar requests viejos si el usuario hace algo diferente.

**useInfiniteScroll**: Es simple. Usa Intersection Observer para detectar cuándo scrolleaste hasta el final de la página y dispara el hook para cargar más.

**useFocusNavigation**: Encapsula la lógica de navegar con teclado (flechas). Evita duplicar código en componentes.

### Tests

Tienes 42 tests de componentes, hooks y el servicio de API. Están hechos con React Testing Library.

```bash
npm run test:run      # ejecuta una vez
npm run test          # modo watch
npm run test:ui       # dashboard visual
```

Pasan todos. Incluyen casos de error, paginación, y navegación con teclado.

## Sobre la IA

Usé Copilot para:

- Simplificar lógica de los hooks.
- Mejorar algún componente.
- Ayuda en la creación de los test.

## Stack rápido

- React 19
- TypeScript 5.9
- Vite 5.4
- Vitest 2.1
- React Testing Library 16.3
