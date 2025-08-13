export interface GameState {
  quarter: 1 | 2 | 3 | 4 | 'OT' | 'FINAL';
  timeRemaining: string;
  chiefsScore: number;
  eaglesScore: number;
  possession: 'chiefs' | 'eagles';
  lastPlay: string;
  isGameOver: boolean;
}

export interface GameEvent {
  type: 'touchdown' | 'field_goal' | 'safety' | 'turnover' | 'big_play';
  team: 'chiefs' | 'eagles';
  points: number;
  description: string;
}

const playDescriptions = {
  touchdown: [
    'breaks free for a {yards}-yard touchdown!',
    'catches a deep pass for a touchdown!',
    'punches it in from the {yards}!',
    'spectacular diving catch in the endzone!',
  ],
  field_goal: [
    'nails a {yards}-yard field goal!',
    'splits the uprights from {yards} yards!',
    'clutch field goal is good!',
  ],
  turnover: [
    'INTERCEPTION! Defense comes up big!',
    'FUMBLE! Ball is loose and recovered!',
    'Strip sack! Defense takes over!',
  ],
  big_play: [
    'huge gain of {yards} yards!',
    'breaks multiple tackles for {yards} yards!',
    'finds a gap for {yards} yards!',
  ],
};

export function createInitialGameState(): GameState {
  return {
    quarter: 1,
    timeRemaining: '15:00',
    chiefsScore: 0,
    eaglesScore: 0,
    possession: 'chiefs',
    lastPlay: 'Kickoff! Game begins!',
    isGameOver: false,
  };
}

export function generateGameEvent(state: GameState): GameEvent | null {
  // Game over, no more events
  if (state.isGameOver) return null;
  
  // Random event generation weighted by game situation
  const rand = Math.random();
  const scoreDiff = Math.abs(state.chiefsScore - state.eaglesScore);
  const losingTeam = state.chiefsScore > state.eaglesScore ? 'eagles' : 'chiefs';
  const winningTeam = state.chiefsScore > state.eaglesScore ? 'chiefs' : 'eagles';
  
  // Increase comeback probability if there's a large lead
  const comebackBonus = scoreDiff > 14 ? 0.3 : 0;
  
  let event: GameEvent;
  
  if (rand < 0.5 + (state.quarter === 4 ? 0.2 : 0)) {
    // Touchdown - much more likely now (50% base chance)
    const team = Math.random() < 0.5 + comebackBonus ? losingTeam : winningTeam;
    const yards = Math.floor(Math.random() * 60) + 1;
    event = {
      type: 'touchdown',
      team,
      points: 7, // Including extra point
      description: playDescriptions.touchdown[Math.floor(Math.random() * playDescriptions.touchdown.length)]
        .replace('{yards}', yards.toString()),
    };
  } else if (rand < 0.75) {
    // Field goal (25% chance)
    const team = Math.random() < 0.5 ? 'chiefs' : 'eagles';
    const yards = Math.floor(Math.random() * 30) + 20;
    event = {
      type: 'field_goal',
      team,
      points: 3,
      description: playDescriptions.field_goal[Math.floor(Math.random() * playDescriptions.field_goal.length)]
        .replace('{yards}', yards.toString()),
    };
  } else if (rand < 0.85) {
    // Turnover
    const team = state.possession === 'chiefs' ? 'eagles' : 'chiefs';
    event = {
      type: 'turnover',
      team,
      points: 0,
      description: playDescriptions.turnover[Math.floor(Math.random() * playDescriptions.turnover.length)],
    };
  } else {
    // Big play (no score)
    const team = Math.random() < 0.5 ? 'chiefs' : 'eagles';
    const yards = Math.floor(Math.random() * 40) + 15;
    event = {
      type: 'big_play',
      team,
      points: 0,
      description: playDescriptions.big_play[Math.floor(Math.random() * playDescriptions.big_play.length)]
        .replace('{yards}', yards.toString()),
    };
  }
  
  return event;
}

export function updateGameState(state: GameState, event: GameEvent): GameState {
  const newState = { ...state };
  
  // Update score
  if (event.team === 'chiefs') {
    newState.chiefsScore += event.points;
  } else {
    newState.eaglesScore += event.points;
  }
  
  // Update possession for turnovers
  if (event.type === 'turnover') {
    newState.possession = event.team;
  } else if (event.points > 0) {
    // After scoring, other team gets possession
    newState.possession = event.team === 'chiefs' ? 'eagles' : 'chiefs';
  }
  
  // Update last play description
  const teamName = event.team === 'chiefs' ? 'Chiefs' : 'Eagles';
  newState.lastPlay = `${teamName} ${event.description}`;
  
  return newState;
}

export function advanceGameClock(state: GameState): GameState {
  const newState = { ...state };
  
  // Parse time
  const [minutes, seconds] = newState.timeRemaining.split(':').map(Number);
  let totalSeconds = minutes * 60 + seconds;
  
  // Reduce by 30-60 seconds per update (faster game progression)
  const reduction = Math.floor(Math.random() * 30) + 30;
  totalSeconds = Math.max(0, totalSeconds - reduction);
  
  // Format back to string
  const newMinutes = Math.floor(totalSeconds / 60);
  const newSeconds = totalSeconds % 60;
  newState.timeRemaining = `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
  
  // Check for quarter end
  if (totalSeconds === 0) {
    if (newState.quarter < 4) {
      newState.quarter = (newState.quarter + 1) as 1 | 2 | 3 | 4;
      newState.timeRemaining = '15:00';
      newState.lastPlay = `End of Quarter ${newState.quarter - 1}`;
    } else if (newState.chiefsScore === newState.eaglesScore) {
      newState.quarter = 'OT';
      newState.timeRemaining = '10:00';
      newState.lastPlay = 'Overtime!';
    } else {
      newState.quarter = 'FINAL';
      newState.isGameOver = true;
      const winner = newState.chiefsScore > newState.eaglesScore ? 'Chiefs' : 'Eagles';
      newState.lastPlay = `Game Over! ${winner} win!`;
    }
  }
  
  return newState;
}