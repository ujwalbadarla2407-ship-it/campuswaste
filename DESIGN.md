# Design Brief

## Direction
Data-forward institutional dashboard — trustworthy, precise, practical interface for campus waste management staff and managers.

## Tone
Confident, minimal decoration, institutional professional — dark mode emphasizes data clarity and urgency signals.

## Differentiation
Color-coded categorical urgency system (green <60% / yellow 60-85% / red >85% fill) provides instant visual triage for waste bins across campus facilities.

## Color Palette

| Token      | OKLCH            | Role                           |
| ---------- | ---------------- | ------------------------------ |
| background | 0.145 0.014 260  | Dark charcoal background       |
| foreground | 0.95 0.01 260    | Off-white text                 |
| card       | 0.18 0.014 260   | Elevated card surface          |
| primary    | 0.75 0.15 190    | Cyan/teal active states        |
| accent     | 0.75 0.15 190    | Interactive highlights         |
| success    | 0.65 0.18 145    | Green urgency <60% (safe)      |
| warning    | 0.75 0.15 85     | Yellow urgency 60-85%          |
| destructive| 0.55 0.2 25      | Red urgency >85% (critical)    |
| muted      | 0.22 0.02 260    | Secondary UI elements          |

## Typography
- Display: Space Grotesk — dashboard titles, KPIs, section headers
- Body: Satoshi — UI labels, descriptions, data content
- Scale: hero `text-5xl font-bold tracking-tight`, h2 `text-3xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth
Subtle card elevation via `bg-card` (0.18 L) on darker `bg-background` (0.145 L). No shadows — reliance on lightness contrast for hierarchy.

## Structural Zones

| Zone    | Background          | Border                  | Notes                              |
| ------- | ------------------- | ----------------------- | ---------------------------------- |
| Header  | bg-background       | border-b border-border  | Navigation, brand, user menu       |
| Content | alternating bg-card | —                       | Cards alternate with bg-background |
| Footer  | bg-card/50 opacity  | border-t border-border  | Minimal, functional footer         |

## Spacing & Rhythm
Spacious breathing room: `gap-6` between card sections, `p-6` inside cards. Smaller gaps (`gap-2`) for grouped data labels and values.

## Component Patterns
- Buttons: cyan (`bg-primary`) for actions, muted background for secondary, red for destructive
- Cards: rounded `rounded-lg` (6px), `bg-card` with subtle border
- Urgency badges: inline indicators with dynamic colors (success/warning/destructive), rounded-full

## Motion
- Entrance: fade-in on load via CSS `opacity` and `transition-smooth`
- Hover: card lift via `hover:shadow-md`, button state changes via `active:scale-95`
- Decorative: none (data clarity prioritized)

## Constraints
- No full-page backgrounds or gradients
- Urgency colors (green/yellow/red) non-negotiable for institutional trust
- Typography hierarchy via size + weight, never via color alone
- Dark mode only (reduces eye strain for 24/7 monitoring scenario)

## Signature Detail
Categorical color-coding transforms simple percentage data into immediate action triggers — green = routine, yellow = prep, red = deploy now.

