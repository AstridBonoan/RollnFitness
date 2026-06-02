# RollnFitness

**Fitness for every body.**

RollnFitness is an adaptive fitness platform designed for wheelchair users, adaptive athletes, individuals with limited mobility, and ambulatory users.

## Phase 1

Mobile-first web platform establishing online presence, delivering real value, and validating market demand.

### Features

- **Adaptive Workouts** — Seated, standing, and hybrid routines filtered by mobility level
- **Progress Tracking** — Streaks, session logs, and weekly activity visualization
- **Nutrition Guidance** — Foundational tips for adaptive athletes
- **Challenges** — Community goals for consistency and accountability
- **Sports Pass** — Preview of premium sport-specific training programs
- **Early Access Waitlist** — Capture early users before full launch

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/RollnFitness/](http://localhost:5173/RollnFitness/) in your browser.

## Build

```bash
npm run build
```

## Deployment

This project uses **GitHub Actions** to build and deploy to the **`gh-pages` branch**.

Configure GitHub Pages:

1. Go to **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / **`/ (root)`**
4. Save

The site will be live at: [https://astridbonoan.github.io/RollnFitness/](https://astridbonoan.github.io/RollnFitness/)

Every push to `main` triggers a new deployment automatically.

## Accessibility

- Skip-to-content link
- Keyboard navigation and visible focus states
- ARIA labels and semantic HTML
- Reduced motion support
- High contrast mode support
- 44px minimum touch targets

## Ecosystem

| Product | Description |
|---------|-------------|
| **RollnFitness** | Core adaptive fitness platform |
| **RollnFitness Sports Pass** | Premium sport-specific training |
| **RollnFitness+** | Future movement intelligence (not Phase 1) |

## License

Private — All rights reserved.
