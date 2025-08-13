import { useState, useCallback, useEffect } from 'react';
import {
  TokenPairState,
  Purchase,
  Swap,
  createInitialState,
  processPurchase,
  performSwap,
  graduate,
  GRADUATION_MARKET_CAP
} from '@/lib/tokenPair';

export function useTokenPair() {
  const [state, setState] = useState<TokenPairState>(createInitialState());
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [userTokens, setUserTokens] = useState({ chiefs: 0, eagles: 0 });

  const makePurchase = useCallback((amount: number, chiefsPercentage: number, isUser = false) => {
    if (state.isGraduated) return;
    
    const purchase: Purchase = {
      id: `purchase-${Date.now()}`,
      amount,
      chiefsAllocation: (amount * chiefsPercentage) / 100,
      eaglesAllocation: (amount * (100 - chiefsPercentage)) / 100,
      timestamp: Date.now(),
      buyer: isUser ? 'You' : `User${Math.floor(Math.random() * 9999)}`,
    };
    
    // Calculate tokens received (proportional to amount / total market cap)
    if (isUser) {
      const chiefsTokens = (amount * chiefsPercentage / 100 / GRADUATION_MARKET_CAP) * 1_000_000_000;
      const eaglesTokens = (amount * (100 - chiefsPercentage) / 100 / GRADUATION_MARKET_CAP) * 1_000_000_000;
      setUserTokens(prev => ({
        chiefs: prev.chiefs + chiefsTokens,
        eagles: prev.eagles + eaglesTokens,
      }));
    }
    
    setPurchases(prev => [...prev, purchase]);
    setState(prev => processPurchase(prev, amount, chiefsPercentage));
  }, [state.isGraduated]);

  const makeSwap = useCallback((from: 'chiefs' | 'eagles', amount: number, isBot = false) => {
    if (!state.isGraduated) return;
    
    const swap: Swap = {
      id: `swap-${Date.now()}-${Math.random()}`,
      from,
      amount,
      timestamp: Date.now(),
      isBot,
    };
    
    setSwaps(prev => [...prev, swap]);
    setState(prev => performSwap(prev, from, amount));
  }, [state.isGraduated]);

  const forceGraduate = useCallback(() => {
    setState(prev => graduate({
      ...prev,
      totalRaised: GRADUATION_MARKET_CAP,
    }));
  }, []);

  const updateMarketCap = useCallback((newMarketCap: number) => {
    setState(prev => ({
      ...prev,
      combinedMarketCap: newMarketCap,
      chiefsPrice: prev.chiefsCirculating > 0 
        ? (prev.chiefsCirculating / 1_000_000_000) * newMarketCap / prev.chiefsCirculating
        : 0,
      eaglesPrice: prev.eaglesCirculating > 0
        ? (prev.eaglesCirculating / 1_000_000_000) * newMarketCap / prev.eaglesCirculating
        : 0,
    }));
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
    setPurchases([]);
    setSwaps([]);
    setIsSimulating(false);
    setUserTokens({ chiefs: 0, eagles: 0 });
  }, []);

  // Simulate automated purchases during launch phase
  useEffect(() => {
    if (!isSimulating || state.isGraduated) return;
    
    const interval = setInterval(() => {
      const amount = Math.random() * 3000 + 1500; // $1500-4500 per purchase
      const chiefsPercentage = Math.random() * 100;
      makePurchase(amount, chiefsPercentage);
    }, 1500); // Faster interval too (1.5 seconds instead of 2)
    
    return () => clearInterval(interval);
  }, [isSimulating, state.isGraduated, makePurchase]);

  return {
    state,
    purchases,
    swaps,
    userTokens,
    makePurchase,
    makeSwap,
    forceGraduate,
    updateMarketCap,
    startSimulation,
    stopSimulation,
    reset,
    isSimulating,
  };
}