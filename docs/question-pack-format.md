# Question Pack Format

## Overview

Question packs provide the trivia content for the game. Each pack is a JSON file stored in the `question_packs/` directory and loaded at server start by `QuestionService`. Packs define early round and final round questions with required fields.

## Required Structure

```json
{
  "early_rounds": [ /* array of question objects */ ],
  "final_round": [ /* array of question objects */ ]
}
```

Each question object must include the following fields:

- `category` – category name displayed to players
- `question` – the trivia question text
- `answer` – the real answer
- `lies` – an array of believable fake answers (minimum of three)
- `audio_file` – optional path to an audio clip or `null`

## Example

The default pack demonstrates the full structure. A sample early round entry:

```json
{
  "category": "History",
  "question": "In 1840, what item did U.S. President William Henry Harrison stubbornly refuse to wear at his freezing inauguration?",
  "answer": "Coat",
  "lies": ["Top hat", "Gloves", "Scarf", "Socks", "Overcoat", "Cape", "Thermal underwear", "Poncho"],
  "audio_file": null
}
```

Final round entries use the same fields. Example:

```json
{
  "category": "Misc",
  "question": "What word names both a punctuation mark and a small tropical fish?",
  "answer": "Guppy",
  "lies": ["Comma", "Dot", "Colon", "Dash", "Semi", "Ampersand", "Bracket", "Quote"],
  "audio_file": null
}
```

## Usage

Create new packs by following this format and placing the file in `question_packs/`. The server will validate the structure on startup and load any valid packs automatically.

