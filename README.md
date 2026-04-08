# Neon Serpent Arena

A Snake.io-style browser game built with plain HTML, CSS, and JavaScript.

## Features
- Smooth canvas gameplay with camera-follow arena
- GO countdown before each run starts
- Pre-match setup for mode, bot count, and arena size
- **Pacman-style snake head with animated mouth**
- Rounded "real snake" rendering (not blocky square segments)
- Funny skins with point-based unlock progression
- Props shop: hats and necklaces purchased with coins
- Kill rewards: earn coins when you kill other snakes
- Snake death drops food back onto the map
- Big food occasionally spawns and gives bonus points/growth
- **Powerup system with 9 hilarious effects:**
  - 🛡️ **Shield**: Immunity to damage for 8 seconds
  - 🌀 **Teleport**: Instantly move to a random location
  - 💥 **One-Shot**: Kill any snake you touch for 6 seconds
  - ⚡ **Speedy Boi**: 1.7x speed multiplier for 5 seconds
  - 🧲 **Magnet Mouth**: Pull nearby food toward you for 7 seconds
  - ❄️ **Freeze Ray**: Freeze all bots for 3 seconds
  - 💪 **Size Boom**: Instantly grow by 10 segments
  - 👻 **Ghost Mode**: Pass through snakes (semi-transparent) for 5 seconds
  - 😵 **Hypnotic Gaze**: Make all bots follow you for 4 seconds
- Player boost (hold Space or touch Boost)
- Local multiplayer mode (2 players on one keyboard)
- AI bot snakes that compete for food
- End-of-match summary with duration and player stats
- Live local leaderboard
- Minimap with viewport indicator and powerup markers
- Best score persistence in localStorage
- Dedicated online multiplayer mode (`online.html`) backed by Socket.io server

## Run Locally
1. Open `index.html` in your browser.
2. Click **Start Run**.
3. Controls:
   - P1 Move: `WASD` or Arrow keys
   - P1 Boost: hold `Space`
   - P2 Move (2P mode): `IJKL`
   - P2 Boost (2P mode): hold `Shift`
   - Pause: `P`
4. Use overlay settings before starting:
   - Mode: solo or duo
   - Bots: 2, 4, 6, or 8
   - Arena: small, medium, large

## Powerup System
Powerups randomly spawn around the map every 10-18 seconds. Collect them to activate hilarious effects:

| Powerup | Effect | Duration |
|---------|--------|----------|
| 🛡️ Shield | Can't be killed; immune to collisions | 8s |
| 🌀 Teleport | Instantly move to a random safe location | Instant |
| 💥 One-Shot | Kill any snake you touch (including players!) | 6s |
| ⚡ Speedy Boi | Move 1.7x faster | 5s |
| 🧲 Magnet Mouth | Nearby food is attracted toward you | 7s |
| ❄️ Freeze Ray | All enemy bots freeze in place | 3s |
| 💪 Size Boom | Instantly gain 10 segments | Instant |
| 👻 Ghost Mode | Pass through other snakes invisibly | 5s |
| 😵 Hypnotic Gaze | All bots chase you instead of food | 4s |

**Pro Tips:**
- Use Shield before aggressive plays
- Teleport to escape tight situations
- One-Shot is perfect for eliminating competition
- Magnet works great with high player count for quick growth
- Stack Speed + Magnet for ultimate food vacuuming!

## Deploy To GitHub Pages
1. Push this folder to a GitHub repository.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch), folder `/ (root)`
4. Save and wait for deployment.
5. Your game will be available at:
   - `https://<your-username>.github.io/<your-repo>/`

## Notes
- This project is fully static and does not require a backend, so it is GitHub Pages friendly.
- Local mode and skins progression work fully on GitHub Pages.

## Online Multiplayer Backend Setup
1. Open a terminal in `server`.
2. Install dependencies:
   - `npm install`
3. Start the server:
   - `npm start`
4. Open `online.html` in your browser.
5. Keep `Server URL` as `http://localhost:3000` for local testing.

## Deploying Online Backend
1. Deploy `server` folder to a Node host like Render, Railway, or Fly.io.
2. Set the service start command to `npm start`.
3. Use the deployed URL in `online.html` `Server URL` field.
4. You can still host static files (`index.html`, `online.html`, CSS/JS) on GitHub Pages.
