# RollnFitness Design System

High-octane athletic · premium tech · hardcore gym aesthetic.

## 1. Tailwind `theme.extend.colors`

See `tailwind.config.js` for the full object. Semantic families:

| Token | Role |
|--------|------|
| `premium-dark`, `carbon-*` | Obsidian / matte carbon backgrounds |
| `octane-*` | Electric cyan-blue — primary CTAs, active states |
| `vitality-*` | Electric green — health, recovery, metrics |
| `circuit-*` | Gold-amber — achievements, alerts, milestones |
| `steel-*` | Metallic greys — text and borders |

Legacy aliases `brand`, `navy`, and `accent` map to `octane`, `carbon`, and `vitality` for existing class names.

## 2. CSS custom properties (`:root`)

Defined in `src/index.css`:

```css
:root {
  --rf-premium-dark: #121214;
  --rf-premium-darker: #0a0a0b;
  --rf-octane-400: #00f2ff;
  --rf-vitality-400: #39ff14;
  --rf-circuit-400: #ffd700;
  --rf-steel-100: #e8eaed;
  /* …see index.css for full list */
}
```

## 3. Semantic UI classes

| Class | Use |
|--------|-----|
| `.dashboard-shell` | App / page wrapper |
| `.btn-start-now` | Primary workout CTA |
| `.progress-ring-vitality` | Health metric rings |
| `.banner-achievement` | Goal / milestone alerts |

## WCAG AA (dark UI)

- Body text `steel-100` on `carbon-950`: **≥ 12:1**
- Primary CTA `carbon-950` on `octane-500`: **≥ 7:1**
- Vitality labels `vitality-400` on `carbon-900`: **≥ 8:1**
- Circuit banners `steel-100` on `circuit-950` gradient: **≥ 5:1** (large text / UI chrome)
