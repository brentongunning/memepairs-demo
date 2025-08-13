# Memecoin Pairs Demo

An interactive demonstration of the memecoin pairs trading mechanism, featuring a Super Bowl themed token pair (Chiefs vs Eagles).

## Live Demo

The demo is running at: http://localhost:3002

## Concept

Memecoin pairs are a new type of tradable instrument where:
- Two tokens launch together with a single bonding curve
- Buyers choose their allocation percentage during launch
- At graduation ($69k market cap), tokens become tradable with a shared pair pool
- Holders can swap 1:1 between tokens through the pool
- Total circulating supply is always 1B tokens (combined)
- Total pool supply is always 1B tokens (inverse of circulating)

## Demo Features

### Phase 1: Launch (Bonding Curve)
- Single bonding curve progressing to $69k
- Buyers choose allocation between Chiefs and Eagles
- Real-time allocation tracking
- Automated purchase simulation

### Phase 2: Graduation
- Animated transition at $69k market cap
- Shows initial token distribution
- Creates pair pool with inverse amounts

### Phase 3: Trading
- Live Super Bowl game simulation
- Bots trade based on game score
- Manual swap interface
- Real-time price updates based on circulating supply
- Combined market cap tracking

## Key Mechanics

1. **Token Supply**: 2B total (1B Chiefs + 1B Eagles)
2. **Circulating**: Always 1B combined
3. **Pool**: Always 1B combined (inverse of circulating)
4. **Pricing**: Individual token price = (Token's % of circulating) × Combined Market Cap / Token's circulating supply
5. **Swapping**: 1:1 rate through pair pool

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3002 in your browser.

## Tech Stack

- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Dark mode UI with neon accents

## Demo Flow

1. **Auto-starts** with simulated purchases
2. **Graduates** at $69k market cap
3. **Game begins** with automated bot trading
4. **Prices fluctuate** based on game score and swaps
5. **Reset** to try different scenarios