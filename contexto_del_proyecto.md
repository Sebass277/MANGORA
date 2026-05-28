# Contexto del Proyecto: Landing Page "MANGORA" (Monster 3D)

## Resumen
Este proyecto es una Landing Page interactiva y altamente visual para una bebida (actualmente usando un modelo de lata de Monster Ultra White como *placeholder* de alta calidad). El objetivo principal es ofrecer una experiencia "premium" tipo Apple, guiada por el "Scroll" del usuario.

## Stack Tecnológico Principal
1. **React.js + Vite:** Framework y empaquetador ultrarrápido.
2. **Three.js & React Three Fiber (@react-three/fiber):** Para renderizar el modelo 3D en el navegador de forma declarativa.
3. **Drei (@react-three/drei):** Herramientas auxiliares para Three.js (manejo de entorno, luces preestablecidas, carga de texturas FBX).
4. **Framer Motion:** Manejo de animaciones basadas en el *Scroll* (scroll progress) interpolando valores de opacidad y posición 2D para la capa HTML.

## Lógica de la Landing Page 3D (`LandingPage.jsx`)
La página está dividida en dos grandes capas superpuestas:

### 1. Capa 3D (Background Canvas)
- Un `Canvas` con `position: fixed` que siempre abarca toda la pantalla.
- Contiene el modelo FBX (`RotatingCan`).
- Sus texturas PNG nativas (25MB) fueron comprimidas a **WebP** (~2MB) para que cargue instantáneamente incluso en móviles o conexiones lentas.
- El objeto 3D interpola sus coordenadas (`targetX`, `targetY`, `targetScale`, `rotX`, `rotZ`) usando la matemática de `THREE.MathUtils.lerp`, leyendo el progreso del scroll que reporta Framer Motion.
- **Rotación:** El modelo tiene un giro continuo automático (eje Y) a velocidad de `delta * 1.5`. Este giro dura a través de la Sección 1 y 2. Cuando el scroll llega casi al final (Sección 3), la lata frena y alinea su rotación hacia el múltiplo exacto de `Math.PI` más cercano, asegurando que el frente (logo) siempre mire a la cámara.

### 2. Capa HTML (Foreground Layout)
- Compuesta por contenedores estructurados en CSS estándar (Inline Styles y Flexbox puro).
- Implementa **CSS Scroll Snapping** (`scroll-snap-type: y mandatory` en el global `html`) para obligar al usuario a caer exactamente en una de las 3 paradas o "secciones".
- Cada sección mide `100vh` de alto y distribuye el espacio vacío con un `flex` invisible para dejarle el protagonismo a la lata que está renderizándose detrás.

### Responsive Design (Móvil)
- Mediante un Hook `isMobile` (evaluado a `max-width: 768px`), la UI se vuelve fluida y reestructura los elementos.
- En móvil, en vez de poner la lata en los bordes, el HTML cambia a `flex-direction: column`, apilando los textos en la parte superior y dejando a la lata en el centro inferior de la pantalla para evitar colisiones.
- Los tamaños tipográficos y distancias se reducen dinámicamente mediante ternarios.

## Estado de Desarrollo
La base técnica de 3D, compresión de assets, ruteo básico (con Checkout placeholder), CSS interactivo y responsividad están al 100%. Queda lista para inyectarle el Branding final (Textos oficiales, Logo, Tipografías de marca) y la lógica de carrito/compra.
