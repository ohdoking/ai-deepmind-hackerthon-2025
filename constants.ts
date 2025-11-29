
import { GameScenario, TerrainType } from './types';

export const TILE_SIZE = 48;
export const MAP_WIDTH = 50;
export const MAP_HEIGHT = 30;

export const INITIAL_PLAYER_POS = { x: 25, y: 15 };

// --- 16-BIT PALETTE ---
export const PALETTE = {
  GRASS_LIGHT: '#63c74d',  // Vibrant Green
  GRASS_DARK: '#3e8948',   // Shadow Green
  PAVE_LIGHT: '#9badb7',   // Light Grey Blue
  PAVE_DARK: '#757161',    // Darker Grey
  WATER: '#30e0ff',        // Cyan
  WATER_DARK: '#0099db'    // Deep Blue
};

// --- ASSETS (Pixel Art SVGs) ---
export const SPRITES = {
  kid: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23f1c40f" d="M5 1h6v3H5z"/><path fill="%23e67e22" d="M5 2h1v1H5zm5 0h1v1h-1z"/><path fill="%23f39c12" d="M4 4h8v2H4z"/><path fill="%23e74c3c" d="M5 6h6v5H5z"/><path fill="%232c3e50" d="M6 11h1v3H6zm3 0h1v3H9z"/><path fill="%23f1c40f" d="M4 7h1v2H4zm11 0h1v2h-1z"/><path fill="%23ecf0f1" d="M7 7h2v2H7z"/></svg>`,
  
  knight: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23333" d="M6 2h4v1H6zM5 3h6v1H5zM4 4h2v1h4V4h2v2H4z"/><path fill="%232980b9" d="M4 6h8v6H4z"/><path fill="%23ecf0f1" d="M7 7h2v4H7z"/><path fill="%23f1c40f" d="M4 12h3v2H4zm5 0h3v2H9z"/></svg>`,
  wizard: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%232c3e50" d="M4 2h8l-1-2H5z"/><path fill="%238e44ad" d="M3 4h10v2H3zM4 6h8v7H4z"/><path fill="%23ecf0f1" d="M6 7h4v2H6zM6 10h4v1H6z"/></svg>`,
  archer: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%2327ae60" d="M6 2h4v2H6zM4 4h8v2H4z"/><path fill="%23d35400" d="M5 6h6v6H5z"/><path fill="%23f1c40f" d="M4 8h1v4H4zm7 0h1v4h-1z"/></svg>`,
  mech: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%237f8c8d" d="M5 2h6v3H5zM4 5h8v2H4z"/><path fill="%2395a5a6" d="M4 7h8v6H4z"/><path fill="%233498db" d="M6 3h1v1H6zm3 0h1v1H9z"/><path fill="%23e74c3c" d="M7 8h2v2H7z"/></svg>`,
  wolf: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%237f8c8d" d="M4 6h2V4h2v2h2v4H4z"/><path fill="%2395a5a6" d="M3 8h2v4H3zm8 0h2v4h-2z"/></svg>`,
  cat: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23d35400" d="M5 6h2V5h2v1h2v4H5z"/><path fill="%23e67e22" d="M4 8h2v4H4zm6 0h2v4h-2z"/><path fill="%23ecf0f1" d="M6 7h1v1H6zm3 0h1v1H9z"/></svg>`,
  
  // New Coin Sprite
  coin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23f1c40f" d="M5 2h6v12H5z"/><path fill="%23f39c12" d="M4 3h8v10H4z"/><path fill="%23fff" d="M6 4h2v3H6z"/></svg>`,

  // Terrain
  tree: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%232d3436" d="M7 11h2v4H7z"/><path fill="%2327ae60" d="M5 8h6v3H5zm-1-3h8v3H4zm2-3h4v3H6z"/></svg>`,
  water: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%233498db" opacity="0.8"/><path fill="%23ecf0f1" opacity="0.4" d="M2 4h3v1H2zm6 5h4v1H8zm-4 4h2v1H4z"/></svg>`,
  rock: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%237f8c8d" d="M3 10h10v4H3zM5 7h6v3H5z"/><path fill="%2395a5a6" d="M4 11h2v1H4zm6 0h2v1h-2z"/></svg>`,
  building: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%2395a5a6" d="M2 4h12v12H2z"/><path fill="%23bdc3c7" d="M4 2h8v2H4z"/><rect x="4" y="6" width="3" height="3" fill="%233498db"/><rect x="9" y="6" width="3" height="3" fill="%233498db"/><rect x="4" y="11" width="3" height="3" fill="%233498db"/><rect x="9" y="11" width="3" height="3" fill="%233498db"/></svg>`
};

export const PREBUILT_SCENARIOS: GameScenario[] = [
  {
    scenario_id: "sc_wizard_01",
    npc_type: "Wise Wizard",
    skin: "wizard",
    position: { x: 35, y: 10 }, 
    trigger_area_px: 100,
    question: "Greetings, young traveler. I have a Sleeping Dragon (Dog) here. It looks peaceful. What should you do?",
    options: [
      {
        text: "Sneak up and touch its tail.",
        is_correct: false,
        reward_card_prompt: "A dragon waking up angrily breathing fire, dark warning style"
      },
      {
        text: "Leave it alone to sleep.",
        is_correct: true,
        reward_card_prompt: "A peaceful sleeping dragon in a magical forest, harmonious Art Nouveau"
      }
    ],
    dialogue_success: "Wise choice! A sleeping beast should never be startled.",
    dialogue_fail: "Foolish! Startling a sleeping creature invites danger!"
  },
  {
    scenario_id: "sc_mech_01",
    npc_type: "City Bot",
    skin: "mech",
    position: { x: 10, y: 15 }, 
    trigger_area_px: 100,
    question: "Beep Boop. Service Unit (Service Dog) detected in operation. Human contact protocol required.",
    options: [
      {
        text: "Distract it with a toy.",
        is_correct: false,
        reward_card_prompt: "A malfunctioning robot causing chaos, warning signs, glitch art style"
      },
      {
        text: "Ignore and let it work.",
        is_correct: true,
        reward_card_prompt: "A high-tech city in harmony, robot and human working together, Mucha style"
      }
    ],
    dialogue_success: "Protocol Accepted. Respecting working units ensures safety for all.",
    dialogue_fail: "Error! Distracting a working unit endangers its user."
  },
  {
    scenario_id: "sc_archer_01",
    npc_type: "Forest Archer",
    skin: "archer",
    position: { x: 42, y: 22 }, 
    trigger_area_px: 100,
    question: "Halt! A wild beast is eating its catch nearby. Do you approach?",
    options: [
      {
        text: "Try to take the food.",
        is_correct: false,
        reward_card_prompt: "A wild wolf snapping aggressively over food, dark forest background"
      },
      {
        text: "Keep your distance.",
        is_correct: true,
        reward_card_prompt: "A noble ranger watching nature from afar, golden sunlight through trees"
      }
    ],
    dialogue_success: "Correct. Never disturb an animal while it is eating.",
    dialogue_fail: "Dangerous move! Animals defend their food instinctively."
  }
];

export const MAP_GENERATION = (() => {
  const obstacles = new Set<string>();
  const terrain: TerrainType[][] = Array(MAP_WIDTH).fill(null).map(() => Array(MAP_HEIGHT).fill('grass'));

  const addObstacle = (x: number, y: number, type: 'tree' | 'water' | 'rock' | 'building') => {
    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      obstacles.add(`${x},${y},${type}`);
    }
  };

  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      if (x < 22) {
        terrain[x][y] = 'pavement';
      } else {
        terrain[x][y] = 'grass';
      }
    }
  }

  // City Generation
  for (let x = 2; x < 18; x += 5) {
    for (let y = 3; y < 27; y += 5) {
      if (Math.random() > 0.4) {
        addObstacle(x, y, 'building');
        addObstacle(x + 1, y, 'building');
        addObstacle(x, y + 1, 'building');
        addObstacle(x + 1, y + 1, 'building');
      }
    }
  }

  // Nature Generation
  for (let x = 32; x < 42; x++) {
    for (let y = 5; y < 15; y++) {
      if (Math.hypot(x - 37, y - 10) < 4.5) {
        addObstacle(x, y, 'water');
      }
    }
  }

  for (let i = 0; i < 60; i++) {
    const x = 30 + Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * MAP_HEIGHT);
    if (!obstacles.has(`${x},${y},water`)) {
       addObstacle(x, y, Math.random() > 0.8 ? 'rock' : 'tree');
    }
  }

  // Borders
  for (let x = 0; x < MAP_WIDTH; x++) {
    addObstacle(x, 0, x < 22 ? 'building' : 'tree');
    addObstacle(x, MAP_HEIGHT - 1, x < 22 ? 'building' : 'tree');
  }
  for (let y = 0; y < MAP_HEIGHT; y++) {
    addObstacle(0, y, 'building');
    addObstacle(MAP_WIDTH - 1, y, 'tree');
  }

  return { obstacles, terrain };
})();

export const OBSTACLES_SET = MAP_GENERATION.obstacles;
export const TERRAIN_MAP = MAP_GENERATION.terrain;
