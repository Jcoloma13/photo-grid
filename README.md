# Photo Grid

Una galería de imágenes que carga imágenes mientras haces scroll. Es responsive, tiene tests, manejo de errores y navegable con teclado.

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
└── tests/           Tests
```

### Los hooks importantes

**useImages**: Maneja el estado de imágenes, carga progresiva, errores. Usa AbortController para cancelar requests viejos si el usuario hace algo diferente.

**useInfiniteScroll**: Usa Intersection Observer para detectar cuándo scrolleaste hasta el final de la página y dispara el hook para cargar más.

**useFocusNavigation**: Encapsula la lógica de navegar con teclado (flechas).

### Tests

42 tests de componentes, hooks y el servicio de API. Están hechos con React Testing Library.

```bash
npm run test:run      # ejecuta una vez
npm run test          # modo watch
npm run test:ui       # dashboard visual
```

## Sobre la IA

Usé Copilot para:

- Generar boilerplate inicial
- Simplificar lógica de los hooks
- Mejorar algún componente
- Ayuda en la creación de los test

## Decisiones técnicas

- React + Vite como base del proyecto ya que permite un desarrollo rápido y eficiente
- TypeScript para tipado estático y mejor experiencia de desarrollo
- Vitest para testing con React Testing Library para renderizar componentes
