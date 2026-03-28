# Copilot Instructions — OSRS Leagues Discord Bot

## Project Overview

This is a TypeScript Discord bot for the Old School RuneScape (OSRS) Leagues community server. It manages player challenge cards, league rankings, relic selection, raffle systems, and Discord role assignments across multiple seasonal leagues (Twisted, Trailblazer, Shattered Relics, Trailblazer Reloaded, Raging Echoes).

## Tech Stack

- **Runtime**: Node.js >=18.x <=21.x
- **Language**: TypeScript 4.5 (CommonJS modules, ES6 target, **not strict mode** — only `noImplicitAny` is enabled)
- **Discord**: discord.js 13.5.0 with `@discordjs/builders` and `@discordjs/rest`
- **Database**: Sequelize 6 ORM with MySQL (production/stage) and SQLite (development/test)
- **Scheduling**: node-cron for background jobs
- **Scraping**: puppeteer for OSRS hiscores
- **Testing**: Jest 27 with ts-jest preset, using real SQLite databases (not mocked)
- **Package Manager**: Yarn 1.x
- **Linting**: ESLint + Prettier with husky pre-commit hooks

## Key Commands

- `yarn build` — TypeScript compile to `dist/`
- `yarn start` — Run bot with ts-node
- `yarn test` — Run tests (recreates test SQLite DB, runs migrations & seeds first via `pretest`)
- `yarn lint` — ESLint + Prettier check
- `yarn lint:fix` — Auto-fix lint issues
- `yarn commands` — Deploy slash commands to Discord
- `yarn migrate` / `yarn seed` — Run Sequelize migrations/seeders

## Architecture

```
src/index.ts                    → Entry point: initializeDatabase() then initializeDiscord()
src/config.ts                   → Central typed config (BotConfig) via dotenv
src/leagues.ts                  → League definitions, rank thresholds, utility functions
src/challenges.ts               → Challenge card system with in-memory cache
src/relics.ts                   → Random relic selection logic
src/raffles.ts                  → Raffle ticket system with transactions
src/database/                   → Sequelize ORM layer
  models/                       → InitializableModel pattern (lazy init)
  migrations/                   → Timestamped Sequelize CLI migrations
  seeders/                      → Test data seeders
src/discord/                    → Discord API layer
  interactions/commands/        → Slash commands (Command type)
  interactions/buttons/         → Button handlers (Button type, prefix matching)
  interactions/selectMenus/     → Select menu handlers (SelectMenu type)
  listeners/                    → Channel message listeners (ChannelListener type)
  actions/                      → Reusable Discord actions (role setting, challenge approval)
  messages/                     → MessageEmbed factory functions
src/tasks/                      → Executable tasks (Task<TParams, TResult> type)
src/schedule/                   → Cron job definitions (Job type with per-environment intervals)
```

## Coding Conventions

### Formatting (Prettier)

- Semicolons: always
- Trailing commas: all
- Single quotes
- Tab width: 2 spaces

### Naming

| Category            | Style                                | Examples                                    |
| ------------------- | ------------------------------------ | ------------------------------------------- |
| Files               | camelCase or snake_case              | `approveChallenge.ts`, `draw_raffle.ts`     |
| Directories         | camelCase                            | `challengeList/`, `selectMenus/`            |
| Classes/Models      | PascalCase                           | `DiscordUser`, `ChallengeCard`              |
| Enums               | PascalCase names, UPPER_SNAKE values | `ChallengeDifficulty.NOVICE`, `Rank.DRAGON` |
| Constants           | UPPER_SNAKE_CASE                     | `CURRENT_LEAGUE`, `HISCORES_URL`            |
| Variables/Functions | camelCase                            | `challengeCache`, `getRank()`               |
| Database columns    | snake_case                           | `user_id`, `twisted_name`                   |
| Database tables     | PascalCase                           | `DiscordUser`, `ChallengeCard`              |
| Type aliases        | PascalCase                           | `PointRankings`, `SetLeagueRoleParams`      |

### Imports

- Use **relative paths** exclusively (no path aliases)
- Namespace imports for domain modules: `import * as challenges from './challenges'`
- Named imports for models/types: `import { Challenge, ChallengeCard } from './database'`
- Default imports for config/singletons: `import config from './config'`
- Barrel exports via `index.ts` files throughout the codebase

### Exports

- **Default exports** for single-responsibility modules (commands, actions, tasks, jobs)
- **Named exports** for multi-export modules (leagues.ts, challenges.ts)
- **Re-exports** from index files: `export { default as removeLeagueRoles } from './removeLeagueRoles'`
- **Wildcard re-exports** for model layers: `export * from './models'`

## Database Patterns

### Model Definition

All models extend `InitializableModel<T>` which provides:

- `static initialize(sequelize)` — Define table schema
- `static initializeAssociations()` — Set up relationships

Models use `declare` for properties with Sequelize's `InferAttributes` / `InferCreationAttributes` types.

```typescript
class MyModel extends InitializableModel<MyModel> {
  declare id: CreationOptional<number>;
  declare name: string;

  static initialize(sequelize: Sequelize) {
    MyModel.init(
      {
        /* schema */
      },
      { sequelize, tableName: 'MyModel' },
    );
  }
  static initializeAssociations() {
    MyModel.belongsTo(OtherModel, { foreignKey: 'otherModelId' });
  }
}
```

### League Tables

Each OSRS league season has its own model and database table (e.g., `TwistedLeague`, `RagingEchoesLeague`). They share an identical schema (`name: string` PK + `points: number`). When adding a new league:

1. Create a new model in `src/database/models/League/`
2. Add a migration in `src/database/migrations/`
3. Add the league to the `League` union type and all league mappings in `src/leagues.ts`
4. Add the corresponding `DiscordUser` column and migration
5. Update `CURRENT_LEAGUE` constant

### Migrations

- Filename format: `{timestamp}-{description}.ts`
- Export `up(queryInterface)` and `down(queryInterface)` functions
- Compatible with Sequelize CLI (`npx sequelize-cli`)

## Discord Interaction Patterns

### Commands

```typescript
const myCommand: Command = {
  channels: channelGroups.BOT_COMMANDS, // Optional channel restriction
  roles: [Role.Administrator], // Optional role restriction
  data: new SlashCommandBuilder()
    .setName('my_command')
    .setDescription('Description'),
  execute: async (interaction) => {
    // For long operations: await interaction.deferReply() then interaction.editReply()
    // For quick responses: interaction.reply()
  },
};
export default myCommand;
```

### Permission Guards

Commands, select menus, and buttons enforce access via:

- `channels` — Array of allowed Discord channel IDs
- `roles` — Array of allowed Discord role IDs
- Guards are checked in the handler before `execute()` is called

### Messages

Message builders are **pure factory functions** that accept a typed params object and return a `MessageEmbed`:

```typescript
const getMessage = ({ member, data }: MessageParams): MessageEmbed => {
  return new MessageEmbed().setTitle('...').setDescription('...');
};
```

### Actions

Reusable Discord operations (role management, challenge approval) live in `src/discord/actions/`. They accept typed parameter objects and handle their own error catching with `console.error`.

## Task & Scheduling Patterns

### Tasks

```typescript
const myTask: Task<MyParams, MyResult> = {
  execute: async (params) => {
    // Perform work, return result
  },
};
```

### Jobs

```typescript
const myJob: Job = {
  enabled: true,
  interval: {
    test: undefined,
    development: undefined,
    stage: '0 0 * * *',
    production: '0 */1 * * *',
  },
  runOnStart: false,
  execute: () => {
    myTask.execute();
  },
};
```

## Testing Conventions

- Test files: `__tests__/` directories co-located with source, or `src/__tests__/` for top-level domain tests
- Test file naming: `{module}.test.ts`
- Database tests use real SQLite via `src/test/jest.database.ts` setup (initializes DB + loads cache in `beforeAll`)
- Use `describe()` for grouping, `test()` or `it()` for cases
- Tests run against a fresh database (pretest script recreates SQLite, runs migrations and seeds)

## Error Handling

- **Try-catch** with `console.error` for logging — no custom error classes
- **Ephemeral replies** for user-facing Discord errors: `interaction.reply({ content: '...', ephemeral: true })`
- **Graceful fallbacks**: Actions return `undefined` on failure rather than throwing
- **Transactions** for multi-step DB operations (e.g., raffle ticket creation)

## Adding New Features Checklist

### New Slash Command

1. Create command file in `src/discord/interactions/commands/`
2. Export as default, following the `Command` type
3. Register in the commands `Map` in `src/discord/interactions/commands/index.ts`
4. Add to `commandData` array for deployment
5. Run `yarn commands` to register with Discord

### New Database Model

1. Create model extending `InitializableModel` in `src/database/models/`
2. Add migration in `src/database/migrations/`
3. Register model in `src/database/models/index.ts`
4. Add seeder in `src/database/seeders/` if test data is needed

### New Scheduled Job

1. Create task in `src/tasks/`
2. Create job in `src/schedule/jobs/`
3. Register job in `src/schedule/jobs/index.ts`

## Important Notes

- TypeScript is **not in strict mode** — be explicit with null/undefined checks at system boundaries since `strictNullChecks` is off
- The `challengeCache` is a singleton loaded at startup; if challenge data changes, the cache must be reloaded
- Discord channel and role IDs are hardcoded as string enums — these vary by environment
- The bot uses `@discordjs/builders` v0.11 and discord.js v13 — use `MessageEmbed` (not `EmbedBuilder`) and the v13 API
- PRs require a changeset file (`.changeset/*.md`) as enforced by CI
- ESLint allows `@ts-ignore` comments (`ban-ts-comment: off`) but flags unused variables as errors
