# Features Documentation

A comprehensive breakdown of all features in the MTG Commander Tournament Tracker.

---

## 1. Tournament Setup

### Player Registration
- Add players by nickname using the input field
- Edit existing player names by clicking the edit icon
- Remove players with the delete button
- Players display with avatar initials (first letter of nickname)
- Minimum 3 players required to start a tournament

### Round Configuration
- Set the total number of rounds (1–10)
- Defaults to 3 rounds

### Start Tournament
- Validates player count (minimum 3) before allowing start
- Generates the first round with random table assignments
- All active players are included in the initial groupings

---

## 2. Table Generation

### Group Sizing Algorithm
Tables are formed based on the number of active players:

| Players % 4 | Table Layout |
|---|---|
| 0 | All tables of 4 |
| 1 | (k-1) tables of 4 + 1 table of 5 |
| 2 | (k-1) tables of 4 + 2 tables of 3 |
| 3 | k tables of 4 + 1 table of 3 |

### Pairing Modes
- **Round 1 — Random:** Players are shuffled randomly into tables
- **Round 2+ — Swiss:** Players are sorted by total points (descending), then grouped into tables sequentially. Players with equal points are shuffled within their point bracket to prevent deterministic pairings

---

## 3. Scoring System

### Point Scale
Points are awarded based on finishing position at each table:

**4-Player Tables:**
| Position | Points |
|---|---|
| 1st | 4 |
| 2nd | 3 |
| 3rd | 2 |
| 4th | 1 |

**5-Player Tables:**
| Position | Points |
|---|---|
| 1st | 4 |
| 2nd | 3 |
| 3rd | 2 |
| 4th | 2 |
| 5th | 1 |

**3-Player Tables:**
| Position | Points |
|---|---|
| 1st | 4 |
| 2nd | 3 |
| 3rd | 2 |

First place always earns 4 points regardless of table size, ensuring no disadvantage for smaller or larger tables.

### Tie Splitting
When multiple players finish in the same position at a table, their points are averaged. For example, if two players tie for 1st at a 4-player table, they each receive (4+3)/2 = 3.5 points.

---

## 4. Tiebreaker System

When players have the same total points, tiebreakers are applied in cascade:

### 4a. Buchholz Score (Strength of Schedule)
Sum of all opponents' total points. A higher Buchholz means you faced tougher competition. Displayed on hover over the OMW% column as "SoS (Buchholz)."

### 4b. Opponent Match Win Percentage (OMW%)
Average win percentage of all opponents faced. Each opponent's win percentage is calculated as their total points divided by the maximum possible points, with a floor of 33%. Displayed as a percentage in the standings.

### 4c. Head-to-Head
If two players shared a table, the one who placed higher wins the tiebreaker. If they never played each other or tied at the same position, this tiebreaker is skipped.

---

## 5. Player Active/Inactive Status

### Dropping Players
- Click the "Drop" button next to any player in the standings sidebar
- Dropped players are excluded from future round pairings
- Dropped players keep all points earned in previous rounds
- Dropped players appear dimmed in the standings

### Reactivating Players
- Click the "Add" button next to a dropped player to bring them back
- Reactivated players rejoin the next round's pairings

### Safety Guard
- Cannot drop a player if it would leave fewer than 3 active players (button is disabled)

---

## 6. Round Navigation

### Viewing Previous Rounds
- Use the left/right arrow buttons to navigate between rounds
- A progress bar below the round title shows completed (gold) and current (purple) rounds
- An "editing" badge appears when viewing a past round

### Editing Past Results
- Position selections remain editable on all rounds
- Changes to past round results are saved and standings update accordingly

### Retroactive Player Drops
- When viewing a past round and toggling a player's active status, a confirmation dialog appears
- Confirming regenerates all subsequent rounds with the updated player list
- The app navigates to the newly generated next round

---

## 7. Live Standings Sidebar

### Display
- Permanently visible on the right side during the playing phase
- Shows rank, player name, total points, and OMW%
- Top 3 ranks have colored badges: gold (1st), silver (2nd), bronze (3rd)
- Alternating row backgrounds and purple hover highlights

### Interactivity
- Drop/Add toggle buttons per player
- Buchholz score shown on hover over OMW% cell
- Hint text appears when viewing a past round, warning that toggling will regenerate subsequent rounds

---

## 8. Tournament Completion

### Podium Display
- Visual podium for the top 3 finishers with:
  - Avatar circles colored by rank (gold, silver, bronze)
  - Chess crown icon for the winner
  - Shimmer animation on the winner's name
  - Staggered entrance animations
  - Height-scaled bars (1st tallest, 3rd shortest)

### Final Standings Table
- Full standings table below the podium with all tiebreaker data
- Rank badges for top 3, matching the podium colors
- Inactive players shown dimmed

### New Tournament
- "New Tournament" button resets all state and returns to setup

---

## 9. Reset Tournament

- A "Reset Tournament" button is available during the playing phase
- Protected by a confirmation dialog: "Are you sure you want to reset the tournament? All progress will be lost."
- Canceling keeps the tournament running
- Confirming clears all state and returns to the setup screen

---

## 10. Data Persistence

### localStorage
- All tournament state is saved to `localStorage` on every change
- Refreshing the page or closing/reopening the browser restores the tournament exactly where you left off
- Backward-compatible migration: older saves without the `active` field default to `active: true`

---

## 11. UI/UX Design

### Arcane Dark Theme
- Deep black color scheme (`#0d0d1a` base) with blue undertones
- Dual accent system: gold (primary actions) and purple (secondary/decorative)
- Glassmorphism panels with backdrop blur and gradient backgrounds
- Custom-styled scrollbar matching the theme

### Typography
- **Inter** — body text (modern, clean, optimized for dashboards)
- **Cinzel** — h1 headings (serif, fantasy/medieval feel for MTG flavor)

### Animations
- `fadeInUp` — card entrance animations with staggered delays
- `slideInFromLeft` — player list items
- `pulseGlow` — Start Tournament button
- `shimmer` — winner name on tournament complete
- Hover effects: card lift, purple glow, button press feedback

### Responsive Design
- **Desktop (>1024px):** Side-by-side layout with tables grid and sticky standings sidebar
- **Tablet (700–1024px):** Narrower standings sidebar
- **Mobile (<700px):** Stacked layout, single-column tables, full-width standings
