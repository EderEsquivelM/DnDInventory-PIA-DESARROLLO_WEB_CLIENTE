# D&D Inventory — Códice del Dungeon Master

Aplicación web responsiva desarrollada con **Next.js (App Router)** para asistir a Dungeon Masters y jugadores de **Dungeons & Dragons 5e** en la consulta relacional de equipamiento, cálculo comercial de cambio, conversión de divisas y repartición equitativa de botín.

---

## Enlaces del Proyecto

- **Aplicación en producción (GitHub Pages):** https://ederesquivelm.github.io/DnDInventory-PIA-DESARROLLO_WEB_CLIENTE/
- **Repositorio Git:** https://github.com/EderEsquivelM/DnDInventory-PIA-DESARROLLO_WEB_CLIENTE

## Autoría

- **Estudiante:** Eder Abisai Esquivel Maldonado (`EderEsquivelM`)
- **Materia:** Desarrollo Web Cliente — Producto Integrador de Aprendizaje (PIA)
- **Modalidad:** Individual

---

## Funcionalidades Principales

### 1. Códice de Ítems (`/`)
- **Catálogo relacional de 100 objetos** organizados en 5 clases (*Consumibles*, *Armaduras*, *Armas*, *Transporte y Monturas* y *Equipo de Aventura*) y 14 subcategorías, unidos dinámicamente en memoria (`useMemo`) a partir de un esquema normalizado (`dbSeedData`).
- **Búsqueda y filtrado avanzado:** búsqueda por nombre en tiempo real, pestañas por clase con conteo dinámico, chips de subcategoría, rangos de precio (en oro equivalente) y peso (lb), ordenamiento ascendente/descendente (`id`, `name`, `price`, `weight`) y filtros específicos según la clase seleccionada (CA mínima, requisito de fuerza, sigilo, tipo/dado/propiedades de daño, capacidad de carga, tipo de desplazamiento y característica de uso).
- **Modal de detalle (`DetailModal`):** ficha técnica con carga física, valor oficial y propiedades específicas (incluyendo formato `+2 CA` para escudos), con cierre por clic externo o tecla `Escape`.
- **Balanza Comercial (`BalanzaDrawer`):** panel lateral accesible desde cada tarjeta o mediante el botón flotante (`FabButton`) para calcular deuda y vuelto óptimo en platino (`pp`), oro (`gp`), plata (`sp`) y cobre (`cp`).

### 2. Conversor de Monedas (`/conversor`)
- Transmutación instantánea entre Platino (`1000 cp`), Oro (`100 cp`), Plata (`10 cp`) y Bronce (`1 cp`).
- Botón interactivo para invertir divisas de origen y destino, validación de entradas vacías o negativas con alertas accesibles (`role="alert"`) y salida semántica mediante `<output aria-live="polite">`.

### 3. Repartidor de Botín (`/guia-mercader`)
- División de tesoros para grupos de 1 a 20 aventureros con dos modos de cálculo: **optimización a monedas de mayor valor** o **reparto físico por denominación**.
- Incluye 3 plantillas de carga rápida (*Cofre Trasgo*, *Bóveda de los Nobles* y *Tesoro de Mazmorra*) y despliega el valor consolidado en oro, la parte por jugador y el sobrante para el fondo común.

---

## Arquitectura del Proyecto

```text
.github/
└── workflows/
    └── nextjs.yml              # Pipeline CI/CD para compilación y despliegue en GitHub Pages
src/
├── app/
│   ├── layout.jsx              # Layout global, metadatos, Header, Footer y MercaderProvider
│   ├── globals.css             # Sistema de diseño oscuro Mobile-First (768px / 1024px)
│   ├── page.jsx                # Códice principal con JOIN relacional y motor de filtrado
│   ├── conversor/page.jsx      # Conversor de divisas D&D 5e
│   └── guia-mercader/page.jsx  # Repartidor de botín grupal
├── components/
│   ├── Header.jsx              # Navegación principal sticky con menú hamburguesa
│   ├── Filtros.jsx             # Buscador, pestañas, chips y formulario de filtros avanzados
│   ├── ItemCard.jsx            # Tarjeta de objeto con acceso a detalle y balanza comercial
│   ├── DetailModal.jsx         # Modal accesible (role="dialog", Escape, backdrop)
│   ├── BalanzaDrawer.jsx       # Drawer lateral de cálculo comercial y cambio óptimo
│   ├── FabButton.jsx           # Botón flotante para abrir la Balanza Comercial
│   └── Icon.jsx                # Biblioteca propia de 22 íconos SVG vectoriales
├── context/
│   └── MercaderContext.jsx     # Estado global del ítem seleccionado y visibilidad del Drawer
└── data/
    └── mockItems.js            # Base de datos relacional normalizada (dbSeedData)
```

---

## Diseño Responsivo, Semántica y Accesibilidad

- **Enfoque Mobile-First:** los estilos base en `src/app/globals.css` priorizan dispositivos móviles con navegación hamburguesa y filtros colapsables, adaptándose progresivamente mediante `@media (min-width: 768px)` (tablet) y `@media (min-width: 1024px)` (escritorio).
- **Semántica HTML5:** estructura implementada con `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<fieldset>`, `<legend>`, `<dl>`, `<dt>`, `<dd>` y `<output>`.
- **Accesibilidad:**
  - Paleta oscura de alto contraste (`#151515` fondo, `#222222` superficies, `#EAEAEA` texto principal, `#E07A6A` acento).
  - Controles asociados con `<label htmlFor>`, estados ARIA (`aria-current`, `aria-expanded`, `aria-controls`, `aria-selected`, `aria-pressed`, `aria-live="polite"`) y mensajes de error con `role="alert"`.
  - Gestión de foco por teclado (`focus-visible`, cierre con `Escape` y `visibility: hidden` en el drawer cerrado para evitar el fallo `aria-hidden-focus`).

---

## Servicios Externos e Infraestructura

- **Google Fonts CSS2 API:** carga de las familias tipográficas `Cinzel` y `Crimson Text` con `display=swap` y respaldo local (`Georgia, serif`).
- **GitHub Actions + GitHub Pages:** exportación estática configurada en `next.config.mjs` (`output: 'export'`, `basePath`, `trailingSlash: true`) y desplegada automáticamente con `.github/workflows/nextjs.yml`.

---

## Instalación y Ejecución Local

Requisitos previos: **Node.js 20+** y **npm**.

```bash
# 1. Clonar el repositorio
git clone [https://github.com/EderEsquivelM/DnDInventory-PIA-DESARROLLO_WEB_CLIENTE-.git](https://github.com/EderEsquivelM/DnDInventory-PIA-DESARROLLO_WEB_CLIENTE.git)
cd DnDInventory-PIA-DESARROLLO_WEB_CLIENTE

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Generar exportación estática de producción (carpeta /out)
npm run build
```

---

## Control de Versiones y Despliegue

El repositorio trabaja directamente sobre la rama principal **`main`**, la cual dispara de forma automática el flujo `.github/workflows/nextjs.yml` en cada `push` para instalar dependencias, compilar la exportación estática (`out/`) y publicar los cambios en GitHub Pages.
