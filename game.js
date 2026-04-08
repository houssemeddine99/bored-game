const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const minimap = document.getElementById("minimap");
const minimapCtx = minimap.getContext("2d");

const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const p2CardEl = document.getElementById("p2-card");
const p2ScoreEl = document.getElementById("p2-score");
const bestEl = document.getElementById("best");
const controlsTextEl = document.getElementById("controls-text");
const comboTextEl = document.getElementById("combo-text");
const missionTextEl = document.getElementById("mission-text");
const progressTextEl = document.getElementById("progress-text");
const leaderboardEl = document.getElementById("leaderboard");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");
const summaryEl = document.getElementById("summary");
const countdownEl = document.getElementById("countdown");
const startBtn = document.getElementById("start-btn");
const quickStartBtn = document.getElementById("quick-start-btn");
const modeSelectEl = document.getElementById("mode-select");
const botSelectEl = document.getElementById("bot-select");
const arenaSelectEl = document.getElementById("arena-select");
const rulesSelectEl = document.getElementById("rules-select");
const difficultySelectEl = document.getElementById("difficulty-select");
const skinSelectEl = document.getElementById("skin-select");
const hatSelectEl = document.getElementById("hat-select");
const necklaceSelectEl = document.getElementById("necklace-select");
const joystickBaseEl = document.getElementById("joystick-base");
const joystickKnobEl = document.getElementById("joystick-knob");
const joystickSenseEl = document.getElementById("joystick-sense");
const handednessSelectEl = document.getElementById("handedness-select");
const vibrationToggleEl = document.getElementById("vibration-toggle");
const touchControlsEl = document.querySelector(".touch-controls");
const settingsBtnEl = document.getElementById("settings-btn");
const settingsPanelEl = document.getElementById("settings-panel");

const WORLD = { width: 2800, height: 2800 };
const ARENA_SIZE = {
  small: { width: 2200, height: 2200 },
  medium: { width: 2800, height: 2800 },
  large: { width: 3600, height: 3600 },
};

const CELL = 20;
const TARGET_FPS = 60;
const STEP_MS = 1000 / TARGET_FPS;
const MAX_FOOD = 280;
const MAX_POWERUPS = 4;
const POWERUP_SPAWN_INTERVAL = 12;

const DIR = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const BASE_SPEED = 7.2;
const BOOST_MULTIPLIER = 1.65;
const FOOD_COUNT = 150;
const START_LENGTH = 16;
const BOOST_SHED_INTERVAL = 0.11;
const BOT_SPEED_MIN = 5.8;
const BOT_SPEED_MAX = 7.4;
const FOOD_COMBO_WINDOW = 2;
const KILL_COMBO_WINDOW = 6;
const CAMERA_LERP = 0.16;
const PARTICLE_MAX = 500;
const SETTINGS_KEY = "serpent-settings-v1";
const MISSION_KEY = "serpent-daily-missions-v1";
const SUDDEN_START_AFTER = 35;
const SUDDEN_SHRINK_INTERVAL = 20;
const SUDDEN_SHRINK_CELLS = 2;

const BOT_PERSONALITIES = [
  { id: "scavenger", tag: "Scav", speedBias: 0.15 },
  { id: "aggressive", tag: "Rage", speedBias: 0.32 },
  { id: "survivor", tag: "Safe", speedBias: -0.08 },
  { id: "trickster", tag: "Chaos", speedBias: 0.05 },
];

const PROFILE_KEY = "serpent-profile-v2";
const BEST_KEY = "serpent-best";

const DAILY_MISSIONS = [
  { id: "food_40", label: "Eat 40 food", metric: "food", target: 40, reward: 35 },
  { id: "big_8", label: "Eat 8 big food", metric: "bigFood", target: 8, reward: 45 },
  { id: "kills_3", label: "Get 3 kills", metric: "kills", target: 3, reward: 60 },
  { id: "survive_180", label: "Survive 180s", metric: "survival", target: 180, reward: 50 },
  { id: "boost_70", label: "Boost for 70s", metric: "boost", target: 70, reward: 40 },
];

const SKINS = [
  { id: "sprout", name: "Sprout", unlockPoints: 0, colorHead: "#eaffef", colorBody: [90, 240, 130] },
  { id: "frost", name: "Frost", unlockPoints: 250, colorHead: "#d6f3ff", colorBody: [112, 198, 255] },
  { id: "banana", name: "Banana Panic", unlockPoints: 520, colorHead: "#fff6ae", colorBody: [255, 222, 84] },
  { id: "ember", name: "Ember", unlockPoints: 760, colorHead: "#ffe9cc", colorBody: [255, 153, 90] },
  { id: "pickle", name: "Pickle Boss", unlockPoints: 980, colorHead: "#dcffaf", colorBody: [130, 210, 93] },
  { id: "void", name: "Void", unlockPoints: 1400, colorHead: "#f0ddff", colorBody: [160, 122, 255] },
  { id: "gold", name: "Gold Rush", unlockPoints: 2200, colorHead: "#fff1ba", colorBody: [255, 216, 102] },
];

const HATS = [
  { id: "none", name: "No Hat", price: 0 },
  { id: "cap", name: "Cap", price: 80 },
  { id: "party", name: "Party Hat", price: 140 },
  { id: "crown", name: "Crown", price: 260 },
  { id: "halo", name: "Halo", price: 330 },
];

const NECKLACES = [
  { id: "none", name: "No Necklace", price: 0 },
  { id: "chain", name: "Chain", price: 90 },
  { id: "pearl", name: "Pearls", price: 150 },
  { id: "bowtie", name: "Bowtie", price: 170 },
  { id: "spikes", name: "Spikes", price: 290 },
];

const POWERUPS = [
  { id: "shield", name: "Shield", color: "#FFD700", duration: 8, effect: "immunity", emoji: "🛡️" },
  { id: "teleport", name: "Teleport", color: "#FF69B4", duration: 0.1, effect: "teleport", emoji: "🌀" },
  { id: "oneshot", name: "One-Shot", color: "#FF4444", duration: 6, effect: "oneshot", emoji: "💥" },
  { id: "speed", name: "Speedy Boi", color: "#00FF00", duration: 5, effect: "speed", emoji: "⚡" },
  { id: "magnet", name: "Magnet Mouth", color: "#FF8C00", duration: 7, effect: "magnet", emoji: "🧲" },
  { id: "freeze", name: "Freeze Ray", color: "#00BFFF", duration: 0.1, effect: "freeze", emoji: "❄️" },
  { id: "growth", name: "Size Boom", color: "#FFB6C1", duration: 0.1, effect: "growth", emoji: "💪" },
  { id: "hypnotic", name: "Hypnotic Gaze", color: "#9370DB", duration: 4, effect: "hypnotic", emoji: "😵" },
  { id: "ghost", name: "Ghost Mode", color: "#D3D3D3", duration: 5, effect: "ghost", emoji: "👻" },
];

let state;
let rafId = 0;
let lastFrame = 0;
let accumulator = 0;
let bestScore = Number(localStorage.getItem(BEST_KEY) || 0);
let countdownActive = false;
let profile = loadProfile();
let progressMessageTimer = 0;
let mobileSettings = loadGameSettings();
let joystickState = {
  active: false,
  pointerId: null,
};

function loadGameSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return {
      joystickSensitivity: Number(parsed.joystickSensitivity || 1),
      handedness: parsed.handedness === "left" ? "left" : "right",
      vibration: parsed.vibration !== false,
    };
  } catch {
    return { joystickSensitivity: 1, handedness: "right", vibration: true };
  }
}

function saveGameSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(mobileSettings));
}

function applyTouchLayout() {
  if (!touchControlsEl) return;
  touchControlsEl.classList.toggle("left-handed", mobileSettings.handedness === "left");
}

function syncSettingsControls() {
  if (joystickSenseEl) joystickSenseEl.value = String(mobileSettings.joystickSensitivity);
  if (handednessSelectEl) handednessSelectEl.value = mobileSettings.handedness;
  if (vibrationToggleEl) vibrationToggleEl.checked = mobileSettings.vibration;

  applyTouchLayout();
}

function vibratePulse(ms) {
  if (!mobileSettings.vibration) return;
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(ms);
  }
}

function loadProfile() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
    const unlocked = Array.isArray(parsed.unlockedSkinIds) ? parsed.unlockedSkinIds : ["sprout"];
    const ownedHats = Array.isArray(parsed.ownedHats) ? parsed.ownedHats : ["none"];
    const ownedNecklaces = Array.isArray(parsed.ownedNecklaces) ? parsed.ownedNecklaces : ["none"];

    return {
      totalPoints: Number(parsed.totalPoints || 0),
      coins: Number(parsed.coins || 0),
      unlockedSkinIds: unlocked.includes("sprout") ? unlocked : ["sprout", ...unlocked],
      selectedSkinId: parsed.selectedSkinId || "sprout",
      ownedHats: ownedHats.includes("none") ? ownedHats : ["none", ...ownedHats],
      selectedHat: parsed.selectedHat || "none",
      ownedNecklaces: ownedNecklaces.includes("none") ? ownedNecklaces : ["none", ...ownedNecklaces],
      selectedNecklace: parsed.selectedNecklace || "none",
    };
  } catch {
    return {
      totalPoints: 0,
      coins: 0,
      unlockedSkinIds: ["sprout"],
      selectedSkinId: "sprout",
      ownedHats: ["none"],
      selectedHat: "none",
      ownedNecklaces: ["none"],
      selectedNecklace: "none",
    };
  }
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function getSkinById(id) {
  return SKINS.find((skin) => skin.id === id) || SKINS[0];
}

function getPropById(catalog, id) {
  return catalog.find((prop) => prop.id === id) || catalog[0];
}

function showProgressMessage(message) {
  window.clearTimeout(progressMessageTimer);
  progressTextEl.dataset.temp = "1";
  progressTextEl.textContent = message;
  progressMessageTimer = window.setTimeout(() => {
    progressTextEl.dataset.temp = "";
    updateProgressText();
  }, 2400);
}

function populateSkinOptions() {
  skinSelectEl.innerHTML = "";

  for (const skin of SKINS) {
    const unlocked = profile.unlockedSkinIds.includes(skin.id);
    const option = document.createElement("option");
    option.value = skin.id;
    option.textContent = unlocked ? skin.name : `${skin.name} (${skin.unlockPoints} pts)`;
    option.disabled = !unlocked;
    skinSelectEl.appendChild(option);
  }

  if (!profile.unlockedSkinIds.includes(profile.selectedSkinId)) {
    profile.selectedSkinId = "sprout";
  }

  skinSelectEl.value = profile.selectedSkinId;
}

function populatePropOptions(selectEl, catalog, ownedList, selectedId) {
  selectEl.innerHTML = "";

  for (const item of catalog) {
    const owned = ownedList.includes(item.id);
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = owned ? item.name : `${item.name} (${item.price} coins)`;
    selectEl.appendChild(option);
  }

  selectEl.value = selectedId;
}

function updateProgressText() {
  if (progressTextEl.dataset.temp === "1") return;

  const nextSkin = SKINS.find((skin) => !profile.unlockedSkinIds.includes(skin.id));
  const skinLine = nextSkin
    ? `${Math.max(0, nextSkin.unlockPoints - profile.totalPoints)} pts to unlock ${nextSkin.name}`
    : "All skins unlocked";

  progressTextEl.textContent = `Coins: ${profile.coins}. Progress: ${profile.totalPoints} pts. ${skinLine}.`;
}

function applyArenaSize(size) {
  const setting = ARENA_SIZE[size] || ARENA_SIZE.medium;
  WORLD.width = setting.width;
  WORLD.height = setting.height;
}

function getSettings() {
  return {
    mode: modeSelectEl.value,
    botCount: Number(botSelectEl.value || 6),
    arenaSize: arenaSelectEl.value || "medium",
    ruleset: rulesSelectEl ? rulesSelectEl.value : "classic",
    botDifficulty: difficultySelectEl ? difficultySelectEl.value : "normal",
  };
}

function getActiveBoundsCells() {
  const margin = state && state.settings && state.settings.ruleset === "sudden" ? state.suddenDeath.marginCells : 0;
  const maxX = WORLD.width / CELL - 1;
  const maxY = WORLD.height / CELL - 1;
  return {
    minX: margin,
    minY: margin,
    maxX: Math.max(margin + 5, maxX - margin),
    maxY: Math.max(margin + 5, maxY - margin),
  };
}

function isOutsideActiveBounds(cell) {
  const b = getActiveBoundsCells();
  return cell.x < b.minX || cell.y < b.minY || cell.x > b.maxX || cell.y > b.maxY;
}

function randomFoodType(forceBig = false) {
  if (forceBig) {
    return { type: "big", value: 40, growth: 3.1, radius: 0.46 };
  }

  const roll = Math.random();
  if (roll < 0.11) {
    return { type: "big", value: 40, growth: 3.1, radius: 0.46 };
  }

  return { type: "small", value: 10, growth: 1.45, radius: 0.3 };
}

function makeFoodAt(cell, forceBig = false) {
  const meta = randomFoodType(forceBig);
  return {
    x: cell.x,
    y: cell.y,
    type: meta.type,
    value: meta.value,
    growth: meta.growth,
    radius: meta.radius,
  };
}

function getDifficultyProfile(level) {
  if (level === "easy") return { speedMul: 0.9, greed: 0.86, commit: 0.62 };
  if (level === "hard") return { speedMul: 1.08, greed: 1.15, commit: 0.95 };
  return { speedMul: 1, greed: 1, commit: 0.82 };
}

function getDayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function createDailyMissions() {
  const dayKey = getDayKey();
  try {
    const saved = JSON.parse(localStorage.getItem(MISSION_KEY) || "{}");
    if (saved.dayKey === dayKey && Array.isArray(saved.missions) && saved.missions.length) {
      return saved.missions;
    }
  } catch {
    // Ignore malformed cache and regenerate.
  }

  const shuffled = [...DAILY_MISSIONS].sort(() => Math.random() - 0.5);
  const missions = shuffled.slice(0, 3).map((m) => ({ ...m, progress: 0, completed: false }));
  localStorage.setItem(MISSION_KEY, JSON.stringify({ dayKey, missions }));
  return missions;
}

function saveDailyMissions(missions) {
  localStorage.setItem(MISSION_KEY, JSON.stringify({ dayKey: getDayKey(), missions }));
}

function resetState() {
  const settings = getSettings();
  applyArenaSize(settings.arenaSize);

  const centerX = Math.floor(WORLD.width / CELL / 2);
  const centerY = Math.floor(WORLD.height / CELL / 2);
  const playerSkin = getSkinById(profile.selectedSkinId);

  const playerOne = createSnake({
    id: "p1",
    name: "P1",
    colorHead: playerSkin.colorHead,
    colorBody: playerSkin.colorBody,
    hat: profile.selectedHat,
    necklace: profile.selectedNecklace,
    start: { x: centerX - 14, y: centerY },
    dir: DIR.right,
    speed: BASE_SPEED,
    length: START_LENGTH,
    type: "player",
  });

  const players = [playerOne];
  if (settings.mode === "duo") {
    players.push(
      createSnake({
        id: "p2",
        name: "P2",
        colorHead: "#d6f3ff",
        colorBody: [112, 198, 255],
        hat: "none",
        necklace: "none",
        start: { x: centerX + 14, y: centerY },
        dir: DIR.left,
        speed: BASE_SPEED,
        length: START_LENGTH,
        type: "player",
      })
    );
  }

  const botCount = settings.mode === "duo" ? Math.max(1, settings.botCount - 2) : settings.botCount;
  const bots = createBots(botCount, players);
  const blocked = collectAllSegments([...players, ...bots]);
  const missions = createDailyMissions();

  state = {
    settings,
    running: false,
    gameOver: false,
    startedAt: 0,
    endedAt: 0,
    coinsEarned: 0,
    bigFoodTimer: 4 + Math.random() * 5,
    powerupTimer: 8 + Math.random() * 4,
    players,
    bots,
    food: spawnFood(FOOD_COUNT, blocked),
    powerups: [],
    powerupPopups: [],
    missions,
    matchStats: {
      food: 0,
      bigFood: 0,
      kills: 0,
      survival: 0,
      boost: 0,
    },
    suddenDeath: {
      timer: 0,
      marginCells: 0,
      nextShrinkAt: SUDDEN_START_AFTER,
    },
    particles: [],
    screenFx: {
      shakeTime: 0,
      shakePower: 0,
      shakeX: 0,
      shakeY: 0,
      hitFlash: 0,
    },
    camera: { x: players[0].segments[0].x * CELL, y: players[0].segments[0].y * CELL },
  };

  updateHud();
  updateLeaderboard();
  updateMissionText();
  applyModeUi();
  updateProgressText();
}

function createSnake(config) {
  const segments = [];
  for (let i = 0; i < config.length; i += 1) {
    segments.push({ x: config.start.x - config.dir.x * i, y: config.start.y - config.dir.y * i });
  }

  return {
    id: config.id,
    name: config.name,
    segments,
    dir: { ...config.dir },
    queue: [],
    growth: 0,
    speedCellsPerSec: config.speed,
    boostHeld: false,
    boostTimer: 0,
    boostShedTimer: 0,
    colorHead: config.colorHead,
    colorBody: config.colorBody,
    hat: config.hat || "none",
    necklace: config.necklace || "none",
    type: config.type,
    alive: true,
    score: 0,
    maxLength: config.length,
    combo: {
      foodChain: 0,
      killChain: 0,
      lastFoodAt: 0,
      lastKillAt: 0,
      multiplier: 1,
    },
    activePowerups: [],
    mouthOpen: 0,
  };
}

function nowSec() {
  return performance.now() / 1000;
}

function recalcComboMultiplier(combo) {
  const foodBonus = Math.min(0.6, Math.floor(combo.foodChain / 5) * 0.1);
  const killBonus = Math.min(1, combo.killChain * 0.16);
  combo.multiplier = 1 + foodBonus + killBonus;
  return combo.multiplier;
}

function registerFoodCombo(snake, baseFoodValue) {
  if (!snake || snake.type !== "player" || !snake.combo) return;

  const combo = snake.combo;
  const t = nowSec();
  combo.foodChain = t - combo.lastFoodAt <= FOOD_COMBO_WINDOW ? combo.foodChain + 1 : 1;
  combo.lastFoodAt = t;

  const mult = recalcComboMultiplier(combo);
  const bonus = Math.max(0, Math.round(baseFoodValue * (mult - 1)));
  if (bonus > 0) {
    snake.score += bonus;
  }

  if (combo.foodChain >= 4 && combo.foodChain % 4 === 0) {
    showProgressMessage(`${snake.name} combo x${mult.toFixed(2)}! +${bonus} bonus`);
  }
}

function registerKillCombo(killer) {
  if (!killer || killer.type !== "player" || !killer.combo) return;

  const combo = killer.combo;
  const t = nowSec();
  combo.killChain = t - combo.lastKillAt <= KILL_COMBO_WINDOW ? combo.killChain + 1 : 1;
  combo.lastKillAt = t;

  const mult = recalcComboMultiplier(combo);
  const streakBonusCoins = 4 * combo.killChain;
  profile.coins += streakBonusCoins;
  state.coinsEarned += streakBonusCoins;
  saveProfile();
  updateHud();
  progressMission("kills", 1);

  showProgressMessage(`${killer.name} streak ${combo.killChain}! x${mult.toFixed(2)} +${streakBonusCoins} coins`);
}

function decayCombos() {
  const t = nowSec();
  for (const snake of [...state.players, ...state.bots]) {
    if (!snake.combo) continue;

    if (snake.combo.foodChain > 0 && t - snake.combo.lastFoodAt > FOOD_COMBO_WINDOW) {
      snake.combo.foodChain = 0;
    }

    if (snake.combo.killChain > 0 && t - snake.combo.lastKillAt > KILL_COMBO_WINDOW) {
      snake.combo.killChain = 0;
    }

    recalcComboMultiplier(snake.combo);
  }
}

function updateMissionText() {
  if (!missionTextEl || !state || !state.missions || !state.missions.length) return;
  const next = state.missions.find((m) => !m.completed) || state.missions[0];
  missionTextEl.textContent = next.completed
    ? "All daily missions done"
    : `${next.label} (${next.progress}/${next.target})`;
}

function progressMission(metric, amount) {
  if (!state || !state.missions) return;

  let changed = false;
  for (const mission of state.missions) {
    if (mission.completed || mission.metric !== metric) continue;

    const before = mission.progress;
    mission.progress = Math.min(mission.target, mission.progress + amount);
    if (mission.progress !== before) changed = true;

    if (mission.progress >= mission.target) {
      mission.completed = true;
      profile.coins += mission.reward;
      state.coinsEarned += mission.reward;
      showProgressMessage(`Mission complete: ${mission.label} (+${mission.reward} coins)`);
      vibratePulse(40);
      changed = true;
    }
  }

  if (changed) {
    saveProfile();
    saveDailyMissions(state.missions);
    updateHud();
    updateMissionText();
  }
}

function applyModeUi() {
  const isDuo = state.settings.mode === "duo";
  p2CardEl.classList.toggle("show-card", isDuo);
  controlsTextEl.textContent = isDuo
    ? "P1: WASD/Arrows + Space | P2: IJKL + Shift"
    : "P1: WASD/Arrows + Space boost";
}

function randomStart() {
  return {
    x: 8 + Math.floor(Math.random() * (WORLD.width / CELL - 16)),
    y: 8 + Math.floor(Math.random() * (WORLD.height / CELL - 16)),
  };
}

function createBots(amount, existingSnakes) {
  const bots = [];
  const difficulty = getDifficultyProfile(state ? state.settings.botDifficulty : getSettings().botDifficulty);

  for (let i = 0; i < amount; i += 1) {
    const personality = BOT_PERSONALITIES[i % BOT_PERSONALITIES.length];
    const hueShift = 40 + i * 24;
    const bot = createSnake({
      id: `bot-${i + 1}`,
      name: `${personality.tag} ${i + 1}`,
      colorHead: `hsl(${hueShift}, 90%, 80%)`,
      colorBody: [80 + ((i * 22) % 130), 150 + ((i * 16) % 90), 110 + ((i * 15) % 80)],
      hat: "none",
      necklace: "none",
      start: randomStart(),
      dir: Object.values(DIR)[Math.floor(Math.random() * 4)],
      speed: (BOT_SPEED_MIN + Math.random() * (BOT_SPEED_MAX - BOT_SPEED_MIN) + personality.speedBias) * difficulty.speedMul,
      length: 12 + Math.floor(Math.random() * 7),
      type: "bot",
    });
    bot.personality = personality.id;

    let retries = 0;
    while (isOccupied(bot.segments[0], [...existingSnakes, ...bots]) && retries < 35) {
      const start = randomStart();
      bot.segments = [];
      for (let j = 0; j < 12; j += 1) {
        bot.segments.push({ x: start.x - bot.dir.x * j, y: start.y - bot.dir.y * j });
      }
      retries += 1;
    }

    bots.push(bot);
  }

  return bots;
}

function collectAllSegments(snakes) {
  const segments = [];
  for (const snake of snakes) {
    for (const seg of snake.segments) segments.push(seg);
  }
  return segments;
}

function isOccupied(cell, snakes) {
  for (const snake of snakes) {
    for (const seg of snake.segments) {
      if (seg.x === cell.x && seg.y === cell.y) return true;
    }
  }
  return false;
}

function randomCell() {
  return {
    x: Math.floor(Math.random() * (WORLD.width / CELL)),
    y: Math.floor(Math.random() * (WORLD.height / CELL)),
  };
}

function spawnFood(amount, blockedSegments, forceBig = false) {
  const blocked = new Set(blockedSegments.map((seg) => `${seg.x},${seg.y}`));
  const items = [];

  while (items.length < amount) {
    const spot = randomCell();
    const key = `${spot.x},${spot.y}`;
    if (!blocked.has(key)) {
      items.push(makeFoodAt(spot, forceBig));
      blocked.add(key);
    }
  }

  return items;
}

function spawnPowerup(blockedSegments) {
  const blocked = new Set(blockedSegments.map((seg) => `${seg.x},${seg.y}`));
  let retries = 0;
  while (retries < 50) {
    const spot = randomCell();
    const key = `${spot.x},${spot.y}`;
    if (!blocked.has(key)) {
      const randomPowerup = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
      return {
        x: spot.x,
        y: spot.y,
        type: randomPowerup.id,
        name: randomPowerup.name,
        color: randomPowerup.color,
        effect: randomPowerup.effect,
        emoji: randomPowerup.emoji,
      };
    }
    retries += 1;
  }
  return null;
}

function activatePowerup(snake, powerupType) {
  if (!snake || !snake.alive) return;

  const powerupObj = POWERUPS.find((p) => p.id === powerupType);
  if (!powerupObj) return;

  addPowerupPopup(snake, powerupObj);

  if (powerupObj.effect === "teleport") {
    let teleportSpot = randomCell();
    let retries = 0;
    while (isOccupied(teleportSpot, [...state.players, ...state.bots].filter((s) => s !== snake)) && retries < 50) {
      teleportSpot = randomCell();
      retries += 1;
    }
    const dx = teleportSpot.x - snake.segments[0].x;
    const dy = teleportSpot.y - snake.segments[0].y;
    for (let i = 0; i < snake.segments.length; i += 1) {
      snake.segments[i].x += dx;
      snake.segments[i].y += dy;
    }
    showProgressMessage(`${snake.name} teleported! 🌀`);
    return;
  }

  if (powerupObj.effect === "growth") {
    snake.growth += 10;
    showProgressMessage(`${snake.name} got SIZE BOOM! 💪`);
    return;
  }

  if (powerupObj.effect === "freeze") {
    for (const bot of state.bots) {
      if (bot.alive && bot !== snake) {
        bot.activePowerups.push({ type: "frozen", timer: 3 });
      }
    }
    showProgressMessage(`All bots frozen! ❄️`);
    return;
  }

  snake.activePowerups.push({ type: powerupType, timer: powerupObj.duration });
  showProgressMessage(`${snake.name} got ${powerupObj.name}! ${powerupObj.emoji}`);
}

function addPowerupPopup(snake, powerupObj) {
  if (!snake || !snake.segments.length || !state) return;

  const head = snake.segments[0];
  state.powerupPopups.push({
    x: head.x,
    y: head.y,
    text: powerupObj.name,
    type: powerupObj.id,
    color: powerupObj.color,
    ttl: 1.2,
    duration: 1.2,
    rise: 0,
  });
}

function spawnParticles(x, y, count, color, speedMin = 40, speedMax = 150, lifeMin = 0.2, lifeMax = 0.45, size = 2.2) {
  if (!state || !state.particles) return;

  for (let i = 0; i < count; i += 1) {
    if (state.particles.length >= PARTICLE_MAX) break;

    const angle = Math.random() * Math.PI * 2;
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    const ttl = lifeMin + Math.random() * (lifeMax - lifeMin);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      ttl,
      maxTtl: ttl,
      size: size * (0.75 + Math.random() * 0.6),
      color,
    });
  }
}

function addSpeedTrail(snake) {
  if (!snake || !snake.alive || !snake.segments.length) return;
  const head = snake.segments[0];
  spawnParticles(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, 2, "rgba(170,255,190,0.9)", 25, 70, 0.12, 0.2, 1.8);
}

function triggerScreenShake(power, duration = 0.12) {
  if (!state || !state.screenFx) return;
  state.screenFx.shakePower = Math.max(state.screenFx.shakePower, power);
  state.screenFx.shakeTime = Math.max(state.screenFx.shakeTime, duration);
}

function triggerHitFlash(intensity = 0.4) {
  if (!state || !state.screenFx) return;
  state.screenFx.hitFlash = Math.max(state.screenFx.hitFlash, intensity);
}

function updateEffects(dtSec) {
  if (!state) return;

  if (state.particles) {
    const drag = 0.92;
    state.particles = state.particles.filter((p) => {
      p.ttl -= dtSec;
      if (p.ttl <= 0) return false;
      p.x += p.vx * dtSec;
      p.y += p.vy * dtSec;
      p.vx *= drag;
      p.vy *= drag;
      return true;
    });
  }

  if (state.screenFx) {
    const fx = state.screenFx;
    fx.hitFlash = Math.max(0, fx.hitFlash - dtSec * 1.8);

    if (fx.shakeTime > 0) {
      fx.shakeTime = Math.max(0, fx.shakeTime - dtSec);
      const power = fx.shakePower * (fx.shakeTime / Math.max(0.001, fx.shakeTime + dtSec));
      fx.shakeX = (Math.random() * 2 - 1) * power;
      fx.shakeY = (Math.random() * 2 - 1) * power;
      fx.shakePower = Math.max(0, fx.shakePower - dtSec * 38);
    } else {
      fx.shakeX = 0;
      fx.shakeY = 0;
      fx.shakePower = 0;
    }
  }
}

function queueDirection(snake, nextDir) {
  if (!snake || !snake.alive) return;
  const lastInput = snake.queue.at(-1) || snake.dir;
  if (lastInput.x + nextDir.x === 0 && lastInput.y + nextDir.y === 0) return;
  if (snake.queue.length < 2) snake.queue.push(nextDir);
}

function bindKeyboard() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const p1 = state.players[0];
    const p2 = state.players[1];

    if (key === "arrowup" || key === "w") queueDirection(p1, DIR.up);
    if (key === "arrowdown" || key === "s") queueDirection(p1, DIR.down);
    if (key === "arrowleft" || key === "a") queueDirection(p1, DIR.left);
    if (key === "arrowright" || key === "d") queueDirection(p1, DIR.right);

    if (key === " ") {
      p1.boostHeld = true;
      event.preventDefault();
    }

    if (p2) {
      if (key === "i") queueDirection(p2, DIR.up);
      if (key === "k") queueDirection(p2, DIR.down);
      if (key === "j") queueDirection(p2, DIR.left);
      if (key === "l") queueDirection(p2, DIR.right);
      if (event.key === "Shift") p2.boostHeld = true;
    }

    if (key === "p" && state.running) {
      state.running = false;
      showOverlay("Paused. Press start for GO countdown.", "Resume");
    }
  });

  document.addEventListener("keyup", (event) => {
    const p1 = state.players[0];
    const p2 = state.players[1];

    if (event.key === " ") p1.boostHeld = false;
    if (p2 && event.key === "Shift") p2.boostHeld = false;
  });
}

function bindTouchButtons() {
  const buttons = document.querySelectorAll(".touch-btn");

  buttons.forEach((button) => {
    const dir = button.dataset.dir;

    button.addEventListener("pointerdown", () => {
      const p1 = state.players[0];
      if (!p1) return;

      if (dir === "boost") {
        p1.boostHeld = true;
        return;
      }

      queueDirection(p1, DIR[dir]);
    });

    button.addEventListener("pointerup", () => {
      if (dir === "boost" && state.players[0]) state.players[0].boostHeld = false;
    });

    button.addEventListener("pointercancel", () => {
      if (dir === "boost" && state.players[0]) state.players[0].boostHeld = false;
    });
  });
}

function bindVirtualJoystick() {
  if (!joystickBaseEl || !joystickKnobEl) return;

  const maxRadiusBase = 34;

  const resetJoystick = () => {
    joystickState.active = false;
    joystickState.pointerId = null;
    joystickKnobEl.style.transform = "translate(-50%, -50%)";
  };

  const updateFromPointer = (event) => {
    if (!joystickState.active) return;
    if (joystickState.pointerId !== event.pointerId) return;

    const rect = joystickBaseEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = maxRadiusBase * mobileSettings.joystickSensitivity;

    if (dist > maxRadius) {
      const k = maxRadius / dist;
      dx *= k;
      dy *= k;
    }

    joystickKnobEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    const p1 = state && state.players ? state.players[0] : null;
    if (!p1 || !p1.alive) return;

    const deadZone = 12;
    if (Math.abs(dx) < deadZone && Math.abs(dy) < deadZone) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      queueDirection(p1, dx > 0 ? DIR.right : DIR.left);
    } else {
      queueDirection(p1, dy > 0 ? DIR.down : DIR.up);
    }
  };

  joystickBaseEl.addEventListener("pointerdown", (event) => {
    joystickState.active = true;
    joystickState.pointerId = event.pointerId;
    joystickBaseEl.setPointerCapture(event.pointerId);
    event.preventDefault();
    updateFromPointer(event);
  });

  joystickBaseEl.addEventListener("pointermove", (event) => {
    event.preventDefault();
    updateFromPointer(event);
  });

  joystickBaseEl.addEventListener("pointerup", resetJoystick);
  joystickBaseEl.addEventListener("pointercancel", resetJoystick);
}

function bindOverlay() {
  startBtn.addEventListener("click", async () => {
    if (countdownActive) return;

    if (state.gameOver) {
      resetState();
    }

    await playCountdown();
    if (!state.startedAt) state.startedAt = performance.now();

    state.running = true;
    overlay.classList.add("hidden");
    startBtn.textContent = "Resume";
    countdownEl.textContent = "";
  });

  if (quickStartBtn) {
    quickStartBtn.addEventListener("click", () => {
      if (state.gameOver) {
        resetState();
      }
      if (!state.startedAt) state.startedAt = performance.now();
      state.running = true;
      overlay.classList.add("hidden");
      startBtn.textContent = "Resume";
      countdownEl.textContent = "";
    });
  }
}

function bindGameSettings() {
  if (settingsBtnEl && settingsPanelEl) {
    settingsBtnEl.addEventListener("click", () => {
      settingsPanelEl.classList.toggle("collapsed");
    });
  }

  const onJoystickSense = (value) => {
    mobileSettings.joystickSensitivity = Math.max(0.6, Math.min(1.8, Number(value) || 1));
    saveGameSettings();
    syncSettingsControls();
  };

  const onHandedness = (value) => {
    mobileSettings.handedness = value === "left" ? "left" : "right";
    saveGameSettings();
    syncSettingsControls();
  };

  const onVibration = (value) => {
    mobileSettings.vibration = Boolean(value);
    saveGameSettings();
    syncSettingsControls();
  };

  if (joystickSenseEl) joystickSenseEl.addEventListener("input", (e) => onJoystickSense(e.target.value));
  if (handednessSelectEl) handednessSelectEl.addEventListener("change", (e) => onHandedness(e.target.value));
  if (vibrationToggleEl) vibrationToggleEl.addEventListener("change", (e) => onVibration(e.target.checked));

  const onRules = (value) => {
    if (rulesSelectEl) rulesSelectEl.value = value;
    if (!state.running) resetState();
  };

  const onDifficulty = (value) => {
    if (difficultySelectEl) difficultySelectEl.value = value;
    if (!state.running) resetState();
  };

  if (rulesSelectEl) rulesSelectEl.addEventListener("change", (e) => onRules(e.target.value));
  if (difficultySelectEl) difficultySelectEl.addEventListener("change", (e) => onDifficulty(e.target.value));
}

async function playCountdown() {
  countdownActive = true;
  startBtn.disabled = true;

  const ticks = ["3", "2", "1", "GO"];
  for (const tick of ticks) {
    countdownEl.textContent = tick;
    await wait(350);
  }

  countdownActive = false;
  startBtn.disabled = false;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function updateHud() {
  const p1 = state.players[0];
  const p2 = state.players[1];

  scoreEl.textContent = String(p1 ? p1.score : 0);
  coinsEl.textContent = String(profile.coins);
  p2ScoreEl.textContent = String(p2 ? p2.score : 0);
  bestEl.textContent = String(bestScore);

  if (comboTextEl) {
    const combo = p1 && p1.combo ? p1.combo : { multiplier: 1, foodChain: 0, killChain: 0 };
    comboTextEl.textContent = `x${combo.multiplier.toFixed(2)} F${combo.foodChain} K${combo.killChain}`;
  }

  updateMissionText();
}

function updateLeaderboard() {
  const entries = [];
  for (const player of state.players) {
    entries.push({ name: player.name, value: player.segments.length, isPlayer: true });
  }
  for (const bot of state.bots) {
    entries.push({ name: bot.name, value: bot.segments.length, isPlayer: false });
  }

  entries.sort((a, b) => b.value - a.value);
  leaderboardEl.innerHTML = "";

  for (const entry of entries.slice(0, 7)) {
    const item = document.createElement("li");
    if (entry.isPlayer) item.classList.add("you");
    item.textContent = `${entry.name}: ${entry.value}`;
    leaderboardEl.appendChild(item);
  }
}

function clearSummary() {
  summaryEl.innerHTML = "";
}

function renderSummary(lines) {
  clearSummary();
  for (const line of lines) {
    const item = document.createElement("li");
    item.textContent = line;
    summaryEl.appendChild(item);
  }
}

function showOverlay(message, buttonLabel) {
  overlayText.textContent = message;
  startBtn.textContent = buttonLabel;
  countdownEl.textContent = "";
  overlay.classList.remove("hidden");

  if (settingsPanelEl && buttonLabel === "Start Run") {
    settingsPanelEl.classList.remove("collapsed");
  }
}

function awardKillCoins(killer, victim) {
  if (!killer || killer.type !== "player") return 0;

  const reward = victim.type === "player" ? 70 : 25;
  profile.coins += reward;
  state.coinsEarned += reward;
  saveProfile();
  updateHud();
  updateProgressText();

  return reward;
}

function dropFoodFromSnake(victim) {
  const drops = [];

  for (let i = 2; i < victim.segments.length; i += 2) {
    if (gameFoodCount() >= MAX_FOOD) break;

    const seg = victim.segments[i];
    const forceBig = i % 8 === 0;
    drops.push(makeFoodAt(seg, forceBig));
  }

  state.food.push(...drops);
}

function gameFoodCount() {
  return state.food.length;
}

function handleSnakeDeath(victim, killer) {
  const reward = awardKillCoins(killer, victim);
  dropFoodFromSnake(victim);

  if (killer && killer.type === "player") {
    registerKillCombo(killer);
  }

  if (victim && victim.segments && victim.segments.length) {
    const head = victim.segments[0];
    spawnParticles(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, 24, "rgba(255,110,110,0.95)", 55, 210, 0.28, 0.6, 2.8);
    triggerScreenShake(9, 0.16);
    triggerHitFlash(0.48);
  }

  if (reward > 0) {
    showProgressMessage(`+${reward} coins for the kill.`);
  }
}

function handlePlayerDeath(deadPlayer, killer) {
  deadPlayer.alive = false;
  deadPlayer.boostHeld = false;
  handleSnakeDeath(deadPlayer, killer);

  if (state.settings.mode === "solo") {
    finishRun(`You got ${state.players[0].score} points. Run it back?`);
    return;
  }

  const alivePlayers = state.players.filter((p) => p.alive);
  if (alivePlayers.length <= 1) {
    const winner = alivePlayers[0];
    if (winner) {
      finishRun(`${winner.name} wins with ${winner.score} points. Run it back?`);
    } else {
      finishRun("Both crashed. Draw. Run it back?");
    }
  }
}

function checkForUnlocks() {
  const newlyUnlocked = [];

  for (const skin of SKINS) {
    if (profile.totalPoints >= skin.unlockPoints && !profile.unlockedSkinIds.includes(skin.id)) {
      profile.unlockedSkinIds.push(skin.id);
      newlyUnlocked.push(skin.name);
    }
  }

  if (newlyUnlocked.length) {
    populateSkinOptions();
  }

  saveProfile();
  updateProgressText();
  return newlyUnlocked;
}

function finishRun(message) {
  state.running = false;
  state.gameOver = true;
  state.endedAt = performance.now();

  const p1Score = state.players[0] ? state.players[0].score : 0;
  profile.totalPoints += p1Score;

  const unlockedNow = checkForUnlocks();

  if (p1Score > bestScore) {
    bestScore = p1Score;
    localStorage.setItem(BEST_KEY, String(bestScore));
  }

  saveProfile();
  updateHud();
  showOverlay(message, "Restart");

  const summary = buildMatchSummary();
  if (unlockedNow.length) {
    for (const skinName of unlockedNow) {
      summary.push(`Unlocked skin: ${skinName}`);
    }
  }
  renderSummary(summary);
}

function buildMatchSummary() {
  const elapsedMs = Math.max(0, state.endedAt - state.startedAt);
  const seconds = Math.round(elapsedMs / 1000);
  const lines = [
    `Duration: ${seconds}s`,
    `Arena: ${state.settings.arenaSize}`,
    `Bots: ${state.bots.length}`,
    `Total points progression: ${profile.totalPoints}`,
    `Coins this match: +${state.coinsEarned}`,
  ];

  for (const player of state.players) {
    lines.push(`${player.name} points: ${player.score}`);
    lines.push(`${player.name} max length: ${player.maxLength}`);
  }

  return lines;
}

function step(dtSec) {
  if (!state.running) return;

  state.matchStats.survival += dtSec;
  while (state.matchStats.survival >= 1) {
    state.matchStats.survival -= 1;
    progressMission("survival", 1);
  }

  if (state.settings.ruleset === "sudden") {
    state.suddenDeath.timer += dtSec;
    if (state.suddenDeath.timer >= state.suddenDeath.nextShrinkAt) {
      state.suddenDeath.marginCells += SUDDEN_SHRINK_CELLS;
      state.suddenDeath.nextShrinkAt += SUDDEN_SHRINK_INTERVAL;
      showProgressMessage("Sudden death zone is shrinking!");
      vibratePulse(20);
    }
  }

  decayCombos();
  updateEffects(dtSec);

  state.powerupPopups = state.powerupPopups.filter((popup) => {
    popup.ttl -= dtSec;
    popup.rise += dtSec * 28;
    return popup.ttl > 0;
  });

  state.bigFoodTimer -= dtSec;
  if (state.bigFoodTimer <= 0 && gameFoodCount() < MAX_FOOD) {
    state.food.push(...spawnFood(1, collectAllSegments([...state.players, ...state.bots]), true));
    state.bigFoodTimer = 5 + Math.random() * 7;
  }

  state.powerupTimer -= dtSec;
  if (state.powerupTimer <= 0 && state.powerups.length < MAX_POWERUPS) {
    const newPowerup = spawnPowerup(collectAllSegments([...state.players, ...state.bots]));
    if (newPowerup) {
      state.powerups.push(newPowerup);
    }
    state.powerupTimer = POWERUP_SPAWN_INTERVAL + (Math.random() * 6 - 3);
  }

  const snakes = [...state.players, ...state.bots];

  for (const snake of snakes) {
    if (!snake.alive) continue;

    snake.mouthOpen = (Math.sin(Date.now() / 200) + 1) / 2;

    snake.activePowerups = snake.activePowerups.filter((p) => {
      p.timer -= dtSec;
      return p.timer > 0;
    });

    const hasMagnet = snake.activePowerups.some((p) => p.type === "magnet");
    if (hasMagnet) {
      const head = snake.segments[0];
      for (let i = 0; i < Math.min(3, state.food.length); i += 1) {
        const food = state.food[i];
        if (Math.abs(food.x - head.x) < 12 && Math.abs(food.y - head.y) < 12) {
          if (food.x < head.x) food.x += 0.5;
          if (food.x > head.x) food.x -= 0.5;
          if (food.y < head.y) food.y += 0.5;
          if (food.y > head.y) food.y -= 0.5;
        }
      }
    }

    if (snake.type === "bot") runBotLogic(snake);

    const hasSpeedBoost = snake.activePowerups.some((p) => p.type === "speed");
    const isFrozen = snake.activePowerups.some((p) => p.type === "frozen");

    if (isFrozen) continue;

    const canBoost = snake.type === "player" && snake.boostHeld && snake.segments.length > 10;
    const baseSpeed = snake.type === "bot" ? snake.speedCellsPerSec : BASE_SPEED;
    let speedMul = canBoost ? BOOST_MULTIPLIER : 1;
    if (hasSpeedBoost) speedMul *= 1.7;

    snake.speedCellsPerSec = baseSpeed * speedMul;
    snake.boostTimer += dtSec * snake.speedCellsPerSec;

    if ((canBoost || hasSpeedBoost) && snake.boostTimer >= 0.35) {
      addSpeedTrail(snake);
    }

    while (snake.boostTimer >= 1) {
      snake.boostTimer -= 1;
      const result = advanceSnakeOneCell(snake);
      if (!result.alive && snake.type === "player") {
        handlePlayerDeath(snake, result.killer);
        if (!state.running) return;
      }
    }

    if (canBoost) {
      state.matchStats.boost += dtSec;
      while (state.matchStats.boost >= 1) {
        state.matchStats.boost -= 1;
        progressMission("boost", 1);
      }

      snake.boostShedTimer += dtSec;

      while (snake.boostShedTimer >= BOOST_SHED_INTERVAL) {
        snake.boostShedTimer -= BOOST_SHED_INTERVAL;

        if (snake.segments.length > 10) {
          const tail = snake.segments.pop();
          if (tail && gameFoodCount() < MAX_FOOD && Math.random() < 0.8) {
            state.food.push(makeFoodAt({ x: tail.x, y: tail.y }, Math.random() < 0.06));
          }
        }
      }
    } else {
      snake.boostShedTimer = 0;
    }
  }

  syncCamera();
  updateHud();
  updateLeaderboard();
}

function runBotLogic(bot) {
  const head = bot.segments[0];
  const personality = bot.personality || "scavenger";

  const hasHypnotic = state.players.some((p) => p.alive && p.activePowerups.some((pw) => pw.type === "hypnotic"));
  if (hasHypnotic) {
    const hypnoPlayer = state.players.find((p) => p.alive && p.activePowerups.some((pw) => pw.type === "hypnotic"));
    if (hypnoPlayer) {
      const dx = hypnoPlayer.segments[0].x - head.x;
      const dy = hypnoPlayer.segments[0].y - head.y;

      let preferred;
      if (Math.abs(dx) > Math.abs(dy)) {
        preferred = dx > 0 ? DIR.right : DIR.left;
      } else {
        preferred = dy > 0 ? DIR.down : DIR.up;
      }

      const options = [preferred, DIR.up, DIR.down, DIR.left, DIR.right];
      for (const option of options) {
        if (option.x + bot.dir.x === 0 && option.y + bot.dir.y === 0) continue;
        if (willCollide(bot, option)) continue;
        bot.dir = option;
        break;
      }
      return;
    }
  }

  const target = selectBotTarget(bot, personality);

  const candidateDirs = [DIR.up, DIR.down, DIR.left, DIR.right].filter(
    (d) => !(d.x + bot.dir.x === 0 && d.y + bot.dir.y === 0)
  );

  let bestDir = bot.dir;
  let bestScore = -Infinity;

  for (const dir of candidateDirs) {
    const score = evaluateBotDirection(bot, dir, target, personality);
    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  bot.dir = bestDir;
}

function nearestFood(head, personality = "normal") {
  let nearest = null;
  let best = Infinity;

  for (const pellet of state.food) {
    const dist = Math.abs(pellet.x - head.x) + Math.abs(pellet.y - head.y);
    let weighted = dist / (pellet.type === "big" ? 1.6 : 1);

    if (personality === "scavenger") {
      weighted = dist / (pellet.type === "big" ? 2.15 : 1.08);
    } else if (personality === "survivor") {
      weighted = dist / (pellet.type === "small" ? 1.18 : 0.88);
    } else if (personality === "trickster") {
      weighted *= 0.85 + Math.random() * 0.4;
    }

    if (weighted < best) {
      best = weighted;
      nearest = pellet;
    }
  }

  return nearest;
}

function selectBotTarget(bot, personality) {
  const head = bot.segments[0];
  const alivePlayers = state.players.filter((p) => p.alive);

  if (personality === "aggressive" && alivePlayers.length) {
    let nearestPlayer = alivePlayers[0];
    let nearestDist = Infinity;
    for (const player of alivePlayers) {
      const dist = Math.abs(player.segments[0].x - head.x) + Math.abs(player.segments[0].y - head.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestPlayer = player;
      }
    }

    if (nearestDist < 48) {
      return { x: nearestPlayer.segments[0].x, y: nearestPlayer.segments[0].y, kind: "player" };
    }
  }

  const food = nearestFood(head, personality);
  if (!food) return null;
  return { x: food.x, y: food.y, kind: "food", type: food.type };
}

function evaluateBotDirection(bot, dir, target, personality) {
  if (willCollide(bot, dir)) return -999999;

  const head = bot.segments[0];
  const nextX = head.x + dir.x;
  const nextY = head.y + dir.y;

  let score = 0;

  if (target) {
    const d = Math.abs(target.x - nextX) + Math.abs(target.y - nextY);
    score -= d;

    if (personality === "aggressive" && target.kind === "player") score += 22;
    if (personality === "scavenger" && target.kind === "food" && target.type === "big") score += 10;
  }

  const maxX = WORLD.width / CELL - 1;
  const maxY = WORLD.height / CELL - 1;
  const wallClearance = Math.min(nextX, nextY, maxX - nextX, maxY - nextY);

  if (personality === "survivor") {
    score += wallClearance * 1.8;
  } else if (personality === "trickster") {
    score += Math.random() * 4;
    score += wallClearance * 0.45;
  } else {
    score += wallClearance * 0.7;
  }

  for (const player of state.players) {
    if (!player.alive) continue;
    const pd = Math.abs(player.segments[0].x - nextX) + Math.abs(player.segments[0].y - nextY);
    if (personality === "survivor") {
      score += Math.min(pd, 22) * 0.55;
    } else if (personality === "aggressive") {
      score -= Math.min(pd, 22) * 0.2;
    }
  }

  return score;
}

function willCollide(snake, dir) {
  const head = snake.segments[0];
  const next = { x: head.x + dir.x, y: head.y + dir.y };

  if (isOutsideActiveBounds(next)) return true;

  for (const other of [...state.players, ...state.bots]) {
    if (!other.alive) continue;
    for (let i = 0; i < other.segments.length; i += 1) {
      if (other === snake && i === other.segments.length - 1) continue;
      const seg = other.segments[i];
      if (seg.x === next.x && seg.y === next.y) return true;
    }
  }

  return false;
}

function findCollisionTarget(next, movingSnake) {
  for (const other of [...state.players, ...state.bots]) {
    if (!other.alive) continue;
    for (let i = 0; i < other.segments.length; i += 1) {
      if (other === movingSnake && i === other.segments.length - 1) continue;
      const part = other.segments[i];
      if (part.x === next.x && part.y === next.y) {
        return other;
      }
    }
  }

  return null;
}

function advanceSnakeOneCell(snake) {
  if (!snake.alive) return { alive: false, killer: null };

  if (snake.queue.length) snake.dir = snake.queue.shift();

  const head = snake.segments[0];
  const next = { x: head.x + snake.dir.x, y: head.y + snake.dir.y };

  if (isOutsideActiveBounds(next)) {
    if (snake.type === "bot") {
      handleSnakeDeath(snake, null);
      respawnBot(snake);
      return { alive: true, killer: null };
    }

    return { alive: false, killer: null };
  }

  const target = findCollisionTarget(next, snake);
  if (target) {
    const hasImmunity = snake.activePowerups.some((p) => p.type === "immunity");
    const hasOneShot = snake.activePowerups.some((p) => p.type === "oneshot");

    if (hasImmunity) {
      showProgressMessage(`${snake.name} is immune! 🛡️`);
      return { alive: true, killer: null };
    }

    if (hasOneShot) {
      handleSnakeDeath(target, snake);
      if (target.type === "bot") {
        respawnBot(target);
      }
      showProgressMessage(`${snake.name} one-shot ${target.name}! 💥`);
      return { alive: true, killer: null };
    }

    if (snake.type === "bot") {
      handleSnakeDeath(snake, target);
      respawnBot(snake);
      return { alive: true, killer: target };
    }

    return { alive: false, killer: target };
  }

  snake.segments.unshift(next);
  snake.maxLength = Math.max(snake.maxLength, snake.segments.length);

  let ate = false;

  for (let i = 0; i < state.powerups.length; i += 1) {
    const powerup = state.powerups[i];
    if (powerup.x === next.x && powerup.y === next.y) {
      state.powerups.splice(i, 1);
      activatePowerup(snake, powerup.type);
      spawnParticles(next.x * CELL + CELL / 2, next.y * CELL + CELL / 2, 14, "rgba(255,225,120,0.95)", 35, 130, 0.2, 0.35, 2.4);
      triggerScreenShake(4, 0.08);
      ate = false;
      break;
    }
  }

  if (!ate) {
    for (let i = 0; i < state.food.length; i += 1) {
      const food = state.food[i];
      if (Math.abs(food.x - next.x) < 0.35 && Math.abs(food.y - next.y) < 0.35) {
        ate = true;
        state.food.splice(i, 1);
        if (gameFoodCount() < MAX_FOOD) {
          state.food.push(...spawnFood(1, collectAllSegments([...state.players, ...state.bots])));
        }
        snake.growth += food.growth;
        snake.score += food.value;
        registerFoodCombo(snake, food.value);
        progressMission("food", 1);
        if (food.type === "big") progressMission("bigFood", 1);
        const sparkle = food.type === "big" ? "rgba(255,188,120,0.95)" : "rgba(255,232,160,0.9)";
        spawnParticles(next.x * CELL + CELL / 2, next.y * CELL + CELL / 2, food.type === "big" ? 13 : 8, sparkle, 25, 110, 0.18, 0.35, 2.1);
        if (food.type === "big") {
          triggerScreenShake(3.4, 0.06);
        }
        break;
      }
    }
  }

  if (!ate) {
    if (snake.growth > 0) {
      snake.growth -= 1;
    } else {
      snake.segments.pop();
    }
  }

  return { alive: true, killer: null };
}

function respawnBot(bot) {
  const fresh = createSnake({
    id: bot.id,
    name: bot.name,
    colorHead: bot.colorHead,
    colorBody: bot.colorBody,
    hat: "none",
    necklace: "none",
    start: randomStart(),
    dir: Object.values(DIR)[Math.floor(Math.random() * 4)],
    speed: BOT_SPEED_MIN + Math.random() * (BOT_SPEED_MAX - BOT_SPEED_MIN),
    length: 10 + Math.floor(Math.random() * 6),
    type: "bot",
  });

  bot.segments = fresh.segments;
  bot.dir = fresh.dir;
  bot.queue = [];
  bot.growth = 0;
  bot.boostTimer = 0;
  bot.score = 0;
  bot.maxLength = bot.segments.length;
  bot.alive = true;
  bot.activePowerups = [];
  bot.mouthOpen = 0;
}

function syncCamera() {
  const alivePlayers = state.players.filter((p) => p.alive);
  if (!alivePlayers.length) return;

  let cx = 0;
  let cy = 0;
  for (const p of alivePlayers) {
    cx += p.segments[0].x * CELL;
    cy += p.segments[0].y * CELL;
  }

  const targetX = cx / alivePlayers.length;
  const targetY = cy / alivePlayers.length;

  state.camera.x += (targetX - state.camera.x) * CAMERA_LERP;
  state.camera.y += (targetY - state.camera.y) * CAMERA_LERP;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();

  canvas.width = Math.floor(bounds.width * ratio);
  canvas.height = Math.floor(bounds.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const shakeX = state.screenFx ? state.screenFx.shakeX : 0;
  const shakeY = state.screenFx ? state.screenFx.shakeY : 0;
  const camX = state.camera.x - w / 2 + shakeX;
  const camY = state.camera.y - h / 2 + shakeY;

  ctx.clearRect(0, 0, w, h);

  drawGrid(camX, camY, w, h);
  drawFood(camX, camY, w, h);
  drawPowerups(camX, camY, w, h);

  for (const bot of state.bots) {
    if (bot.alive) drawSnake(bot, camX, camY, false);
  }

  for (const player of state.players) {
    if (player.alive) drawSnake(player, camX, camY, true);
  }

  drawParticles(camX, camY, w, h);

  drawPowerupPopups(camX, camY);

  drawBounds(camX, camY, w, h);
  drawMinimap();
  drawScreenFx(w, h);
}

function drawParticles(camX, camY, w, h) {
  if (!state.particles || !state.particles.length) return;

  for (const p of state.particles) {
    const px = p.x - camX;
    const py = p.y - camY;
    if (px < -8 || py < -8 || px > w + 8 || py > h + 8) continue;

    const alpha = Math.max(0, p.ttl / p.maxTtl);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawScreenFx(w, h) {
  if (!state.screenFx) return;
  const flash = state.screenFx.hitFlash;
  if (flash <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = Math.min(0.5, flash);
  ctx.fillStyle = "#ffe6c2";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawGrid(camX, camY, w, h) {
  ctx.strokeStyle = "rgba(133, 255, 159, 0.08)";
  ctx.lineWidth = 1;

  const startX = -((camX % CELL) + CELL);
  const startY = -((camY % CELL) + CELL);

  for (let x = startX; x < w + CELL; x += CELL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = startY; y < h + CELL; y += CELL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawBounds(camX, camY, w, h) {
  const x = -camX;
  const y = -camY;

  ctx.strokeStyle = "rgba(255, 209, 102, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, WORLD.width, WORLD.height);

  if (x > 0 || y > 0 || x + WORLD.width < w || y + WORLD.height < h) {
    ctx.fillStyle = "rgba(5, 12, 8, 0.7)";

    if (x > 0) ctx.fillRect(0, 0, x, h);
    if (y > 0) ctx.fillRect(0, 0, w, y);
    if (x + WORLD.width < w) ctx.fillRect(x + WORLD.width, 0, w - (x + WORLD.width), h);
    if (y + WORLD.height < h) ctx.fillRect(0, y + WORLD.height, w, h - (y + WORLD.height));
  }

  if (state.settings.ruleset === "sudden" && state.suddenDeath.marginCells > 0) {
    const b = getActiveBoundsCells();
    const sx = b.minX * CELL - camX;
    const sy = b.minY * CELL - camY;
    const sw = (b.maxX - b.minX + 1) * CELL;
    const sh = (b.maxY - b.minY + 1) * CELL;
    ctx.strokeStyle = "rgba(255, 92, 92, 0.75)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.setLineDash([]);
  }
}

function drawFood(camX, camY, w, h) {
  for (const pellet of state.food) {
    const x = pellet.x * CELL - camX;
    const y = pellet.y * CELL - camY;
    if (x < -CELL || y < -CELL || x > w + CELL || y > h + CELL) continue;

    const r = CELL * pellet.radius;
    const gradient = ctx.createRadialGradient(x + CELL / 2, y + CELL / 2, 1, x + CELL / 2, y + CELL / 2, r * 2.4);

    if (pellet.type === "big") {
      gradient.addColorStop(0, "#fff6cc");
      gradient.addColorStop(1, "#ff7f66");
    } else {
      gradient.addColorStop(0, "#fff7bf");
      gradient.addColorStop(1, "#f29e4c");
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + CELL / 2, y + CELL / 2, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPowerups(camX, camY, w, h) {
  const pulse = (Math.sin(Date.now() / 300) + 1) / 2;

  for (const powerup of state.powerups) {
    const x = powerup.x * CELL - camX + CELL / 2;
    const y = powerup.y * CELL - camY + CELL / 2;
    if (x < -CELL || y < -CELL || x > w + CELL || y > h + CELL) continue;

    const baseRadius = CELL * 0.35;
    const pulseRadius = baseRadius + pulse * CELL * 0.15;

    const gradient = ctx.createRadialGradient(x, y, 1, x, y, pulseRadius * 2);
    gradient.addColorStop(0, powerup.color + "88");
    gradient.addColorStop(1, powerup.color + "00");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, pulseRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = powerup.color;
    ctx.beginPath();
    ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    drawPowerupSymbol(powerup.type, x, y, CELL * 0.25);
  }
}

function drawPowerupPopups(camX, camY) {
  for (const popup of state.powerupPopups) {
    const px = popup.x * CELL - camX + CELL / 2;
    const py = popup.y * CELL - camY - CELL * 0.9 - popup.rise;
    const alpha = Math.max(0, popup.ttl / popup.duration);

    ctx.save();
    ctx.globalAlpha = alpha;

    const text = `+ ${popup.text}`;
    ctx.font = "bold 12px Segoe UI";
    const textWidth = ctx.measureText(text).width;
    const boxW = textWidth + 24;
    const boxH = 20;
    const boxX = px - boxW / 2;
    const boxY = py - boxH / 2;

    ctx.fillStyle = "rgba(10, 22, 14, 0.85)";
    roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();

    drawPowerupSymbol(popup.type, boxX + 10, py, 5.5);

    ctx.fillStyle = popup.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, boxX + 18, py);

    ctx.restore();
  }
}

function drawPowerupSymbol(type, x, y, size) {
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (type === "shield") {
    ctx.strokeStyle = "#FFD700";
    ctx.beginPath();
    ctx.moveTo(x - size * 0.6, y - size * 0.3);
    ctx.lineTo(x + size * 0.6, y - size * 0.3);
    ctx.quadraticCurveTo(x + size * 0.7, y, x, y + size * 0.7);
    ctx.quadraticCurveTo(x - size * 0.7, y, x - size * 0.6, y - size * 0.3);
    ctx.stroke();
    ctx.fillStyle = "#FFD70055";
    ctx.fill();
  } else if (type === "teleport") {
    ctx.strokeStyle = "#FF69B4";
    for (let i = 0; i < 3; i += 1) {
      const r = size * (0.2 + i * 0.2);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#FF69B4";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "oneshot") {
    ctx.fillStyle = "#FF4444";
    const points = 5;
    for (let i = 0; i < points; i += 1) {
      const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(angle) * size * 0.6;
      const py = y + Math.sin(angle) * size * 0.6;
      if (i === 0) ctx.beginPath(), ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (type === "speed") {
    ctx.strokeStyle = "#00FF00";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x - size * 0.5, y + (i - 1) * size * 0.4);
      ctx.lineTo(x + size * 0.5, y + (i - 1) * size * 0.4);
      ctx.stroke();
    }
  } else if (type === "magnet") {
    ctx.fillStyle = "#FF8C00";
    ctx.fillRect(x - size * 0.5, y - size * 0.3, size * 0.4, size * 0.6);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - size * 0.5 + size * 0.05, y - size * 0.2, size * 0.1, size * 0.2);
    ctx.fillStyle = "#FF8C00";
    ctx.fillRect(x + size * 0.1, y - size * 0.3, size * 0.4, size * 0.6);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x + size * 0.1 + size * 0.05, y - size * 0.2, size * 0.1, size * 0.2);
  } else if (type === "freeze") {
    ctx.strokeStyle = "#00BFFF";
    ctx.fillStyle = "#00BFFF44";
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.6);
    ctx.lineTo(x - size * 0.3, y + size * 0.3);
    ctx.lineTo(x + size * 0.3, y + size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x, y - size * 0.4 + i * size * 0.3);
      ctx.lineTo(x - size * 0.15, y - size * 0.5 + i * size * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - size * 0.4 + i * size * 0.3);
      ctx.lineTo(x + size * 0.15, y - size * 0.5 + i * size * 0.3);
      ctx.stroke();
    }
  } else if (type === "growth") {
    ctx.strokeStyle = "#FFB6C1";
    ctx.fillStyle = "#FFB6C144";
    for (let i = 0; i < 3; i += 1) {
      const r = size * (0.15 + i * 0.2);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (type === "hypnotic") {
    ctx.strokeStyle = "#9370DB";
    for (let i = 0; i < 4; i += 1) {
      const r = size * (0.1 + i * 0.15);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#9370DB";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "ghost") {
    ctx.fillStyle = "#D3D3D3";
    ctx.beginPath();
    ctx.arc(x, y - size * 0.1, size * 0.4, 0, Math.PI);
    ctx.lineTo(x + size * 0.4, y + size * 0.35);
    ctx.lineTo(x + size * 0.25, y + size * 0.15);
    ctx.lineTo(x + size * 0.1, y + size * 0.35);
    ctx.lineTo(x - size * 0.1, y + size * 0.15);
    ctx.lineTo(x - size * 0.25, y + size * 0.35);
    ctx.lineTo(x - size * 0.4, y + size * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.fillRect(x - size * 0.2, y - size * 0.05, size * 0.15, size * 0.15);
    ctx.fillRect(x + size * 0.05, y - size * 0.05, size * 0.15, size * 0.15);
  }
}

function drawRoundSegment(cx, cy, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnake(snake, camX, camY, isPlayer) {
  const segments = snake.segments;

  for (let i = segments.length - 1; i >= 0; i -= 1) {
    const seg = segments[i];
    const cx = seg.x * CELL - camX + CELL / 2;
    const cy = seg.y * CELL - camY + CELL / 2;

    const t = i / Math.max(segments.length - 1, 1);
    const g = Math.floor(snake.colorBody[1] - t * 85);
    const b = Math.floor(snake.colorBody[2] - t * 58);
    const r = Math.floor(snake.colorBody[0] + t * 18);
    const radius = CELL * (0.44 - Math.min(t * 0.18, 0.17));

    drawRoundSegment(cx, cy, radius, `rgb(${r}, ${Math.max(g, 80)}, ${Math.max(b, 70)})`);
  }

  const head = segments[0];
  const hx = head.x * CELL - camX + CELL / 2;
  const hy = head.y * CELL - camY + CELL / 2;

  const hasImmunity = snake.activePowerups.some((p) => p.type === "immunity");
  const hasGhost = snake.activePowerups.some((p) => p.type === "ghost");

  if (hasGhost) {
    ctx.globalAlpha = 0.5;
  }

  drawPacmanHead(hx, hy, snake, isPlayer);

  if (hasGhost) {
    ctx.globalAlpha = 1;
  }

  if (hasImmunity) {
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hx, hy, CELL * 0.55, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawSnakeProps(snake, camX, camY, hx, hy);
}

function drawPacmanHead(hx, hy, snake, isPlayer) {
  const dir = snake.dir;
  const radius = CELL * 0.46;
  const mouthAngle = 0.16 + snake.mouthOpen * 0.42;
  const facing = Math.atan2(dir.y, dir.x);

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(facing);

  ctx.fillStyle = isPlayer ? snake.colorHead : "rgba(245,255,250,0.9)";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, mouthAngle, Math.PI * 2 - mouthAngle, false);
  ctx.closePath();
  ctx.fill();

  const eyeX = radius * 0.08;
  const eyeY = -radius * 0.45;
  const eyeR = CELL * 0.065;

  ctx.fillStyle = "#0d1117";
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(eyeX + eyeR * 0.35, eyeY - eyeR * 0.35, eyeR * 0.42, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSnakeFace(snake, hx, hy) {
}

function drawSnakeProps(snake, camX, camY, hx, hy) {
  const dir = snake.dir;

  if (snake.hat && snake.hat !== "none") {
    const hatX = hx - dir.x * CELL * 0.16;
    const hatY = hy - dir.y * CELL * 0.16;
    drawHat(snake.hat, dir, hatX, hatY);
  }

  if (snake.necklace && snake.necklace !== "none" && snake.segments.length > 1) {
    const neckSeg = snake.segments[1];
    const nx = neckSeg.x * CELL - camX + CELL / 2;
    const ny = neckSeg.y * CELL - camY + CELL / 2;
    drawNecklace(snake.necklace, nx, ny, dir);
  }
}

function drawHat(hatId, dir, hx, hy) {
  const angle = Math.atan2(dir.y, dir.x);

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(angle);

  if (hatId === "cap") {
    ctx.fillStyle = "#f45a64";
    roundRect(-8, -13, 16, 8, 4);
    ctx.fill();
    ctx.fillStyle = "#ffd5d9";
    roundRect(-10, -7, 20, 3.5, 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (hatId === "party") {
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ff6f91";
    ctx.beginPath();
    ctx.arc(0, -17, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (hatId === "crown") {
    ctx.fillStyle = "#ffcf4d";
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-7, -14);
    ctx.lineTo(-2, -8);
    ctx.lineTo(2, -15);
    ctx.lineTo(7, -8);
    ctx.lineTo(10, -5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }

  if (hatId === "halo") {
    ctx.strokeStyle = "#ffe899";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -13, 9, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNecklace(type, x, y, dir) {
  const angle = Math.atan2(dir.y, dir.x);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (type === "chain") {
    ctx.strokeStyle = "#f3d99c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, CELL * 0.26, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (type === "pearl") {
    ctx.fillStyle = "#f9f0ff";
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.arc(i * 3.1, 2.8, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  if (type === "bowtie") {
    ctx.fillStyle = "#ff6f91";
    ctx.beginPath();
    ctx.moveTo(-6, 1);
    ctx.lineTo(-1, 4);
    ctx.lineTo(-1, -2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(6, 1);
    ctx.lineTo(1, 4);
    ctx.lineTo(1, -2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 1, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (type === "spikes") {
    ctx.strokeStyle = "#d5d5d5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, CELL * 0.28, Math.PI * 0.18, Math.PI * 0.82);
    ctx.stroke();
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * 2.8, -2);
      ctx.lineTo(i * 2.8, -5.6);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawMinimap() {
  const w = minimap.width;
  const h = minimap.height;
  const sx = w / WORLD.width;
  const sy = h / WORLD.height;

  minimapCtx.clearRect(0, 0, w, h);
  minimapCtx.fillStyle = "rgba(8, 18, 11, 0.95)";
  minimapCtx.fillRect(0, 0, w, h);

  minimapCtx.fillStyle = "rgba(255, 209, 102, 0.4)";
  for (let i = 0; i < state.food.length; i += 3) {
    const pellet = state.food[i];
    const size = pellet.type === "big" ? 3.2 : 2;
    minimapCtx.fillRect(pellet.x * CELL * sx, pellet.y * CELL * sy, size, size);
  }

  for (const powerup of state.powerups) {
    minimapCtx.fillStyle = powerup.color;
    minimapCtx.fillRect(powerup.x * CELL * sx - 2, powerup.y * CELL * sy - 2, 4, 4);
  }

  for (const bot of state.bots) {
    if (!bot.alive) continue;
    const head = bot.segments[0];
    minimapCtx.fillStyle = "rgba(133, 211, 255, 0.9)";
    minimapCtx.fillRect(head.x * CELL * sx - 2, head.y * CELL * sy - 2, 4, 4);
  }

  for (const player of state.players) {
    if (!player.alive) continue;
    const head = player.segments[0];
    minimapCtx.fillStyle = player.id === "p1" ? "#7dff93" : "#88d9ff";
    minimapCtx.fillRect(head.x * CELL * sx - 2, head.y * CELL * sy - 2, 5, 5);
  }

  const viewW = canvas.clientWidth * sx;
  const viewH = canvas.clientHeight * sy;
  const viewX = (state.camera.x - canvas.clientWidth / 2) * sx;
  const viewY = (state.camera.y - canvas.clientHeight / 2) * sy;

  minimapCtx.strokeStyle = "rgba(233, 255, 236, 0.8)";
  minimapCtx.lineWidth = 1;
  minimapCtx.strokeRect(viewX, viewY, viewW, viewH);
}

function frame(ts) {
  if (!lastFrame) lastFrame = ts;
  const delta = Math.min(40, ts - lastFrame);
  lastFrame = ts;
  accumulator += delta;

  while (accumulator >= STEP_MS) {
    step(STEP_MS / 1000);
    accumulator -= STEP_MS;
  }

  draw();
  rafId = requestAnimationFrame(frame);
}

function tryBuyOrSelectProp(kind, selectedId) {
  const isHat = kind === "hat";
  const catalog = isHat ? HATS : NECKLACES;
  const ownedList = isHat ? profile.ownedHats : profile.ownedNecklaces;
  const selectedKey = isHat ? "selectedHat" : "selectedNecklace";
  const selectEl = isHat ? hatSelectEl : necklaceSelectEl;

  if (ownedList.includes(selectedId)) {
    profile[selectedKey] = selectedId;
    saveProfile();
    return;
  }

  const prop = getPropById(catalog, selectedId);
  if (profile.coins < prop.price) {
    selectEl.value = profile[selectedKey];
    showProgressMessage(`Not enough coins for ${prop.name}. Need ${prop.price}.`);
    return;
  }

  profile.coins -= prop.price;
  ownedList.push(selectedId);
  profile[selectedKey] = selectedId;
  saveProfile();

  populatePropOptions(hatSelectEl, HATS, profile.ownedHats, profile.selectedHat);
  populatePropOptions(necklaceSelectEl, NECKLACES, profile.ownedNecklaces, profile.selectedNecklace);
  updateHud();
  updateProgressText();
  showProgressMessage(`Bought ${prop.name}.`);
}

function init() {
  populateSkinOptions();
  populatePropOptions(hatSelectEl, HATS, profile.ownedHats, profile.selectedHat);
  populatePropOptions(necklaceSelectEl, NECKLACES, profile.ownedNecklaces, profile.selectedNecklace);

  resetState();
  syncSettingsControls();
  bindKeyboard();
  bindTouchButtons();
  bindVirtualJoystick();
  bindOverlay();
  bindGameSettings();

  if (settingsPanelEl) {
    settingsPanelEl.classList.remove("collapsed");
  }

  const refreshSetup = () => {
    if (!state.running) {
      if (skinSelectEl.value && profile.unlockedSkinIds.includes(skinSelectEl.value)) {
        profile.selectedSkinId = skinSelectEl.value;
      }

      tryBuyOrSelectProp("hat", hatSelectEl.value);
      tryBuyOrSelectProp("necklace", necklaceSelectEl.value);

      saveProfile();
      resetState();
      showOverlay("Open Settings, choose your setup, then hit Start.", "Start Run");
      clearSummary();
    }
  };

  modeSelectEl.addEventListener("change", refreshSetup);
  botSelectEl.addEventListener("change", refreshSetup);
  arenaSelectEl.addEventListener("change", refreshSetup);
  if (rulesSelectEl) rulesSelectEl.addEventListener("change", refreshSetup);
  if (difficultySelectEl) difficultySelectEl.addEventListener("change", refreshSetup);
  skinSelectEl.addEventListener("change", refreshSetup);
  hatSelectEl.addEventListener("change", refreshSetup);
  necklaceSelectEl.addEventListener("change", refreshSetup);

  bestEl.textContent = String(bestScore);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  updateProgressText();
  updateHud();
  showOverlay("Open Settings, choose your setup, then hit Start.", "Start Run");

  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(frame);
}

init();
