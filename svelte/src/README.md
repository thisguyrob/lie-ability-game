# Lie-Ability Game - Svelte Frontend

This directory contains the Svelte frontend for the Lie-Ability party game. The frontend provides both host and player interfaces with real-time synchronization via Socket.IO.

## 🏗️ Architecture

### Multi-Entry Points
The frontend is built with multiple entry points to serve different user types:

- **Host Interface** (`host.html`) - Main game screen for TV/projector display
- **Player Interface** (`player.html`) - Personal device interface for players
- **Landing Page** (`index.html`) - Welcome page with game links

### Component Structure

```
src/
├── Host.svelte                 # Main host application
├── Player.svelte              # Main player application
├── app.css                    # Global styles and design system
├── host-main.js               # Host entry point
├── player-main.js             # Player entry point
└── components/
    ├── Lobby.svelte           # Host lobby with QR code
    ├── QuestionView.svelte    # Host question display
    ├── TruthReveal.svelte     # Host truth reveal
    ├── Scoreboard.svelte      # Host scoreboard
    └── player/
        ├── PlayerJoin.svelte           # Player join form
        ├── PlayerLobby.svelte          # Player lobby wait
        ├── PlayerCategorySelect.svelte # Category selection
        ├── PlayerQuestionReading.svelte # Question reading
        ├── PlayerLieSubmit.svelte      # Lie submission
        ├── PlayerOptionSelect.svelte   # Vote for truth
        ├── PlayerTruthReveal.svelte    # Personal results
        └── PlayerScoreboard.svelte     # Personal standings
```

## 🎨 Design System

### CSS Custom Properties
The design system uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-4: 1rem;
  --space-8: 2rem;
  
  /* Typography */
  --font-size-xl: 1.25rem;
  --font-size-3xl: 1.875rem;
}
```

### Utility Classes
Common utility classes for rapid development:

- `.btn`, `.btn-primary`, `.btn-secondary` - Button styles
- `.card`, `.glass` - Card and glassmorphism effects
- `.fade-in`, `.slide-up`, `.scale-in` - Animations
- `.container` - Max-width container with padding

### Responsive Design
- Mobile-first approach with progressive enhancement
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly interfaces (44px minimum touch targets)
- Adaptive layouts for different screen sizes

## 🔄 State Management

### Game State Flow
The frontend manages state through reactive Svelte stores and Socket.IO events:

1. **Connection State** - WebSocket connection status
2. **Game State** - Current phase, round, question, players
3. **Player State** - Personal avatar, score, submissions
4. **UI State** - Loading states, error messages, animations

### Key State Objects

```javascript
// Game State
{
  phase: 'lobby' | 'playing' | 'game_over',
  round: 1 | 2 | 3,
  question: number,
  subStep: 'category_selection' | 'question_reading' | 'lie_submission' | 'option_selection' | 'truth_reveal' | 'scoreboard',
  players: Array<Player>,
  currentQuestion: Question,
  options: Array<Option>,
  timer: { remaining: number, total: number }
}

// Player State
{
  id: string,
  name: string,
  avatar: { emoji: string, color: string },
  score: number,
  connected: boolean,
  hasJoined: boolean
}
```

## 🔌 Socket.IO Integration

### Event Handling
The frontend communicates with the backend via Socket.IO events:

#### Client → Server Events
- `join_game` - Player joins with name and avatar
- `start_game` - Host starts the game
- `select_category` - Player selects question category
- `submit_lie` - Player submits fake answer
- `select_option` - Player votes for truth
- `like_lie` - Player likes another's lie

#### Server → Client Events
- `game_state_update` - Game state changes
- `player_joined_response` - Join success/failure
- `sub_step_info` - Player-specific state info
- `timer_update` - Timer countdown updates
- `truth_reveal_start` - Begin truth reveal sequence

### Reconnection Handling
Players can reconnect seamlessly:
- Session data stored in `sessionStorage`
- Automatic rejoin attempts on reconnection
- State synchronization on successful rejoin

## 🎯 Component Patterns

### Event Dispatching
Components use Svelte's event dispatcher for parent communication:

```javascript
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

function handleAction() {
  dispatch('customEvent', { data: 'value' });
}
```

### Reactive Statements
Computed values and side effects use Svelte's reactive syntax:

```javascript
$: filteredPlayers = players.filter(p => p.connected);
$: isMyTurn = subStepInfo.isMyTurn && subStepInfo.canAct;
```

### Animation Coordination
Staggered animations for list items:

```svelte
{#each items as item, index}
  <div 
    class="item scale-in"
    style="animation-delay: {index * 100}ms"
  >
    {item.name}
  </div>
{/each}
```

## 📱 Mobile Optimization

### Touch-Friendly Design
- Minimum 44px touch targets
- Larger buttons on mobile (`btn-lg` class)
- Swipe-friendly interfaces
- Reduced motion support

### Performance Considerations
- Lazy loading of non-critical animations
- Efficient DOM updates with Svelte's reactivity
- Minimal JavaScript bundle size
- Optimized images and assets

### Progressive Enhancement
- Works without JavaScript (basic functionality)
- Enhanced experience with JavaScript enabled
- Graceful degradation for older browsers

## 🔧 Development

### Setup
```bash
cd svelte
npm install
npm run dev    # Development server with hot reload
npm run build  # Production build to ../public/
```

### File Structure
- **Entry Points**: `host.html`, `player.html`, `index.html`
- **Main Components**: `Host.svelte`, `Player.svelte`
- **Shared Styles**: `app.css`
- **Component Library**: `components/` directory

### Build Process
Vite handles the build process:
1. Processes Svelte components
2. Bundles JavaScript and CSS
3. Outputs to `../public/` directory
4. Generates optimized assets

### Development Tools
- **Vite** - Fast development server and build tool
- **Svelte Check** - Type checking and validation
- **Socket.IO Client** - Real-time communication
- **QRCode.js** - QR code generation for easy joining

## 🎮 Game Flow Integration

### Host Flow
1. **Lobby** - Display QR code, manage players
2. **Question View** - Show current game state
3. **Truth Reveal** - Animated results display
4. **Scoreboard** - Rankings and statistics

### Player Flow
1. **Join** - Name and avatar selection
2. **Lobby** - Wait for game start
3. **Category Select** - Choose question topic (if selected)
4. **Question Reading** - Study the question
5. **Lie Submit** - Create convincing fake answer
6. **Option Select** - Vote for truth, like lies
7. **Truth Reveal** - Personal results
8. **Scoreboard** - Current standings

### State Synchronization
- Real-time updates via WebSocket
- Optimistic UI updates where appropriate
- Error handling and retry logic
- Graceful degradation for connection issues

## 🎨 Theming and Customization

### CSS Variables
Easy theming through CSS custom properties:

```css
:root {
  --primary: #your-color;
  --radius-lg: 0.75rem;
  --space-4: 1.25rem;
}
```

### Component Variants
Components support multiple variants through props:

```svelte
<Button variant="primary" size="lg">Submit</Button>
<Card variant="glass" shadow="xl">Content</Card>
```

### Animation System
Coordinated animations using CSS classes:
- Entry animations: `fade-in`, `slide-up`, `scale-in`
- State changes: `bounce-in`, `pulse`
- Loading states: `spinner`, `skeleton`

This frontend provides a polished, professional gaming experience that rivals commercial party games while remaining open source and customizable.