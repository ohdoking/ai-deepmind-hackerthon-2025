
import { GameScenario, TerrainType } from './types';

export const TILE_SIZE = 48;
export const MAP_WIDTH = 50;
export const MAP_HEIGHT = 30;

export const INITIAL_PLAYER_POS = { x: 25, y: 15 };

// --- CUTE VILLAGE PALETTE ---
export const PALETTE = {
  GRASS: '#8CD6A3',       // Mint Green
  GRASS_SHADOW: '#76C28E', // Darker Mint
  PATH: '#E8D5B5',        // Beige Dirt
  PATH_SHADOW: '#D6C09E', // Darker Dirt
  WATER: '#A2D9E8',       // Pastel Blue
  WOOD_LIGHT: '#C19A6B',  // Light Wood
  WOOD_DARK: '#8B5A2B',   // Dark Wood
  UI_BG: '#F4E4BC'        // Cream Paper
};

// --- ASSETS (Cute Pixel SVGs) ---
export const SPRITES = {
  // TERRAIN TEXTURES
  grass_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%238CD6A3"/><rect x="2" y="3" width="1" height="1" fill="%2376C28E"/><rect x="12" y="10" width="1" height="1" fill="%2376C28E"/><rect x="5" y="12" width="1" height="2" fill="%2376C28E"/><rect x="9" y="4" width="2" height="1" fill="%2376C28E"/><rect x="1" y="14" width="1" height="1" fill="%23A5E6BA"/><rect x="14" y="2" width="1" height="1" fill="%23A5E6BA"/><circle cx="4" cy="4" r="1" fill="%23F4E4BC" opacity="0.5"/></svg>`,
  
  path_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%23E8D5B5"/><rect x="1" y="1" width="14" height="14" fill="%23E8D5B5"/><rect x="3" y="2" width="1" height="1" fill="%23D6C09E"/><rect x="10" y="11" width="2" height="1" fill="%23D6C09E"/><rect x="6" y="6" width="1" height="1" fill="%23C19A6B"/><rect x="13" y="4" width="1" height="1" fill="%23D6C09E"/></svg>`,

  water_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%23A2D9E8"/><rect x="2" y="4" width="3" height="1" fill="%23FFFFFF" opacity="0.4"/><rect x="9" y="10" width="4" height="1" fill="%23FFFFFF" opacity="0.4"/></svg>`,

  // Player: Little Witch (Updated to match reference more closely)
  witch: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%233E2723" d="M3 5h10v2H3zM5 2h6v3H5z"/><path fill="%238CD6A3" d="M4 7h8v6H4z"/><path fill="%235D4037" d="M5 13h2v2H5zm4 0h2v2H9z"/><path fill="%23FFCC80" d="M6 8h4v3H6z"/><path fill="%233E2723" d="M2 5h1v1H2zm11 0h1v1h-1z"/></svg>`,
  
  // NPCs
  fox: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23E67E22" d="M4 6h3l-1-2H5L4 6zm5 0h3l1-2h-1l-1 2zM4 6h8v5H4z"/><path fill="%23FFF" d="M6 9h4v2H6z"/><path fill="%23333" d="M5 7h1v1H5zm5 0h1v1h-1z"/></svg>`,
  cat: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23333" d="M5 5h2l-1-2H5zM9 5h2l1-2h-1zM5 5h6v6H5z"/><path fill="%23FFF" d="M6 7h1v1H6zm3 0h1v1H9z"/></svg>`,
  wolf: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%237F8C8D" d="M4 5h3l-1-2H4zm5 0h3l1-2h-2zM4 5h8v6H4z"/><path fill="%23ECF0F1" d="M6 9h4v2H6z"/><path fill="%23C0392B" d="M5 7h1v1H5zm5 0h1v1h-1z"/></svg>`,
  
  // Objects / Environment
  cottage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%235D4037" d="M8 1l-7 7h14z"/><path fill="%238D6E63" d="M2 8h12v8H2z"/><rect x="6" y="11" width="4" height="5" fill="%234E342E"/><rect x="3" y="10" width="2" height="2" fill="%2387CEEB"/><rect x="11" y="10" width="2" height="2" fill="%2387CEEB"/></svg>`,
  pine_tree: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%235D4037" d="M7 12h2v4H7z"/><path fill="%232E7D32" d="M3 10h10l-2-3h1l-4-5-4 5h1z"/><path fill="%231B5E20" d="M4 11h8l-1-2h-6z"/></svg>`,
  rock: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%2395A5A6" d="M4 10h8v4H4zM6 8h4v2H6z"/></svg>`,
  coin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><circle cx="8" cy="8" r="6" fill="%23F1C40F"/><path fill="%23FFF" d="M6 6h2v4H6z"/></svg>`,
};

export const PREBUILT_SCENARIOS: GameScenario[] = [
  {
    scenario_id: "sc_fox_village",
    npc_type: "Village Fox",
    skin: "fox",
    position: { x: 30, y: 12 }, 
    trigger_area_px: 100,
    question: "Hello Witch! I found some berries near the path. They look colorful. Should I eat them?",
    options: [
      {
        text: "Eat them immediately!",
        is_correct: false,
        reward_card_prompt: "A sick fox feeling dizzy with colorful poisonous berries, warning style"
      },
      {
        text: "Ask an adult first.",
        is_correct: true,
        reward_card_prompt: "A wise owl teaching a fox about plants in a sunny forest, Alphonse Mucha style"
      }
    ],
    dialogue_success: "Smart move! Not all pretty berries are safe to eat.",
    dialogue_fail: "Oh no! Wild berries can be dangerous if you don't know what they are."
  },
  {
    scenario_id: "sc_cat_roof",
    npc_type: "Stray Cat",
    skin: "cat",
    position: { x: 15, y: 20 }, 
    trigger_area_px: 100,
    question: "Meow. I am stuck on this high roof. Do you want to climb up and help me?",
    options: [
      {
        text: "Climb the roof to help.",
        is_correct: false,
        reward_card_prompt: "A dangerous fall from a roof, broken ladder, warning art style"
      },
      {
        text: "Call for help.",
        is_correct: true,
        reward_card_prompt: "A firefighter rescuing a cat safely with a crowd cheering, warm colors"
      }
    ],
    dialogue_success: "Perfect! Climbing high places is dangerous without safety gear.",
    dialogue_fail: "Too risky! You could fall and get hurt."
  },
  {
    scenario_id: "sc_wolf_forest",
    npc_type: "Guardian Wolf",
    skin: "wolf",
    position: { x: 40, y: 8 }, 
    trigger_area_px: 100,
    question: "Grrr... This is my territory. I am growling at you. What do you do?",
    options: [
      {
        text: "Run away screaming.",
        is_correct: false,
        reward_card_prompt: "A wolf chasing a running figure, chaotic and scary style"
      },
      {
        text: "Back away slowly.",
        is_correct: true,
        reward_card_prompt: "A brave child slowly retreating showing respect to nature, harmonious art"
      }
    ],
    dialogue_success: "Correct. Running can trigger a chase instinct. Slow is safe.",
    dialogue_fail: "Never run! It makes you look like prey."
  }
];

// --- MAP GENERATION: Organic Village ---
export const MAP_GENERATION = (() => {
  const obstacles = new Set<string>();
  const terrain: TerrainType[][] = Array(MAP_WIDTH).fill(null).map(() => Array(MAP_HEIGHT).fill('grass'));
  const npcSafeZones: {x: number, y: number}[] = [];

  // Register NPC Locations to keep clear
  PREBUILT_SCENARIOS.forEach(npc => {
      if(npc.position) npcSafeZones.push(npc.position);
  });

  const isNearNPC = (x: number, y: number) => {
      return npcSafeZones.some(pos => Math.hypot(pos.x - x, pos.y - y) < 4);
  };

  const addObstacle = (x: number, y: number, type: 'tree' | 'water' | 'rock' | 'building') => {
    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT && !isNearNPC(x, y)) {
      obstacles.add(`${x},${y},${type}`);
    }
  };

  // 1. Generate Winding Main Path
  let pathX = 5;
  let pathY = 15;
  for (let i = 0; i < 200; i++) {
     if(pathX >= 0 && pathX < MAP_WIDTH && pathY >= 0 && pathY < MAP_HEIGHT) {
         terrain[pathX][pathY] = 'path';
         // Widen path
         if(pathX+1 < MAP_WIDTH) terrain[pathX+1][pathY] = 'path';
         if(pathY+1 < MAP_HEIGHT) terrain[pathX][pathY+1] = 'path';
     }
     
     // Random walk
     if (Math.random() > 0.5) pathX += 1;
     else pathY += (Math.random() > 0.5 ? 1 : -1);
  }
  
  // 2. Add Cottages near path
  for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
          if (terrain[x][y] === 'grass' && Math.random() > 0.98) {
              // check if near path
              let nearPath = false;
              for(let dx=-2; dx<=2; dx++) {
                  for(let dy=-2; dy<=2; dy++) {
                      if(x+dx >=0 && x+dx < MAP_WIDTH && y+dy >= 0 && y+dy < MAP_HEIGHT) {
                          if (terrain[x+dx][y+dy] === 'path') nearPath = true;
                      }
                  }
              }
              if (nearPath) addObstacle(x, y, 'building');
          }
      }
  }

  // 3. Add Forest (Pine Trees)
  for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
          if (terrain[x][y] === 'grass' && !obstacles.has(`${x},${y},building`)) {
              const noise = Math.sin(x * 0.1) + Math.cos(y * 0.1);
              if (noise > 1) {
                  addObstacle(x, y, 'tree');
              } else if (Math.random() > 0.95) {
                  addObstacle(x, y, 'rock');
              }
          }
      }
  }
  
  // 4. Border Walls
  for(let x=0; x<MAP_WIDTH; x++) {
      addObstacle(x, 0, 'tree');
      addObstacle(x, MAP_HEIGHT-1, 'tree');
  }
  for(let y=0; y<MAP_HEIGHT; y++) {
      addObstacle(0, y, 'tree');
      addObstacle(MAP_WIDTH-1, y, 'tree');
  }

  return { obstacles, terrain };
})();

export const OBSTACLES_SET = MAP_GENERATION.obstacles;
export const TERRAIN_MAP = MAP_GENERATION.terrain;
