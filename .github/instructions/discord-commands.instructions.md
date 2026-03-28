---
applyTo: src/discord/interactions/commands/**
---

# Discord Slash Command Instructions

## Command Type

Every command file exports a `Command` object as default:

The `Command` type:

```typescript
type Command = {
  channels?: string[]; // Optional: restrict to specific channel IDs
  roles?: string[]; // Optional: restrict to specific role IDs
  data: SlashCommandBuilder; // Command definition
  execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
};
```

Example usage:

```typescript
import { Command } from './types';

const myCommand: Command = {
  channels: ['123456789012345678'],
  roles: ['987654321098765432'],
  data: new SlashCommandBuilder()
    .setName('my_command')
    .setDescription('Description'),
  async execute(interaction) {
    // Command implementation
  },
};

export default myCommand;
```

## Registration

After creating a command file:

1. Import it in `src/discord/interactions/commands/index.ts`
2. Add it to the `commandData` array
3. The handler auto-registers it in the `commands` Collection keyed by `data.name`
4. Run `yarn commands` to deploy to Discord

## Conventions

- Command names use snake_case: `approve_challenge`, `league_name`, `draw_raffle`
- Use `channelGroups` from `src/discord/Channel.ts` for channel restrictions (e.g., `channelGroups.BOT_COMMANDS`, `channelGroups.SAGE_CHALLENGE_APPROVAL`)
- Use `Role` enum from `src/discord/Role.ts` for role restrictions (e.g., `Role.Administrator`, `Role.Tester`)
- For quick responses: `interaction.reply({ content: '...' })`
- For long operations: `await interaction.deferReply({ ephemeral: true })` then `interaction.editReply('...')`
- Ephemeral error replies: `interaction.reply({ content: '...', ephemeral: true })`
- Wrap `execute` body in try-catch; log with `console.error` and reply with user-friendly message

## Command Builder

Use `@discordjs/builders` v0.11 (discord.js v13 API):

```typescript
import { SlashCommandBuilder } from '@discordjs/builders';

new SlashCommandBuilder()
  .setName('my_command')
  .setDescription('Description here')
  .addUserOption((option) =>
    option.setName('user').setDescription('Target user').setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('difficulty')
      .setDescription('The difficulty level')
      .addChoices([
        ['Easy', '1'],
        ['Hard', '2'],
      ])
      .setRequired(true),
  );
```

## Pattern: Commands with Select Menu Follow-ups

Some commands reply with a `MessageActionRow` containing a `MessageSelectMenu`. The select menu handler lives in `src/discord/interactions/selectMenus/` and is matched by `customId`.

## Pattern: League-Conditional Commands

Use `LeagueNameCommand` type for commands that vary by league state:

```typescript
const myCommand: Command = {
  data: new SlashCommandBuilder().setName('league_name'),
  execute: (config.current_league_active
    ? activeLeagueBehavior(CURRENT_LEAGUE)
    : inactiveLeagueBehavior(CURRENT_LEAGUE)
  ).execute,
};
```

## Permission Guards

Channel and role guards are enforced automatically by the handler in `index.ts` before `execute()` is called. You do NOT need to check permissions inside `execute()`.
