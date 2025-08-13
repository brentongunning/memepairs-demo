import { useState, useCallback, useEffect } from 'react';
import {
  GameState,
  GameEvent,
  createInitialGameState,
  generateGameEvent,
  updateGameState,
  advanceGameClock,
} from '@/lib/gameEngine';

export function useGameSimulation(
  onScoreChange?: (chiefsScore: number, eaglesScore: number) => void
) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const startGame = useCallback(() => {
    setIsRunning(true);
    setGameState(createInitialGameState());
    setEvents([]);
  }, []);

  const pauseGame = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetGame = useCallback(() => {
    setIsRunning(false);
    setGameState(createInitialGameState());
    setEvents([]);
  }, []);

  // Game clock advancement
  useEffect(() => {
    if (!isRunning || gameState.isGameOver) return;
    
    const interval = setInterval(() => {
      setGameState(prev => advanceGameClock(prev));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, gameState.isGameOver]);

  // Generate game events
  useEffect(() => {
    if (!isRunning || gameState.isGameOver) return;
    
    const interval = setInterval(() => {
      const event = generateGameEvent(gameState);
      if (event) {
        setEvents(prev => [...prev, event]);
        setGameState(prev => {
          const newState = updateGameState(prev, event);
          if (onScoreChange && (newState.chiefsScore !== prev.chiefsScore || newState.eaglesScore !== prev.eaglesScore)) {
            onScoreChange(newState.chiefsScore, newState.eaglesScore);
          }
          return newState;
        });
      }
    }, Math.random() * 3000 + 2000); // Much faster! Random interval between 2-5 seconds
    
    return () => clearInterval(interval);
  }, [isRunning, gameState, onScoreChange]);

  return {
    gameState,
    events,
    isRunning,
    startGame,
    pauseGame,
    resetGame,
  };
}