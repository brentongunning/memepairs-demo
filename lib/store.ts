import { create } from 'zustand'

export type Phase = 'intro' | 'launch' | 'graduation' | 'trading' | 'finale'

export interface Purchase {
  id: string
  amount: number
  chiefsAllocation: number
  eaglesAllocation: number
  timestamp: number
  buyer: string
}

export interface Trade {
  id: string
  type: 'buy' | 'sell' | 'swap'
  token: 'chiefs' | 'eagles'
  amount: number
  price: number
  timestamp: number
  trader: string
  pool: 'amm' | 'quantum'
}

export interface GameState {
  chiefsScore: number
  eaglesScore: number
  quarter: number
  timeRemaining: string
  possession: 'chiefs' | 'eagles' | null
}

interface DemoStore {
  // Phase Management
  phase: Phase
  setPhase: (phase: Phase) => void
  
  // Launch Phase
  currentRaised: number
  targetRaised: number
  purchases: Purchase[]
  collectiveChiefsAllocation: number
  collectiveEaglesAllocation: number
  bondingCurvePrice: number
  addPurchase: (purchase: Omit<Purchase, 'id' | 'timestamp'>) => void
  
  // Graduation
  isGraduating: boolean
  finalChiefsAllocation: number
  finalEaglesAllocation: number
  setGraduation: (chiefs: number, eagles: number) => void
  
  // Trading Phase
  chiefsPrice: number
  eaglesPrice: number
  chiefsSupply: number
  eaglesSupply: number
  quantumPoolChiefs: number
  quantumPoolEagles: number
  trades: Trade[]
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void
  swapInQuantumPool: (fromToken: 'chiefs' | 'eagles', amount: number) => number
  
  // Game State
  gameState: GameState
  updateGameState: (state: Partial<GameState>) => void
  
  // Bot Activity
  botActivity: boolean
  setBotActivity: (active: boolean) => void
  
  // Utilities
  reset: () => void
}

const INITIAL_STATE = {
  phase: 'intro' as Phase,
  currentRaised: 0,
  targetRaised: 69000,
  purchases: [] as Purchase[],
  collectiveChiefsAllocation: 50,
  collectiveEaglesAllocation: 50,
  bondingCurvePrice: 0.00001,
  isGraduating: false,
  finalChiefsAllocation: 0,
  finalEaglesAllocation: 0,
  chiefsPrice: 0.069,
  eaglesPrice: 0.069,
  chiefsSupply: 1000000000,
  eaglesSupply: 1000000000,
  quantumPoolChiefs: 0,
  quantumPoolEagles: 0,
  trades: [] as Trade[],
  gameState: {
    chiefsScore: 0,
    eaglesScore: 0,
    quarter: 1,
    timeRemaining: '15:00',
    possession: null,
  },
  botActivity: false,
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  ...INITIAL_STATE,
  
  setPhase: (phase) => set({ phase }),
  
  addPurchase: (purchase) => {
    const newPurchase = {
      ...purchase,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }
    
    set((state) => {
      const newPurchases = [...state.purchases, newPurchase]
      const totalAmount = state.currentRaised + purchase.amount
      
      // Calculate weighted average allocation
      const totalChiefsWeight = state.purchases.reduce((sum, p) => sum + (p.chiefsAllocation * p.amount), 0) 
        + (purchase.chiefsAllocation * purchase.amount)
      const totalEaglesWeight = state.purchases.reduce((sum, p) => sum + (p.eaglesAllocation * p.amount), 0)
        + (purchase.eaglesAllocation * purchase.amount)
      
      const collectiveChiefsAllocation = (totalChiefsWeight / totalAmount) * 100
      const collectiveEaglesAllocation = (totalEaglesWeight / totalAmount) * 100
      
      // Update bonding curve price (exponential growth)
      const progress = totalAmount / state.targetRaised
      const bondingCurvePrice = 0.00001 * Math.pow(10, progress * 2)
      
      return {
        purchases: newPurchases,
        currentRaised: totalAmount,
        collectiveChiefsAllocation,
        collectiveEaglesAllocation,
        bondingCurvePrice,
      }
    })
  },
  
  setGraduation: (chiefs, eagles) => set({
    isGraduating: true,
    finalChiefsAllocation: chiefs,
    finalEaglesAllocation: eagles,
    quantumPoolChiefs: (1 - chiefs / 100) * INITIAL_STATE.chiefsSupply,
    quantumPoolEagles: (1 - eagles / 100) * INITIAL_STATE.eaglesSupply,
  }),
  
  addTrade: (trade) => {
    const newTrade = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }
    
    set((state) => ({
      trades: [...state.trades, newTrade],
      chiefsPrice: trade.token === 'chiefs' && trade.type === 'buy' 
        ? state.chiefsPrice * 1.001
        : trade.token === 'chiefs' && trade.type === 'sell'
        ? state.chiefsPrice * 0.999
        : state.chiefsPrice,
      eaglesPrice: trade.token === 'eagles' && trade.type === 'buy'
        ? state.eaglesPrice * 1.001
        : trade.token === 'eagles' && trade.type === 'sell'
        ? state.eaglesPrice * 0.999
        : state.eaglesPrice,
    }))
  },
  
  swapInQuantumPool: (fromToken, amount) => {
    const state = get()
    const fromPool = fromToken === 'chiefs' ? state.quantumPoolChiefs : state.quantumPoolEagles
    const toPool = fromToken === 'chiefs' ? state.quantumPoolEagles : state.quantumPoolChiefs
    
    // Quantum swap formula with curve
    const k = fromPool * toPool // constant product
    const newFromPool = fromPool + amount
    const newToPool = k / newFromPool
    const outputAmount = toPool - newToPool
    
    set({
      quantumPoolChiefs: fromToken === 'chiefs' ? newFromPool : newToPool,
      quantumPoolEagles: fromToken === 'eagles' ? newFromPool : newToPool,
    })
    
    return outputAmount
  },
  
  updateGameState: (newState) => set((state) => ({
    gameState: { ...state.gameState, ...newState }
  })),
  
  setBotActivity: (active) => set({ botActivity: active }),
  
  reset: () => set(INITIAL_STATE),
}))