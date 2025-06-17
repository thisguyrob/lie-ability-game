# Lie-Ability Game

A multiplayer party game inspired by Fibbage, where players create lies to fool others while trying to identify the real answer among fabricated ones.

## 📚 Documentation

For in-depth guides covering architecture, game flow, and development setup,
see the [docs](./docs/) directory.

## 🎮 Game Overview

Lie-Ability is a social deduction party game perfect for family gatherings, parties, or online game nights. Players are presented with trivia questions with missing answers, and they must:

1. **Create convincing lies** to fill in the blanks
2. **Identify the real answer** among all the submissions
3. **Score points** for fooling other players and finding the truth

## ✨ Current Features

### 🎯 Core Gameplay
- **Multi-device Experience**: Host screen for shared viewing + personal devices for input
- **Avatar Customization**: Players choose emojis and colors for personalization
- **Real-time Sync**: All players see updates instantly via WebSocket connections
- **Auto-progression**: Game continues even if players don't respond in time
- **Reconnection Support**: Players can rejoin if disconnected without losing progress

### 🎨 Modern UI
- **Svelte Frontend**: Built with modern Svelte framework for smooth interactions
- **Responsive Design**: Works great on phones, tablets, and desktops
- **Visual Feedback**: Animations, emojis, and clear state indicators
- **Category Icons**: Each question category has matching emoji representation

### 🎮 Game Mechanics
- **Dynamic Category Selection**: Random player chooses from 4 categories each round
- **Smart Lie Handling**: Duplicate lies are combined, extra lies added to hide patterns
- **Flexible Player Count**: 2-16 players supported
- **Intelligent Scoring**: Points scale by round (500/1000/1500 for lies, 1000/2000/3000 for truth)

## 🏗️ Architecture

### Backend Components
- **Node.js + Express** - Web server and API endpoints
- **Socket.IO** - Real-time WebSocket communication
- **Game State Machine** - Manages game flow and transitions
- **Timer Service** - Handles countdown timers with proper cleanup
- **Question Service** - Loads and validates question packs
- **Player Management** - Handles joins, leaves, reconnections, and avatar sync

### Frontend Architecture
- **Svelte Components** - Modern reactive UI framework
- **Component-based Design** - Separate components for each game phase
- **Real-time State Management** - Reactive updates via WebSocket events
- **Built Assets** - Optimized bundles served by Express backend

### Game Flow
1. **Lobby** - Players join with custom names and avatars
2. **Category Selection** - Random player chooses from 4 categories with emojis
3. **Question Reading** - Question displayed to all players (10s timer)
4. **Lie Submission** - Players submit fake answers (30s timer)
5. **Option Selection** - Players vote on which answer is real (30s timer)
6. **Truth Reveal** - Scores calculated and revealed with lie attribution
7. **Scoreboard** - Current standings shown between rounds

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd lie-ability-game
```

2. Install dependencies:
```bash
npm install
cd svelte && npm install && cd ..
```

3. Start the game:
```bash
./start.sh
```

This script will:
- Build the Svelte frontend
- Start the backend server
- Open the host interface in your browser
- Show URLs for players to join

### Manual Start (Production)
```bash
# Build frontend
cd svelte && npm run build && cd ..

# Start server
npm start
```

The server automatically detects your local IP address for QR codes and player access.

## 📁 Project Structure

The backend lives in `src/` and the Svelte frontend in `svelte/`. A full folder breakdown is available in [docs/backend-architecture.md](./docs/backend-architecture.md).

## 🎯 Question Packs

Question files live in `question_packs/`. See [docs/question-pack-format.md](./docs/question-pack-format.md) for the full JSON schema and tips on creating your own packs.

## 🎮 Game Rules & Scoring

Scoring details and round timing are documented in [docs/game-overview.md](./docs/game-overview.md) and [docs/voting-scoring.md](./docs/voting-scoring.md).

## 🔧 API Endpoints

The server exposes a small REST API and a set of WebSocket events. See [docs/backend-architecture.md](./docs/backend-architecture.md) for the endpoint list and usage patterns.

## 🧪 Testing & Development

Development tips and the browser-based debug interface are described in [docs/development-guide.md](./docs/development-guide.md).

## 🐳 Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
WORKDIR /app/svelte
RUN npm ci && npm run build
WORKDIR /app
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes (frontend in `svelte/`, backend in `src/`)
4. Test using the debug interface
5. Build frontend with `npm run build` in svelte/
6. Submit a pull request

## 📋 Known Limitations

- No persistent game history (games reset on server restart)
- Single game instance per server (no room system yet)
- Question packs require server restart to reload
- No audio support yet (audio_file field prepared for future)

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🎉 Acknowledgments

Inspired by Fibbage from Jackbox Games. Created for family fun and open-source sharing.

---

**Happy Gaming!** 🎮✨