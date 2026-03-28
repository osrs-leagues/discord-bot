---
applyTo: src/discord/listeners/**
---

# Discord Message Listener Instructions

Listeners respond to messages in specific Discord channels (not slash commands).

## ChannelListener Pattern

```typescript
import { Message } from 'discord.js';
import { ChannelListener } from '../types';
import { setMessageExpiration, ERROR_LIFESPAN } from '../utils';

const myListener: ChannelListener = {
  channels: [
    'CHANNEL_ID_1', // Comment: server name / purpose
    'CHANNEL_ID_2', // Comment: test server equivalent
  ],
  onChannelMessage: async (message: Message) => {
    if (message.author.bot) return; // Ignore bot messages

    try {
      // Handle the message
    } catch (error) {
      console.error('Error in my listener:', error);
      const response = await message.reply('Error message for user.');
      setMessageExpiration(message, 100);
      setMessageExpiration(response, ERROR_LIFESPAN);
    }
  },
};

export default myListener;
```

## ChannelListener Type

```typescript
type ChannelListener = {
  channels: string[]; // Channel IDs this listener responds to
  excludedRoles?: string[]; // Optional: role IDs to exclude
  onChannelMessage: (message: Message) => Promise<void>;
};
```

## Conventions

- **Default export** only — one listener per file in `src/discord/listeners/messageListeners/`
- **Register** in `src/discord/listeners/index.ts` by importing and adding to the `messageListeners` array
- The handler in `index.ts` matches listeners by `channels` array and calls `onChannelMessage` for each match
- Multiple listeners can respond to the same channel
- Use `setMessageExpiration(message, milliseconds)` from `./utils` for auto-deleting messages
- Common lifespan constants: `ERROR_LIFESPAN = 60 * 1000` (1 minute), `MESSAGE_LIFESPAN = config.imp_spotting_time * 60 * 1000`
- Always check `message.author.bot` to avoid responding to bot messages
- Use regex for message format validation (e.g., `IMP_MESSAGE_REGEX`)
- Reply with user-friendly format hints when message doesn't match expected pattern
