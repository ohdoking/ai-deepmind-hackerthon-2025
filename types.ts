
export interface ScenarioOption {
  text: string;
  is_correct: boolean;
  reward_card_prompt: string;
}

export type CharacterSkin = 'witch' | 'fox' | 'cat' | 'wolf' | 'cottage' | 'pine_tree' | 'coin';

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
}

export interface CollectedCard {
  id: string;
  scenarioId: string;
  title: string;
  imageUrl: string;
  timestamp: number;
}

export interface GameState {
  playerX: number;
  playerY: number;
  isInteracting: boolean;
  hasFinished: boolean;
  result: 'success' | 'fail' | null;
  cardImageUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PLAYING = 'PLAYING',
  GENERATING_REWARD = 'GENERATING_REWARD',
  SHOW_RESULT = 'SHOW_RESULT',
  ERROR = 'ERROR'
}

export type ObstacleType = 'tree' | 'water' | 'rock' | 'building';

export interface Obstacle {
  x: number;
  y: number;
  type: ObstacleType;
}

export type TerrainType = 'grass' | 'path' | 'water';
