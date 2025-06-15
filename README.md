# Lie-Ability Game

A multiplayer party game inspired by Fibbage, where players create lies to fool others while trying to identify the real answer among fabricated ones.

## 🎮 Game Overview

Lie-Ability is a social deduction party game perfect for family gatherings, parties, or online game nights. Players are presented with trivia questions with missing answers, and they must:

1. **Create convincing lies** to fill in the blanks
2. **Identify the real answer** among all the submissions
3. **Score points** for fooling other players and finding the truth

## 🏗️ Architecture

### Backend Components
- **Node.js + Express** - Web server and API
- **Socket.IO** - Real-time WebSocket communication
- **Game State Machine** - Manages game flow and transitions
- **Timer Service** - Handles countdown timers without hanging
- **Question Service** - Loads and validates question packs
- **Player Management** - Handles joins, leaves, and reconnections

### Game Flow
1. **Lobby** - Players join and wait for game start
2. **Category Selection** - Random player chooses question category
3. **Question Reading** - Question is displayed to all players
4. **Lie Submission** - Players submit fake answers
5. **Option Selection** - Players vote on which answer is real
6. **Truth Reveal** - Scores are calculated and revealed
7. **Scoreboard** - Current standings shown

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lie-ability-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
./start.sh
```
4. The script ensures all backend and frontend packages are installed with
   `npm install --legacy-peer-deps` and opens the host UI automatically at
   http://localhost:5173/host

### For Production
```bash
npm start
```

The server detects your local IP address automatically so QR codes work out of the box.
Override this by setting the `PUBLIC_URL` environment variable if you need a custom domain.

## 📁 Project Structure

```
lie-ability-game/
├── src/
│   ├── models/
│   │   ├── Game.js          # Main game logic and state machine
│   │   └── Player.js        # Player data and methods
│   ├── services/
│   │   ├── TimerService.js  # Timer management with cleanup
│   │   └── QuestionService.js # Question pack loading and validation
│   ├── utils/
│   │   ├── constants.js     # Game constants and configuration
│   │   └── helpers.js       # Utility functions
│   └── server.js            # Main server entry point
├── question_packs/
│   ├── default.json         # Default question set
│   └── [custom].json        # Add your own question packs here
├── tests/
│   ├── debug-interface.html # Backend testing interface
│   ├── unit/                # Unit tests (future)
│   └── integration/         # Integration tests (future)
├── public/
│   └── index.html           # Built frontend assets
├── svelte/                  # Svelte source for the new frontend
├── docs/                    # Documentation (future)
├── package.json
└── README.md
```

## 🎨 Frontend Development

The frontend is being rewritten in **Svelte** under the `svelte/` directory.
Run `npm install` inside that folder and `npm run dev` to start the Vite dev server.
Alternatively, run `./start.sh` from the repository root to start both backend and frontend together.
The build output is placed in `public/`, which is served by the Express backend.

## 🎯 Question Packs

Question packs are JSON files in the `question_packs/` directory with the following structure:

```json
{
  "early_rounds": [
    {
      "category": "History",
      "question": "What item did President Harrison refuse to wear at his inauguration?",
      "answer": "Coat",
      "lies": ["Top hat", "Gloves", "Scarf", "Socks"],
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
2. Follow the structure above
3. Include at least 16 questions in `early_rounds` and 1+ in `final_round`
4. Restart the server to load new packs

## 🎮 Game Rules

### Scoring System
- **Round 1**: 500 points per player fooled, 1,000 for finding truth
- **Round 2**: Points doubled (1,000 / 2,000)
- **Round 3**: Points tripled (1,500 / 3,000)

### Game Structure
- **3 rounds total**
- **8 questions** in rounds 1-2
- **1 question** in final round
- **2-16 players** supported

### Special Features
- **Reconnection support** - Players can rejoin if disconnected
- **Auto-progression** - Game continues even if players don't respond
- **Multiple question packs** - Switch between different question sets
- **Real-time sync** - Shared screen and personal device coordination

## 🔧 API Endpoints

### REST API
- `GET /api/health` - Server health check
- `GET /api/server-info` - Detected server URL
- `GET /api/game-info` - Current game state
- `GET /api/question-packs` - Available question packs

### WebSocket Events
- `join_game` - Player joins game
- `start_game` - Begin gameplay
- `select_category` - Choose question category
- `submit_lie` - Submit fake answer
- `select_option` - Vote for real answer
- `request_game_state` - Get current state

## 🧪 Testing

### Backend Debug Interface

Visit `http://localhost:3000/tests/debug-interface.html` for a comprehensive testing interface that provides:

- **Connection status monitoring** - See real-time WebSocket connection
- **Player management controls** - Join, leave, reconnect players  
- **Game action testing** - Test category selection, lie submission, voting
- **Real-time event logging** - Monitor all WebSocket communications
- **State inspection tools** - View current game state and player data
- **Multi-player simulation** - Open multiple tabs to test multiplayer features

### Testing Multiple Players

1. Open multiple browser tabs to the debug interface
2. Join with different player names in each tab
3. Start the game from any tab
4. Follow the complete game flow through all phases

### API Testing

- `GET /api/health` - Server health and status
- `GET /api/game-info` - Current game state
- `GET /api/question-packs` - Available question packs

## 🐳 Docker Support

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🎉 Acknowledgments

Inspired by Fibbage from Jackbox Games. Created for family fun and open-source sharing.

---

**Happy Gaming!** 🎮✨