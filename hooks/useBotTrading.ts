import { useEffect, useRef } from 'react';

interface BotTradingConfig {
  isEnabled: boolean;
  chiefsScore: number;
  eaglesScore: number;
  chiefsCirculating: number;
  eaglesCirculating: number;
  onSwap: (from: 'chiefs' | 'eagles', amount: number, isBot: boolean) => void;
}

export function useBotTrading({
  isEnabled,
  chiefsScore,
  eaglesScore,
  chiefsCirculating,
  eaglesCirculating,
  onSwap,
}: BotTradingConfig) {
  const lastScoreRef = useRef({ chiefs: 0, eagles: 0 });
  const botCountRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) return;

    // Check for score changes
    const scoreDiff = Math.abs(chiefsScore - eaglesScore);
    const chiefsScored = chiefsScore > lastScoreRef.current.chiefs;
    const eaglesScored = eaglesScore > lastScoreRef.current.eagles;

    if (chiefsScored || eaglesScored) {
      // Trigger bot swaps based on score change
      const numBots = Math.floor(Math.random() * 10) + 5; // 5-15 bots
      botCountRef.current = numBots;

      for (let i = 0; i < numBots; i++) {
        setTimeout(() => {
          // Determine swap direction based on who scored
          const swapToChiefs = chiefsScored && Math.random() > 0.3; // 70% chance to swap to scoring team
          const swapToEagles = eaglesScored && Math.random() > 0.3;

          if (swapToChiefs && eaglesCirculating > 1_000_000) {
            const amount = Math.floor(Math.random() * 10_000_000) + 1_000_000; // 1M-11M tokens
            onSwap('eagles', Math.min(amount, eaglesCirculating / 2), true);
          } else if (swapToEagles && chiefsCirculating > 1_000_000) {
            const amount = Math.floor(Math.random() * 10_000_000) + 1_000_000;
            onSwap('chiefs', Math.min(amount, chiefsCirculating / 2), true);
          }
        }, i * (Math.random() * 500 + 200)); // Stagger swaps
      }
    }

    // Update last score
    lastScoreRef.current = { chiefs: chiefsScore, eagles: eaglesScore };

    // Random momentum trading
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance per interval
        const leadingTeam = chiefsScore > eaglesScore ? 'chiefs' : 'eagles';
        const trailingTeam = leadingTeam === 'chiefs' ? 'eagles' : 'chiefs';
        
        // Some bots follow momentum, some are contrarian
        const isContrarian = Math.random() > 0.7; // 30% contrarian bots
        const from = isContrarian ? leadingTeam : trailingTeam;
        const maxAmount = from === 'chiefs' ? chiefsCirculating : eaglesCirculating;
        
        if (maxAmount > 10_000_000) {
          const amount = Math.floor(Math.random() * 5_000_000) + 500_000;
          onSwap(from, Math.min(amount, maxAmount / 10), true);
        }
      }
    }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds

    return () => clearInterval(interval);
  }, [isEnabled, chiefsScore, eaglesScore, chiefsCirculating, eaglesCirculating, onSwap]);

  return { activeBots: botCountRef.current };
}