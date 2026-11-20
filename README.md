# D&D Inventory — Códice del Dungeon Master

Aplicación web responsiva desarrollada con **Next.js (App Router)** diseñada para asistir a Dungeon Masters y jugadores de **Dungeons & Dragons 5e** en la consulta de equipamiento, cálculo de cambio comercial, conversión de divisas y repartición equitativa de botín.

## Enlaces del Proyecto

- **Aplicación en producción (GitHub Pages):** https://ederesquivelm.github.io/DnDInventory-PIA-DESARROLLO_WEB_CLIENTE/
- **Repositorio Git:** https://github.com/EderEsquivelM/DnDInventory-PIA-DESARROLLO_WEB_CLIENTE

---

## Funcionalidades Principales

1. **Códice de Ítems (`/`):**
   - Catálogo relacional de **100 objetos** organizados en 5 clases (*Consumibles*, *Armaduras*, *Armas*, *Transporte y Monturas* y *Equipo de Aventura*) y 14 subcategorías.
   - Búsqueda en tiempo real, filtros por rango de precio (en oro equivalente) y peso (lb), ordenamiento ascendente/descendente y filtros dinámicos según el tipo de objeto (CA, requisito de fuerza, sigilo, tipo/dado/propiedades de daño, capacidad de carga y tipo de desplazamiento).
   - **Modal de detalle (`DetailModal`)** con cierre por clic externo o tecla `Escape`.
   - **Balanza Comercial (`BalanzaDrawer`)** accesible desde cualquier tarjeta o botón flotante (`FabButton`) para calcular deuda y cambio óptimo en PP, GP, SP y CP.

2. **Conversor de Monedas (`/conversor`):**
   - Transmutación instantánea entre Platino (`1000 cp`), Oro (`100 cp`), Plata (`10 cp`) y Bronce (`1 cp`), con botón para invertir divisas y validación de entradas negativas.

3. **Repartidor de Botín (`/guia-mercader`):**
   - Divide tesoros entre 1 y 20 aventureros con modo de optimización de monedas o división por denominación física, mostrando valor consolidado, parte por jugador y fondo común sobrante. Incluye 3 cofres de carga rápida.

---

## Arquitectura del Proyecto

```text
src/
├── app/
│   ├── layout.jsx              # Layout global, Header, Footer y MercaderProvider
│   ├── globals.css             # Sistema de diseño Mobile-First (768px / 1024px)
│   ├── page.jsx                # Códice con JOIN relacional en memoria
│   ├── conversor/page.jsx      # Conversor de divisas D&D 5e
│   └── guia-mercader/page.jsx  # Repartidor de botín grupal
├── components/
│   ├── Header.jsx              # Navegación principal con menú hamburguesa
│   ├── Filtros.jsx             # Buscador, pestañas, chips y parámetros avanzados
│   ├── ItemCard.jsx            # Tarjeta de reliquia con disparador a modal y balanza
│   ├── DetailModal.jsx         # Vista detallada con accesibilidad ARIA y teclado
│   ├── BalanzaDrawer.jsx       # Panel lateral de cálculo comercial
│   ├── FabButton.jsx           # Botón flotante exclusivo del Códice
│   └── Icon.jsx                # Librería de 22 íconos SVG vectoriales
├── context/
│   └── MercaderContext.jsx     # Estado global del ítem seleccionado y visibilidad del Drawer
└── data/
    └── mockItems.js            # Esquema relacional dbSeedData (tablas normalizadas)
