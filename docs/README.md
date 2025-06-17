# Lie Ability Game Documentation

Welcome to the comprehensive documentation for the Lie Ability Game engine. This documentation covers the complete system architecture, game mechanics, and development guide.

## Overview

The Lie Ability Game is a real-time multiplayer party game where players create creative lies to fool each other while trying to identify the truth. The game features a host-driven experience with players joining via their mobile devices.

## Documentation Structure

- **[Game Overview](./game-overview.md)** - Core gameplay mechanics and rules
- **[Game Flow & States](./game-flow.md)** - Complete game state machine and flow
- **[Backend Architecture](./backend-architecture.md)** - Server architecture, models, and APIs
- **[Frontend Components](./frontend-components.md)** - Svelte components and UI structure
- **[Voting & Scoring System](./voting-scoring.md)** - Detailed scoring mechanics and like system
- **[Development Guide](./development-guide.md)** - Setup, debugging, and troubleshooting
- **[Logging Conventions](./development-guide.md#logging-conventions)** - Standard console output format

## Quick Start

1. **Setup**: Follow the [Development Guide](./development-guide.md) for initial setup
2. **Architecture**: Read [Backend Architecture](./backend-architecture.md) to understand the system
3. **Game Flow**: Study [Game Flow & States](./game-flow.md) to understand the game mechanics
4. **Components**: Explore [Frontend Components](./frontend-components.md) for UI development

## Key Features

- **Real-time multiplayer** using WebSockets
- **Host/Player separation** with different interfaces
- **Creative lie submission** and voting system
- **Social features** with like system
- **Round-based scoring** with multiple game types
- **Responsive design** for mobile and desktop
- **Auto-completion** for inactive players

## Architecture Highlights

- **Backend**: Node.js with Socket.IO for real-time communication
- **Frontend**: Svelte for reactive UI components
- **State Management**: Centralized game state with real-time synchronization
- **Modular Design**: Separate host and player experiences
- **Timer System**: Robust timing controls for game phases

## Contributing

When making changes to the game engine:

1. Review the relevant documentation sections
2. Follow the established patterns in [Backend Architecture](./backend-architecture.md)
3. Test changes using the [Development Guide](./development-guide.md)
4. Update documentation for any new features or changes

## Recent Improvements

- **Like System Enhancement**: Likes now count until scoreboard display
- **Truth Reveal Timing**: Fixed player interface during truth reveal phase
- **Scoreboard Display**: Added thumbs up indicators for liked lies
- **Auto-voting**: Improved handling of inactive players