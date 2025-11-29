
export interface ScenarioOption {
  text: string;
  is_correct: boolean;
  reward_card_prompt: string;
}

export type CharacterSkin = 'witch' | 'fox' | 'cat' | 'wolf' | 'cottage' | 'pine_tree' | 'coin' | 'water' | 'rock';

export type RewardType = 'ship' | 'axe' | 'magic_fire' | 'coin' | 'heart';

export interface Reward {
  type: RewardType;
  description?: string;
  uses?: number; // Number of uses remaining, undefined means infinite
  used?: boolean; // Whether the reward has been used
}

export interface GameScenario {
  scenario_id: string;
  npc_type: string;
  skin?: CharacterSkin; // Visual appearance
  position?: { x: number; y: number }; // Map coordinates
  trigger_area_px: number;
  question: string;
  options: ScenarioOption[];
  dialogue_success: string;
  dialogue_fail: string;
  selectedAnswer?: string; // User's selected answer
  reward?: Reward;  // Optional reward for completing the scenario
}

export interface CollectedCard {
  id: string;
  scenarioId: string;
  title: string;
  imageUrl: string;
  timestamp: number;
  type: 'good' | 'bad';
  selectedAnswer?: string;
  explanation?: string;
  reward?: Reward;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  SHOW_RESULT = 'SHOW_RESULT',
  GENERATING_REWARD = 'GENERATING_REWARD',
  ANALYZING = 'ANALYZING',
  ERROR = 'ERROR',
  BATTLE = 'BATTLE'
}

export interface GameState {
  playerX: number;
  playerY: number;
  isInteracting: boolean;
  hasFinished: boolean;
  result: 'success' | 'fail' | null;
  cardImageUrl?: string;
}


export type ObstacleType = 'tree' | 'water' | 'rock' | 'building';

export interface Obstacle {
  x: number;
  y: number;
  type: ObstacleType;
}

export type TerrainType = 'grass' | 'path' | 'water' | 'bridge';
