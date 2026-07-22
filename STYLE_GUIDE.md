# SnkrHub — Design Tokens & Style Guide

Guía de estilo y sistema de diseño oficial de **SnkrHub**. Todos los nuevos componentes y páginas deben adherirse estrictamente a estos tokens de diseño y estética.

---

## 1. Color System (Tokens)

```css
:root {
  /* Colores Base */
  --ink: #131316;        /* Fondo base, negro cálido tipo "caja de zapatilla" */
  --panel: #1c1c21;       /* Superficie de tarjetas y contenedores primarios */
  --panel-2: #232329;     /* Superficie secundaria, botones, elevaciones */
  --paper: #ede6d6;       /* Texto de alto contraste / números grandes */

  /* Acentos y Estados */
  --orange: #ff5a1f;      /* Acento primario — CTAs, tabs activos, tags */
  --gain: #3ecf8e;        /* Valores al alza, ganancias (+) */
  --loss: #ff4d5e;        /* Valores a la baja, pérdidas (-) */

  /* Jerarquía de Texto sobre --paper */
  --ink-90: rgba(237, 230, 214, 0.92); /* Texto primario */
  --ink-60: rgba(237, 230, 214, 0.58); /* Texto secundario */
  --ink-40: rgba(237, 230, 214, 0.34); /* Texto terciario / placeholders */

  /* Bordes */
  --line: rgba(237, 230, 214, 0.10);  /* Bordes hairline de separación */
}
```

---

## 2. Tipografía

| Uso | Tipografía | Peso / Estilo |
| :--- | :--- | :--- |
| **Display / Números Grandes / Títulos** | `'Archivo Black', sans-serif` | 900 / Heavy |
| **Datos / Precios / SKU / Fechas / Badges** | `'IBM Plex Mono', monospace` | 500 - 700 / Medium - Bold |
| **Texto de Lectura / Párrafos / UI Base** | `'Inter', sans-serif` | 400 - 600 / Regular - SemiBold |

### Enlace Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Componentes Recurrentes & Firma Visual

### Divisores Tipo "Ticket" Perforado
Utilizados para separar secciones emulando un recibo o ticket de zapatillas.
```css
.divider-ticket {
  height: 16px;
  margin: 0 20px;
  background: repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px);
  opacity: 0.6;
}
```

### Código de Barras (Firma Visual)
Utilizado como detalle gráfico en headers, logos, firmas de tarjetas o fondos con opacidad reducida.
```html
<svg class="barcode" viewBox="0 0 24 14" width="24" height="14">
  <g fill="currentColor">
    <rect x="0" width="1.5" height="14" />
    <rect x="3" width="1" height="14" />
    <rect x="5.5" width="2" height="14" />
    <rect x="9" width="1" height="14" />
    <rect x="11.5" width="1.5" height="14" />
    <rect x="14.5" width="1" height="14" />
    <rect x="17" width="2" height="14" />
    <rect x="21" width="1" height="14" />
  </g>
</svg>
```

### Chips
Cápsulas de filtro o etiquetas rápidas.
```css
.chip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--line);
  color: var(--ink-60);
  text-transform: uppercase;
}

.chip.active {
  background: var(--orange);
  border-color: var(--orange);
  color: #1a0a02;
  font-weight: 700;
}
```

### Tarjetas (Cards)
```css
.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px; /* 12px - 16px */
  overflow: hidden;
}
```

### Tabs Activos
- **Opción A (Naranja Sólido):**
  `background: var(--orange); color: #1a0a02; font-weight: 700;`
- **Opción B (Underline `nav-tick`):**
  Barra horizontal inferior de `14px x 2px` con `background: var(--orange)` y `border-radius: 2px`.
