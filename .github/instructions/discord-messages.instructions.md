---
applyTo: src/discord/messages/**
---

# Discord Message Builder Instructions

Message builders are **pure factory functions** that accept a typed params object and return a `MessageEmbed` (discord.js v13).

## Pattern

```typescript
import { MessageEmbed } from 'discord.js';

type MyMessageParams = {
  member: GuildMember;
  data: string;
};

const getMyMessage = ({ member, data }: MyMessageParams): MessageEmbed => {
  return new MessageEmbed()
    .setColor('#64d85b')
    .setTitle('Title')
    .setDescription('Description');
};

export default getMyMessage;
```

## Conventions

- **Default export** only — one message factory per file
- Function name: `get{Name}Message` (e.g., `getRelicsMessage`, `getChallengeCardMessage`, `getHiscoreRankingMessage`)
- Params type name: `{Name}MessageParams` (e.g., `RelicsMessageParams`, `HiscoreRankingMessageParams`)
- Use `MessageEmbed` (not `EmbedBuilder` — this is discord.js v13)
- Functions must be **pure** — no side effects, no database calls, no API calls
- Use the challenge cache (`challengeCache`) for region/challenge data lookups within the function
- Use helper functions from `src/leagues.ts` for rank/league display names and colors (`getRankName`, `getLeagueName`, `getRankColor`, `getEmbedColour`)
- Use `encodeURL()` from `src/utils/strings.ts` for URL fields
- Discord user mentions: `<@${userId}>`
- Member display name: `member.nickname ?? member.displayName`

## Common MessageEmbed Methods

```typescript
new MessageEmbed()
  .setColor('#64d85b') // Hex color or named color ('RANDOM')
  .setTitle('Title text')
  .setDescription('Body text')
  .setURL('https://...') // Clickable title link
  .addField('Label', 'Value'); // Key-value field
```
