import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const WORLD = { width: 2800, height: 2800 };
const CELL = 20;
const BASE_SPEED = 7;
const BOOST_MULTIPLIER = 1.55;
const FOOD_COUNT = 180;
const START_LENGTH = 14;

const DIR = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const game = {
  players: {},
  food: [],
  world: WORLD,
};

function randomCell() {
  return {
    x: Math.floor(Math.random() * (WORLD.width / CELL)),
    y: Math.floor(Math.random() * (WORLD.height / CELL)),
  };
}

function occupiedSet() {
  const blocked = new Set();

  for (const player of Object.values(game.players)) {
    for (const seg of player.segments) {
      blocked.add(`${seg.x},${seg.y}`);
    }
  }

  for (const pellet of game.food) {
    blocked.add(`${pellet.x},${pellet.y}`);
  }

  return blocked;
}

function fillFood() {
  const blocked = occupiedSet();

  while (game.food.length < FOOD_COUNT) {
    const spot = randomCell();
    const key = `${spot.x},${spot.y}`;
    if (!blocked.has(key)) {
      game.food.push(spot);
      blocked.add(key);
    }
  }
}

function createSegments(start, dir, length) {
  const segments = [];
  for (let i = 0; i < length; i += 1) {
    segments.push({ x: start.x - dir.x * i, y: start.y - dir.y * i });
  }
  return segments;
}

function spawnPlayer(id, name) {
  const start = {
    x: 12 + Math.floor(Math.random() * (WORLD.width / CELL - 24)),
    y: 12 + Math.floor(Math.random() * (WORLD.height / CELL - 24)),
  };

  game.players[id] = {
    id,
    name: (name || "Player").slice(0, 16),
    score: 0,
    direction: { ...DIR.right },
    queuedDirection: null,
    boost: false,
    speed: BASE_SPEED,
    timer: 0,
    growth: 0,
    segments: createSegments(start, DIR.right, START_LENGTH),
  };
}

function safeDirection(current, incoming) {
  if (!incoming) return current;
  if (current.x + incoming.x === 0 && current.y + incoming.y === 0) return current;
  return incoming;
}

function moveOne(player) {
  player.direction = safeDirection(player.direction, player.queuedDirection);
  player.queuedDirection = null;

  const head = player.segments[0];
  const next = {
    x: head.x + player.direction.x,
    y: head.y + player.direction.y,
  };

  if (next.x < 0 || next.y < 0 || next.x >= WORLD.width / CELL || next.y >= WORLD.height / CELL) {
    respawn(player);
    return;
  }

  for (const other of Object.values(game.players)) {
    for (let i = 0; i < other.segments.length; i += 1) {
      if (other.id === player.id && i === other.segments.length - 1) continue;
      const seg = other.segments[i];
      if (seg.x === next.x && seg.y === next.y) {
        respawn(player);
        return;
      }
    }
  }

  player.segments.unshift(next);

  let ate = false;
  for (let i = 0; i < game.food.length; i += 1) {
    const pellet = game.food[i];
    if (pellet.x === next.x && pellet.y === next.y) {
      ate = true;
      player.growth += 1.3;
      player.score += 10;
      game.food.splice(i, 1);
      break;
    }
  }

  if (!ate) {
    if (player.growth > 0) {
      player.growth -= 1;
    } else {
      player.segments.pop();
    }
  }
}

function respawn(player) {
  const start = randomCell();
  player.direction = { ...DIR.right };
  player.queuedDirection = null;
  player.boost = false;
  player.speed = BASE_SPEED;
  player.timer = 0;
  player.growth = 0;
  player.score = Math.max(0, player.score - 20);
  player.segments = createSegments(start, DIR.right, START_LENGTH);
}

function tick(dtSec) {
  for (const player of Object.values(game.players)) {
    player.speed = BASE_SPEED * (player.boost && player.segments.length > 10 ? BOOST_MULTIPLIER : 1);
    player.timer += dtSec * player.speed;

    while (player.timer >= 1) {
      player.timer -= 1;
      moveOne(player);
    }
  }

  fillFood();
}

io.on("connection", (socket) => {
  socket.on("join", ({ name }) => {
    spawnPlayer(socket.id, name);
    fillFood();
  });

  socket.on("input", ({ direction }) => {
    const player = game.players[socket.id];
    if (!player || !direction) return;
    player.queuedDirection = direction;
  });

  socket.on("boost", ({ active }) => {
    const player = game.players[socket.id];
    if (!player) return;
    player.boost = Boolean(active);
  });

  socket.on("disconnect", () => {
    delete game.players[socket.id];
  });
});

setInterval(() => {
  tick(1 / 20);
  io.emit("state", {
    world: game.world,
    players: game.players,
    food: game.food,
  });
}, 50);

app.get("/health", (_, res) => {
  res.json({ ok: true, players: Object.keys(game.players).length });
});

const port = Number(process.env.PORT || 3000);
httpServer.listen(port, () => {
  console.log(`Neon Serpent online server listening on ${port}`);
});
