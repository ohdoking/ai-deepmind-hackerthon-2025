
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

// --- ASSETS (High Quality Pixel Art SVGs) ---
export const SPRITES = {
  // TERRAIN TEXTURES
  grass_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%237CB384"/><rect x="2" y="3" width="1" height="1" fill="%235A9E64"/><rect x="12" y="10" width="1" height="1" fill="%235A9E64"/><rect x="5" y="12" width="1" height="2" fill="%235A9E64"/><rect x="9" y="4" width="2" height="1" fill="%235A9E64"/><rect x="1" y="14" width="1" height="1" fill="%239ED6A8"/><rect x="14" y="2" width="1" height="1" fill="%239ED6A8"/><rect x="7" y="7" width="1" height="1" fill="%239ED6A8" opacity="0.5"/></svg>`,

  path_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%23E6C288"/><rect x="1" y="1" width="14" height="14" fill="%23E6C288"/><rect x="3" y="2" width="2" height="1" fill="%23C9A36D"/><rect x="10" y="11" width="2" height="1" fill="%23C9A36D"/><rect x="6" y="6" width="1" height="1" fill="%23C9A36D"/><rect x="13" y="4" width="1" height="1" fill="%23C9A36D"/><rect x="0" y="0" width="1" height="1" fill="%237CB384"/><rect x="15" y="0" width="1" height="1" fill="%237CB384"/><rect x="0" y="15" width="1" height="1" fill="%237CB384"/><rect x="15" y="15" width="1" height="1" fill="%237CB384"/></svg>`,

  water_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%2384C5D6"/><path d="M2 4h3v1H2zm7 6h4v1H9zM1 10h2v1H1zm11-7h2v1h-2z" fill="%23A8E0EE"/></svg>`,

  bridge_tile: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="%2384C5D6"/><path d="M0 4h16v8H0z" fill="%238D7B68"/><path d="M0 4h16v1H0zm0 7h16v1H0z" fill="%236D5B48"/><rect x="2" y="5" width="2" height="6" fill="%23A6937C"/><rect x="6" y="5" width="2" height="6" fill="%23A6937C"/><rect x="10" y="5" width="2" height="6" fill="%23A6937C"/><rect x="14" y="5" width="2" height="6" fill="%23A6937C"/></svg>`,

  // Player: Little Witch (Updated to match reference: brown hair, big hat)
  witch: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%232C2C3E" d="M4 3h8v2H4zM5 1h6v2H5z"/><path fill="%235D4037" d="M4 5h8v3H4z"/><path fill="%23E6C288" d="M6 6h4v3H6z"/><path fill="%233E2723" d="M5 9h6v5H5z"/><path fill="%232C2C3E" d="M3 3h1v1H3zm10 0h1v1h-1z"/><rect x="6" y="7" width="1" height="1" fill="%23000" opacity="0.5"/><rect x="9" y="7" width="1" height="1" fill="%23000" opacity="0.5"/></svg>`,

  // NPCs
  fox: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23D35400" d="M4 6h3l-1-2H5L4 6zm5 0h3l1-2h-1l-1 2zM4 6h8v5H4z"/><path fill="%23FFF" d="M6 9h4v2H6z"/><path fill="%232C3E50" d="M5 7h1v1H5zm5 0h1v1h-1z"/><rect x="11" y="8" width="3" height="2" fill="%23D35400"/><rect x="13" y="7" width="2" height="1" fill="%23FFF"/></svg>`,
  cat: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%232C3E50" d="M5 5h2l-1-2H5zM9 5h2l1-2h-1zM5 5h6v6H5z"/><path fill="%23ECF0F1" d="M6 7h1v1H6zm3 0h1v1H9z"/><rect x="10" y="8" width="3" height="1" fill="%232C3E50"/></svg>`,
  wolf: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%237F8C8D" d="M3 5h4l-1-2H4zm5 0h4l1-2h-2zM3 5h10v7H3z"/><path fill="%23BDC3C7" d="M5 9h6v3H5z"/><path fill="%23C0392B" d="M5 7h1v1H5zm5 0h1v1h-1z"/></svg>`,

  // Objects / Environment
  cottage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%234A3B52" d="M8 0l-8 8h16z"/><path fill="%236D5B48" d="M2 8h12v8H2z"/><rect x="6" y="11" width="4" height="5" fill="%234E342E"/><rect x="3" y="10" width="2" height="2" fill="%2384C5D6"/><rect x="11" y="10" width="2" height="2" fill="%2384C5D6"/><path fill="%233E2723" d="M11 2h2v4h-2z"/></svg>`,
  pine_tree: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%235D4037" d="M7 12h2v4H7z"/><path fill="%232D5A27" d="M3 10h10l-2-3h1l-4-5-4 5h1z"/><path fill="%231E3F1B" d="M4 11h8l-1-2h-6z"/><circle cx="5" cy="6" r="0.5" fill="%23C0392B"/><circle cx="10" cy="9" r="0.5" fill="%23C0392B"/></svg>`,
  rock: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%237F8C8D" d="M3 11h10v4H3zM5 8h6v3H5z"/><rect x="4" y="12" width="2" height="1" fill="%2395A5A6"/><rect x="10" y="10" width="1" height="1" fill="%2395A5A6"/></svg>`,
  coin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><circle cx="8" cy="8" r="5" fill="%23F1C40F"/><circle cx="8" cy="8" r="3" fill="%23F39C12"/><path fill="%23FFF" d="M7 6h2v4H7z"/></svg>`,

  // Effects
  effect_sparkle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23A2D9E8" d="M8 2h1v4h4v1H9v4H8v-4H4V6h4z"/><rect x="7" y="5" width="3" height="3" fill="%23FFF"/></svg>`,
  effect_puff: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23FFF" d="M5 5h6v6H5z"/><rect x="4" y="6" width="1" height="4" fill="%23FFF"/><rect x="11" y="6" width="1" height="4" fill="%23FFF"/><rect x="6" y="4" width="4" height="1" fill="%23FFF"/><rect x="6" y="11" width="4" height="1" fill="%23FFF"/></svg>`,
  effect_heart: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23E91E63" d="M4 5h3v1H4zm5 0h3v1H9zM3 6h10v3H3z"/><rect x="4" y="9" width="8" height="1" fill="%23E91E63"/><rect x="5" y="10" width="6" height="1" fill="%23E91E63"/><rect x="6" y="11" width="4" height="1" fill="%23E91E63"/><rect x="7" y="12" width="2" height="1" fill="%23E91E63"/></svg>`,
  effect_shock: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23FFEB3B" d="M8 2L6 6H2l4 3-2 5 6-4 2 4 2-6h4l-5-3 3-4z"/></svg>`,
  effect_skull: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="%23FFFFFF" d="M4 3h8v1h1v1h1v2h-1v1h-1v1h1v1h1v2h-1v1h-1v1H5v-1H4v-1H3v-2h1v-1h1v-1H4V7H3V5h1V4h1V3zm1 1v1H6v1H5v1h1v1H5v3h1v1h1v1h4v-1h1v-1h1V8h-1V7h1V6h-1V5h-1V4H9v1H8v1H7V5H6V4z"/><path fill="%23000000" d="M6 6h1v1H6zM9 6h1v1H9z"/><path fill="%23FF0000" d="M7 10h2v1H7z"/></svg>`,
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
    dialogue_fail: "Oh no! Wild berries can be dangerous if you don't know what they are.",
    reward: {
      type: "magic_fire",
      description: "A magical fire that allows you to burn obstacles.",
      uses: 1
    }
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
    dialogue_fail: "Too risky! You could fall and get hurt.",
    reward: {
      type: "axe",
      description: "An axe that allows you to cut down trees.",
      uses: 1
    }
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
    dialogue_fail: "Never run! It makes you look like prey.",
    reward: {
      type: "axe",
      description: "An axe that allows you to cut down trees.",
      uses: 1
    }
  },
  {
    scenario_id: "sc_dog_park",
    npc_type: "Strange Dog",
    skin: "wolf", // Reusing wolf skin for dog
    position: { x: 10, y: 25 },
    trigger_area_px: 100,
    question: "Woof! I am a cute but strange dog tied to a pole. I look friendly.",
    options: [
      {
        text: "Run up and pet it.",
        is_correct: false,
        reward_card_prompt: "A snarling dog snapping at a hand, warning style, dark colors"
      },
      {
        text: "Ask the owner first.",
        is_correct: true,
        reward_card_prompt: "A child asking a dog owner for permission, sunny park scene, peaceful"
      }
    ],
    dialogue_success: "Always ask! Even cute dogs can bite if they are scared.",
    dialogue_fail: "Dangerous! You should never touch a strange dog without permission.",
    reward: {
      type: "axe",
      description: "An axe that allows you to cut down trees.",
      uses: 1
    }
  },
  {
    scenario_id: "sc_parking_lot",
    npc_type: "Parked Car",
    skin: "rock", // Using rock as placeholder for car
    position: { x: 20, y: 5 },
    trigger_area_px: 100,
    question: "My ball rolled under this parked car. I can see it right there!",
    options: [
      {
        text: "Crawl under to get it.",
        is_correct: false,
        reward_card_prompt: "A child under a car with exhaust smoke, dangerous perspective, warning style"
      },
      {
        text: "Ask an adult for help.",
        is_correct: true,
        reward_card_prompt: "An adult using a stick to retrieve a ball from under a car, safe and calm"
      }
    ],
    dialogue_success: "Good job! Drivers can't see you if you are small and under the car.",
    dialogue_fail: "Stop! The car might move and you could get hurt.",
    reward: {
      type: "ship",
      description: "A magical ship that allows you to cross water.",
      uses: 1
    }
  },
  {
    scenario_id: "sc_wet_hands",
    npc_type: "Sparky Outlet",
    skin: "cottage", // Using cottage as house context
    position: { x: 45, y: 20 },
    trigger_area_px: 100,
    question: "I just washed my hands and they are wet. I want to unplug my game console.",
    options: [
      {
        text: "Pull the plug now.",
        is_correct: false,
        reward_card_prompt: "Electric sparks flying from an outlet, shock hazard, warning style"
      },
      {
        text: "Dry hands completely first.",
        is_correct: true,
        reward_card_prompt: "Dry hands holding a towel next to a clean outlet, safety instructional style"
      }
    ],
    dialogue_success: "Safety first! Water and electricity do not mix.",
    dialogue_fail: "ZAP! Never touch electricity with wet hands!",
    reward: {
      type: "magic_fire",
      description: "A magical fire that allows you to burn obstacles.",
      uses: 1
    }
  },
  {
    scenario_id: "sc_cliff_edge",
    npc_type: "High Cliff",
    skin: "rock",
    position: { x: 5, y: 5 },
    trigger_area_px: 100,
    question: "Wow, look at that view! But there is no railing here on this high rock.",
    options: [
      {
        text: "Go to the edge to see.",
        is_correct: false,
        reward_card_prompt: "A figure slipping from a high cliff edge, vertigo perspective, warning style"
      },
      {
        text: "Stay back from the edge.",
        is_correct: true,
        reward_card_prompt: "A child enjoying a view from a safe distance behind a barrier, panoramic landscape"
      }
    ],
    dialogue_success: "Smart! Edges can be slippery or crumble. Stay back.",
      dialogue_fail: "Too close! One slip and you could fall.",
      reward: {
        type: "magic_fire",
        description: "A magical fire that allows you to burn obstacles.",
        uses: 1
      }
  },
  {
    scenario_id: "sc_hot_pot",
    npc_type: "Boiling Pot",
    skin: "cottage",
    position: { x: 35, y: 25 },
    trigger_area_px: 100,
    question: "Steam is coming from this pot on the stove. It smells like soup!",
    options: [
      {
        text: "Reach up to taste it.",
        is_correct: false,
        reward_card_prompt: "A pot spilling hot liquid, steam and danger signs, warning style"
      },
      {
        text: "Wait for an adult.",
        is_correct: true,
        reward_card_prompt: "A family eating soup together at a table, warm and cozy atmosphere"
      }
    ],
    dialogue_success: "Patience is key! Hot things can burn you badly.",
    dialogue_fail: "Ouch! You could pull the hot pot down on yourself.",
    reward: {
      type: "magic_fire",
      description: "A magical fire that allows you to burn obstacles.",
      uses: 1
    }
  },
  {
    scenario_id: "sc_toxic_plant",
    npc_type: "Mystery Plant",
    skin: "pine_tree",
    position: { x: 42, y: 15 },
    trigger_area_px: 100,
    question: "This plant has weird glowing berries. They look like candy.",
    options: [
      {
        text: "Eat one to try.",
        is_correct: false,
        reward_card_prompt: "A sick face turning green, poison symbols, warning style"
      },
      {
        text: "Don't touch it.",
        is_correct: true,
        reward_card_prompt: "A botanical guide book showing safe vs dangerous plants, educational style"
      }
    ],
    dialogue_success: "Correct! Never eat wild plants unless you are 100% sure.",
    dialogue_fail: "No! Many plants are poisonous and can make you very sick.",
    reward: {
      type: "heart",
      description: "A magical heart that allows you to heal obstacles.",
      uses: 1
    }
  }
];

// --- MAP GENERATION: Organic Village ---
export const MAP_GENERATION = (() => {
  const obstacles = new Set<string>();
  const terrain: TerrainType[][] = Array(MAP_WIDTH).fill(null).map(() => Array(MAP_HEIGHT).fill('grass'));
  const npcSafeZones: { x: number, y: number }[] = [];

  // Register NPC Locations to keep clear
  PREBUILT_SCENARIOS.forEach(npc => {
    if (npc.position) npcSafeZones.push(npc.position);
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
    if (pathX >= 0 && pathX < MAP_WIDTH && pathY >= 0 && pathY < MAP_HEIGHT) {
      terrain[pathX][pathY] = 'path';
      // Widen path
      if (pathX + 1 < MAP_WIDTH) terrain[pathX + 1][pathY] = 'path';
      if (pathY + 1 < MAP_HEIGHT) terrain[pathX][pathY + 1] = 'path';
    }

    // Random walk
    if (Math.random() > 0.5) pathX += 1;
    else pathY += (Math.random() > 0.5 ? 1 : -1);
  }

  // 1.5 Generate River
  let riverX = 10;
  let riverY = 0;
  for (let i = 0; i < MAP_HEIGHT; i++) {
    if (riverX >= 0 && riverX < MAP_WIDTH) {
      // Check if we are crossing a path
      if (terrain[riverX][i] === 'path') {
        terrain[riverX][i] = 'bridge';
        // Don't add obstacle
      } else {
        terrain[riverX][i] = 'water';
        addObstacle(riverX, i, 'water');
      }

      // Widen river
      if (riverX + 1 < MAP_WIDTH) {
        if (terrain[riverX + 1][i] === 'path') {
          terrain[riverX + 1][i] = 'bridge';
        } else {
          terrain[riverX + 1][i] = 'water';
          addObstacle(riverX + 1, i, 'water');
        }
      }
    }
    // Meander
    if (Math.random() > 0.6) riverX += (Math.random() > 0.5 ? 1 : -1);
  }

  // 1.6 Generate Lake
  const lakeCenterX = 35;
  const lakeCenterY = 20;
  const lakeRadius = 4;
  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      if (Math.hypot(x - lakeCenterX, y - lakeCenterY) < lakeRadius) {
        terrain[x][y] = 'water';
        addObstacle(x, y, 'water');
      }
    }
  }

  // 2. Add Cottages near path
  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      if (terrain[x][y] === 'grass' && Math.random() > 0.98) {
        // check if near path
        let nearPath = false;
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            if (x + dx >= 0 && x + dx < MAP_WIDTH && y + dy >= 0 && y + dy < MAP_HEIGHT) {
              if (terrain[x + dx][y + dy] === 'path') nearPath = true;
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
  for (let x = 0; x < MAP_WIDTH; x++) {
    addObstacle(x, 0, 'tree');
    addObstacle(x, MAP_HEIGHT - 1, 'tree');
  }
  for (let y = 0; y < MAP_HEIGHT; y++) {
    addObstacle(0, y, 'tree');
    addObstacle(MAP_WIDTH - 1, y, 'tree');
  }

  return { obstacles, terrain };
})();

export const OBSTACLES_SET = MAP_GENERATION.obstacles;
export const TERRAIN_MAP = MAP_GENERATION.terrain;
