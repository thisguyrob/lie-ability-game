# Lie-Ability Game

A multiplayer party game inspired by Fibbage, where players create lies to fool others while trying to identify the real answer among fabricated ones.

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

```
lie-ability-game/
├── src/                      # Backend Node.js code
│   ├── models/
│   │   ├── Game.js          # Main game logic and state machine
│   │   └── Player.js        # Player data and avatar management
│   ├── services/
│   │   ├── TimerService.js  # Timer management with cleanup
│   │   └── QuestionService.js # Question pack loading
│   ├── utils/
│   │   └── constants.js     # Game constants and configuration
│   └── server.js            # Express server and Socket.IO setup
├── svelte/                   # Svelte frontend source
│   ├── src/
│   │   ├── Host.svelte      # Main host screen component
│   │   ├── Player.svelte    # Main player screen component
│   │   └── components/      # Reusable UI components
│   │       ├── Lobby.svelte, QuestionView.svelte, etc.
│   │       └── player/      # Player-specific components
│   │           ├── PlayerJoin.svelte
│   │           ├── PlayerCategorySelect.svelte
│   │           ├── PlayerLieSubmit.svelte
│   │           └── PlayerOptionSelect.svelte, etc.
│   └── package.json         # Frontend dependencies
├── public/                   # Built frontend assets (served by Express)
│   ├── host.html            # Host interface entry point
│   ├── player.html          # Player interface entry point
│   └── assets/              # Built JS/CSS bundles
├── question_packs/
│   └── default.json         # Default question set (28 questions)
├── tests/
│   └── debug-interface.html # Backend testing interface
├── start.sh                 # Quick start script
└── package.json             # Backend dependencies
```

## 🎯 Question Packs

Question packs are JSON files in the `question_packs/` directory. The default pack includes 28 questions across categories like History, Animals, Food, Sports, Geography, Music, and Science.

### Question Pack Structure
```json
{
  "early_rounds": [
    {
      "category": "History",
      "question": "What item did President Harrison refuse to wear at his inauguration?",
      "answer": "Coat",
      "lies": ["Top hat", "Gloves", "Scarf", "Socks", "Overcoat", "Cape"],
      "audio_file": null
    }
  ],
  "final_round": [
    {
      "category": "Bonus",
      "question": "What is the dot over a lowercase 'i' called?",
      "answer": "Tittle",
      "lies": ["Jot", "Speck", "Nib", "Flick"],
      "audio_file": null
    }
  ]
}
```

### Creating Custom Question Packs

1. Create a new JSON file in `question_packs/`
2. Include `early_rounds` array with multiple questions
3. Add `final_round` array (optional, for final round questions)
4. Each question needs: `category`, `question`, `answer`, and `lies` array
5. Restart the server to load new packs

### Supported Categories (with emoji icons)
- History 📚, Animals 🐾, Food 🍎, Science 🔬
- Sports ⚽, Entertainment 🎬, Geography 🌍, Music 🎵
- Art 🎨, Technology 💻, Nature 🌿, Space 🚀
- And many more (30+ categories supported)

## 🎮 Game Rules & Scoring

### Scoring System
- **Round 1**: 500 points per player fooled, 1,000 for finding truth
- **Round 2**: Points doubled (1,000 / 2,000)
- **Round 3**: Points tripled (1,500 / 3,000)

### Game Structure
- **3 rounds total** (configurable in constants.js)
- **8 questions per round** (configurable)
- **2-16 players** supported
- **30-second timers** for lie submission and voting
- **15-second timer** for category selection
- **10-second timer** for question reading

### Special Features
- **Like System**: Players can like each other's lies during reveal (future scoring)
- **Auto-completion**: Random lies submitted for inactive players
- **Duplicate Handling**: Identical lies are combined and credited to all submitters
- **Smart Options**: Extra lies added to hide patterns and duplicate submissions

## 🔧 API Endpoints

### REST API
- `GET /api/health` - Server health check and game status
- `GET /api/server-info` - Detected server URL for QR codes
- `GET /api/game-info` - Current game state and player count
- `GET /api/question-packs` - Available question packs with current selection

### Game Routes
- `GET /host` - Host interface (main game screen)
- `GET /player` - Player interface (personal device screen)
- `GET /` - Landing page with game links
- `GET /tests/debug-interface.html` - Backend testing interface

### WebSocket Events

#### Client to Server
- `join_game` - Player joins with name and avatar
- `start_game` - Begin gameplay (host action)
- `select_category` - Choose question category
- `submit_lie` - Submit fake answer
- `select_option` - Vote for real answer
- `like_lie` - Like another player's lie
- `request_game_state` - Get current state

#### Server to Client
- `player_joined_response` - Join success/failure
- `game_state_update` - Game state changes
- `sub_step_info` - Player-specific state info
- `timer_update` - Countdown timer updates
- `truth_reveal_start` - Begin scoring reveal
- `player_data_update` - Individual player updates

## 🧪 Testing & Development

### Backend Debug Interface

Visit `http://localhost:3000/tests/debug-interface.html` for comprehensive testing:

- **Real-time Connection Monitoring** - WebSocket status and events
- **Multi-player Simulation** - Open multiple tabs to test game flow
- **Game Action Testing** - Test all player actions and state transitions
- **Live Event Logging** - See all WebSocket communications
- **State Inspection** - View current game state and player data

### Frontend Development

```bash
cd svelte
npm run dev    # Start Vite dev server with hot reload
npm run build  # Build production assets to ../public/
```

The Svelte frontend uses:
- **Vite** for fast development and building
- **Socket.IO Client** for real-time communication
- **QR Code generation** for easy player joining
- **Responsive CSS** for mobile-first design

### Testing Game Flow

1. Open the debug interface in multiple browser tabs
2. Join with different player names in each tab
3. Start the game and follow through all phases:
   - Lobby → Category Selection → Question Reading
   - Lie Submission → Option Selection → Truth Reveal → Scoreboard
4. Test edge cases: disconnections, timeouts, duplicate lies

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