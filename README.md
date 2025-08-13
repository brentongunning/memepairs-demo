# Entangled Memes Demo - Super Bowl Edition

An interactive demonstration of quantum-entangled token pairs on blockchain, featuring a Super Bowl theme with Kansas City Chiefs vs Philadelphia Eagles.

## 🎮 Demo Features

### Phase 1: Launch Phase
- Single bonding curve for the entangled token pair
- Buyers choose their allocation split (Chiefs vs Eagles)
- Real-time visualization of collective allocation
- Automated bot purchases drive progress
- Graduation at $69k market cap

### Phase 2: Quantum Split
- Dramatic graduation animation
- Tokens split based on final collective allocation
- Quantum Pool initialization with inverse ratios
- Automatic transition to trading phase

### Phase 3: Trading Phase
- Live Super Bowl game simulation drives market dynamics
- Dual price charts with real-time updates
- Quantum Pool enables token swaps with dynamic rates
- Bot traders react to game events:
  - Momentum traders follow the winning team
  - Contrarians buy oversold tokens
  - Arbitrageurs exploit price differences
  - Whale movements cause market impacts

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000
```

## 🛠 Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with dark mode
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **D3.js** - Bonding curve visualization
- **Recharts** - Price charts
- **Lucide React** - Icons

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main demo orchestrator
│   └── globals.css     # Global styles
├── components/
│   ├── EntangledLaunch.tsx    # Launch phase UI
│   ├── AllocationVisualizer.tsx # Pie chart visualization
│   ├── QuantumSplit.tsx       # Graduation animation
│   ├── QuantumPool.tsx        # Swap interface
│   ├── TradingDashboard.tsx   # Trading phase UI
│   ├── GameSimulator.tsx      # Super Bowl simulation
│   ├── ActivityFeed.tsx       # Trade activity stream
│   └── BotEngine.tsx          # Automated trading logic
└── lib/
    └── store.ts         # Zustand store

```

## 🎯 Key Concepts

### Entangled Tokens
Unlike traditional token launches where each token has its own bonding curve, Entangled Memes features two tokens that launch as a single quantum-entangled entity. Buyers don't choose between tokens - they choose their allocation split.

### Quantum Pool
After graduation, the Quantum Pool contains the inverse of the circulating supply. This creates unique swap dynamics where early swappers get better rates as the pool rebalances, encouraging snowball effects when sentiment shifts.

### Game-Driven Markets
The live Super Bowl simulation creates realistic market conditions where bot traders react to score changes, creating organic price discovery and demonstrating how real-world events impact token valuations.

## 🎨 Visual Design

- **Dark Mode**: Sleek dark theme optimized for extended viewing
- **Team Colors**: Chiefs red (#E31837) and Eagles green (#004C54)
- **Glassmorphism**: Modern glass-effect cards
- **Neon Accents**: Vibrant purple quantum effects
- **Smooth Animations**: 60fps transitions and micro-interactions

## 📊 Demo Flow

1. **Start**: Introduction screen explains the concept
2. **Launch**: Watch automated buyers allocate between teams
3. **Graduate**: Celebration animation at $69k target
4. **Trade**: Game begins, bots react to live scores
5. **Converge**: Winning team approaches 100% allocation
6. **Reset**: Option to restart with fresh parameters

## 🤖 Bot Behaviors

- **MomentumTrader**: Follows winning team trends
- **ValueHunter**: Buys oversold tokens
- **WhaleBot**: Makes large market-moving trades
- **PaperHands**: Panic sells on adverse events
- **Arbitrager**: Exploits price differences between pools
- **GameWatcher**: Trades based on score changes

## 🔮 Future Enhancements

- Multiple token pairs launching simultaneously
- Historical data persistence
- User wallet integration
- Real API integration
- Mobile responsive improvements
- Additional game events and bot strategies

## 📝 License

MIT