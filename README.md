# MTG Commander Tournament Tracker

A web app for managing casual Magic: The Gathering Commander (EDH) tournaments at your local game store. Handles player registration, Swiss-style pairings, scoring, tiebreakers, and live standings — all from your browser.

**Live:** [commander-tournament.netlify.app](https://commander-tournament.netlify.app)

## What It Does

- Register players and configure round count
- Automatically generate tables (pods of 3, 4, or 5 players)
- Swiss-style pairings after round 1 (group by points, randomize ties)
- Record finishing positions per table with real-time standings
- Cascading tiebreaker system: Points → Buchholz → OMW% → Head-to-Head
- Mark players as inactive mid-tournament (dropped players keep earned points)
- Navigate back to previous rounds to edit results or drop players retroactively
- Podium display for top 3 at tournament completion
- All state persisted to localStorage — survives page refresh

For a full breakdown of every feature, see the [Features Documentation](./FEATURES.md).

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [TypeScript 6](https://www.typescriptlang.org) | Type safety |
| [Vite 8](https://vite.dev) | Build tool & dev server |
| [CSS (custom)](./src/styles/index.css) | "Arcane Dark" theme — no UI library |
| [Google Fonts](https://fonts.google.com) | Inter (body) + Cinzel (headings) |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |
| [Netlify](https://www.netlify.com) | Hosting |

## Project Structure

```
src/
├── components/          # React components
│   ├── TournamentSetup  # Player registration & round config
│   ├── RoundView        # Table display & round navigation
│   ├── TableCard        # Individual table with position selects
│   ├── Standings        # Live standings sidebar
│   ├── PlayerInput      # Add player form
│   ├── PlayerList       # Player list with edit/remove
│   └── TournamentComplete # Final standings & podium
├── context/             # React Context + useReducer state management
├── utils/
│   ├── grouping.ts      # Table generation & Swiss pairing
│   └── scoring.ts       # Points, Buchholz, OMW%, Head-to-Head
├── constants.ts         # Point scales & config
├── types.ts             # TypeScript interfaces
└── styles/index.css     # All styles (Arcane Dark theme)
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
npm run preview
```

## License

MIT
