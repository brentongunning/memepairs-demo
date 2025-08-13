export const TOTAL_SUPPLY_PER_TOKEN = 1_000_000_000;
export const GRADUATION_MARKET_CAP = 69_000;

export interface TokenPairState {
  // Launch phase
  isGraduated: boolean;
  totalRaised: number;
  allocationPercentageChiefs: number;
  allocationPercentageEagles: number;
  
  // Post-graduation
  combinedMarketCap: number;
  chiefsCirculating: number;
  eaglesCirculating: number;
  
  // Derived values
  chiefsInPool: number;
  eaglesInPool: number;
  chiefsPrice: number;
  eaglesPrice: number;
}

export interface Purchase {
  id: string;
  amount: number;
  chiefsAllocation: number;
  eaglesAllocation: number;
  timestamp: number;
  buyer: string;
}

export interface Swap {
  id: string;
  from: 'chiefs' | 'eagles';
  amount: number;
  timestamp: number;
  isBot: boolean;
}

export function calculateTokenPrice(
  tokenCirculating: number,
  combinedMarketCap: number
): number {
  if (tokenCirculating === 0) return 0;
  const tokenShareOfMarket = (tokenCirculating / TOTAL_SUPPLY_PER_TOKEN) * combinedMarketCap;
  return tokenShareOfMarket / tokenCirculating;
}

export function performSwap(
  state: TokenPairState,
  from: 'chiefs' | 'eagles',
  amount: number
): TokenPairState {
  if (!state.isGraduated) return state;
  
  const newState = { ...state };
  
  if (from === 'chiefs') {
    // Check if we have enough circulating chiefs
    if (amount > newState.chiefsCirculating) {
      amount = newState.chiefsCirculating;
    }
    newState.chiefsCirculating -= amount;
    newState.eaglesCirculating += amount;
  } else {
    // Check if we have enough circulating eagles
    if (amount > newState.eaglesCirculating) {
      amount = newState.eaglesCirculating;
    }
    newState.eaglesCirculating -= amount;
    newState.chiefsCirculating += amount;
  }
  
  // Update pool amounts (inverse of circulating)
  newState.chiefsInPool = TOTAL_SUPPLY_PER_TOKEN - newState.chiefsCirculating;
  newState.eaglesInPool = TOTAL_SUPPLY_PER_TOKEN - newState.eaglesCirculating;
  
  // Recalculate prices
  newState.chiefsPrice = calculateTokenPrice(newState.chiefsCirculating, newState.combinedMarketCap);
  newState.eaglesPrice = calculateTokenPrice(newState.eaglesCirculating, newState.combinedMarketCap);
  
  return newState;
}

export function graduate(state: TokenPairState): TokenPairState {
  if (state.isGraduated) return state;
  
  // Calculate initial distribution based on allocations
  const chiefsInitialCirculating = Math.floor(
    (state.allocationPercentageChiefs / 100) * TOTAL_SUPPLY_PER_TOKEN
  );
  const eaglesInitialCirculating = TOTAL_SUPPLY_PER_TOKEN - chiefsInitialCirculating;
  
  const newState: TokenPairState = {
    ...state,
    isGraduated: true,
    combinedMarketCap: GRADUATION_MARKET_CAP,
    chiefsCirculating: chiefsInitialCirculating,
    eaglesCirculating: eaglesInitialCirculating,
    chiefsInPool: TOTAL_SUPPLY_PER_TOKEN - chiefsInitialCirculating,
    eaglesInPool: TOTAL_SUPPLY_PER_TOKEN - eaglesInitialCirculating,
    chiefsPrice: 0,
    eaglesPrice: 0,
  };
  
  // Calculate initial prices
  newState.chiefsPrice = calculateTokenPrice(newState.chiefsCirculating, newState.combinedMarketCap);
  newState.eaglesPrice = calculateTokenPrice(newState.eaglesCirculating, newState.combinedMarketCap);
  
  return newState;
}

export function processPurchase(
  state: TokenPairState,
  amount: number,
  chiefsPercentage: number
): TokenPairState {
  if (state.isGraduated) return state;
  
  const newState = { ...state };
  newState.totalRaised += amount;
  
  // Update weighted allocation based on purchase
  const totalPreviousValue = state.totalRaised;
  const chiefsValue = (totalPreviousValue * state.allocationPercentageChiefs / 100) + (amount * chiefsPercentage / 100);
  const eaglesValue = (totalPreviousValue * state.allocationPercentageEagles / 100) + (amount * (100 - chiefsPercentage) / 100);
  
  newState.allocationPercentageChiefs = (chiefsValue / newState.totalRaised) * 100;
  newState.allocationPercentageEagles = (eaglesValue / newState.totalRaised) * 100;
  
  // Check for graduation
  if (newState.totalRaised >= GRADUATION_MARKET_CAP) {
    return graduate(newState);
  }
  
  return newState;
}

export function createInitialState(): TokenPairState {
  return {
    isGraduated: false,
    totalRaised: 0,
    allocationPercentageChiefs: 50,
    allocationPercentageEagles: 50,
    combinedMarketCap: 0,
    chiefsCirculating: 0,
    eaglesCirculating: 0,
    chiefsInPool: 0,
    eaglesInPool: 0,
    chiefsPrice: 0,
    eaglesPrice: 0,
  };
}