const canvas = document.getElementById("online-canvas");
const ctx = canvas.getContext("2d");

const serverUrlEl = document.getElementById("server-url");
const playerNameEl = document.getElementById("player-name");
const connectBtn = document.getElementById("connect-btn");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");

const CELL = 20;

let socket = null;
let gameState = null;
let myId = null;
let boostHeld = false;

const DIR = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  canvas.width = Math.floor(bounds.width * ratio);
  canvas.height = Math.floor(bounds.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function connect() {
  if (socket) socket.disconnect();

  const serverUrl = serverUrlEl.value.trim();
  const name = playerNameEl.value.trim() || "Player";

  statusEl.textContent = "Connecting...";

  socket = io(serverUrl, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    myId = socket.id;
    socket.emit("join", { name });
    statusEl.textContent = `Connected as ${name}`;
  });

  socket.on("state", (state) => {
    gameState = state;
    const me = state.players[myId];
    scoreEl.textContent = `Score: ${me ? me.score : 0}`;
  });

  socket.on("disconnect", () => {
    statusEl.textContent = "Disconnected";
  });

  socket.on("connect_error", () => {
    statusEl.textContent = "Connection failed";
  });
}

function sendInput(direction) {
  if (!socket || !socket.connected) return;
  socket.emit("input", { direction });
}

function bindInput() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowup" || key === "w") sendInput(DIR.up);
    if (key === "arrowdown" || key === "s") sendInput(DIR.down);
    if (key === "arrowleft" || key === "a") sendInput(DIR.left);
    if (key === "arrowright" || key === "d") sendInput(DIR.right);

    if (key === " " && !boostHeld) {
      boostHeld = true;
      socket?.emit("boost", { active: true });
      event.preventDefault();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === " " && boostHeld) {
      boostHeld = false;
      socket?.emit("boost", { active: false });
    }
  });
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);

  if (!gameState) {
    requestAnimationFrame(draw);
    return;
  }

  const me = gameState.players[myId];
  if (!me) {
    requestAnimationFrame(draw);
    return;
  }

  const camX = me.segments[0].x * CELL - w / 2;
  const camY = me.segments[0].y * CELL - h / 2;

  drawGrid(camX, camY, w, h);
  drawFood(camX, camY, w, h);
  drawPlayers(camX, camY);
  drawBounds(camX, camY, w, h);

  requestAnimationFrame(draw);
}

function drawGrid(camX, camY, w, h) {
  ctx.strokeStyle = "rgba(133,255,159,0.08)";
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

function drawFood(camX, camY, w, h) {
  for (const pellet of gameState.food) {
    const x = pellet.x * CELL - camX;
    const y = pellet.y * CELL - camY;
    if (x < -CELL || y < -CELL || x > w + CELL || y > h + CELL) continue;

    ctx.fillStyle = "#f8c26e";
    ctx.beginPath();
    ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayers(camX, camY) {
  for (const [id, player] of Object.entries(gameState.players)) {
    for (let i = player.segments.length - 1; i >= 0; i -= 1) {
      const seg = player.segments[i];
      const x = seg.x * CELL - camX;
      const y = seg.y * CELL - camY;
      ctx.fillStyle = id === myId ? "#87ff9f" : "#89c9ff";
      ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
    }
  }
}

function drawBounds(camX, camY, w, h) {
  const x = -camX;
  const y = -camY;

  ctx.strokeStyle = "rgba(255,209,102,0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, gameState.world.width, gameState.world.height);

  if (x > 0 || y > 0 || x + gameState.world.width < w || y + gameState.world.height < h) {
    ctx.fillStyle = "rgba(5,12,8,0.72)";
    if (x > 0) ctx.fillRect(0, 0, x, h);
    if (y > 0) ctx.fillRect(0, 0, w, y);
    if (x + gameState.world.width < w) ctx.fillRect(x + gameState.world.width, 0, w - (x + gameState.world.width), h);
    if (y + gameState.world.height < h) ctx.fillRect(0, y + gameState.world.height, w, h - (y + gameState.world.height));
  }
}

connectBtn.addEventListener("click", connect);
window.addEventListener("resize", resizeCanvas);

bindInput();
resizeCanvas();
requestAnimationFrame(draw);
