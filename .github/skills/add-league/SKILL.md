---
name: add-league
description: 'Add a new OSRS league season to the Discord bot. Use when: adding a league, creating a new league, new league season, new league type. Creates model, migrations, updates League type, config, and commands.'
argument-hint: 'League name in snake_case (e.g., demonic_pacts)'
---

# Add New OSRS League

Add a new league season to the bot. This involves creating a database model, migrations, and updating all league mappings across the codebase.

## When to Use

- A new OSRS Leagues season is announced and needs to be added
- User asks to "add a new league" or "create a league"

## Prerequisites

Before starting, ask the user for:

1. **League key** — snake_case identifier (e.g., `demonic_pacts`)
2. **Display name** — Human-readable name (e.g., `Demonic Pacts`)
3. **PascalCase name** — For model/table (e.g., `DemonicPactsLeague`)
4. **Point thresholds** — Rank point thresholds for bronze through dragon, or whether to reuse an existing league's thresholds
5. **Set as current league?** — Whether to update `CURRENT_LEAGUE`
6. **Command type** — `leagueNameBronze` (league not yet started, sets everyone to bronze) or `leagueNameLocal` (league active, looks up hiscores)

## Procedure

All steps reference the project root. Use the existing `raging_echoes` / `RagingEchoesLeague` as the pattern to follow.

### Step 1: Create the League Model

Create `src/database/models/League/{PascalName}League.ts`:

```typescript
import { CreationOptional, DataTypes, Sequelize } from 'sequelize';
import { InitializableModel } from '../types';

class {PascalName}League extends InitializableModel<{PascalName}League> {
  declare name: string;
  declare points: number;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    {PascalName}League.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: '{PascalName}League',
        sequelize,
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static initializeAssociations() {}
}

export default {PascalName}League;
```

### Step 2: Create Migrations

Migration filenames use `{timestamp}-{description}.ts` format. Use the current epoch in milliseconds.

**2a. Create league table** — `src/database/migrations/{timestamp}-create-{kebab-name}-league.ts`:

```typescript
import { DataTypes, QueryInterface } from 'sequelize';

import { {PascalName}League } from '../models';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<{PascalName}League>('{PascalName}League', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('{PascalName}League');
  },
};
```

**2b. Add DiscordUser column** — `src/database/migrations/{timestamp+1}-add-discord-user-{kebab-name}.ts`:

```typescript
import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('DiscordUser', '{snake_name}_name', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('DiscordUser', '{snake_name}_name');
  },
};
```

### Step 3: Register Model in Index

In `src/database/models/index.ts`:

- Add import: `import {PascalName}League from './League/{PascalName}League';`
- Add to the `models` array
- Add to both the named `export { }` block

### Step 4: Update DiscordUser Model

In `src/database/models/DiscordUser.ts`:

- Add property: `declare {snake_name}_name?: CreationOptional<string>;`
- Add column in the `init()` schema:
  ```typescript
  {snake_name}_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ```

### Step 5: Update League Definitions

In `src/leagues.ts`:

- Add `{PascalName}League` to the import from `'./database/models'`
- Add `'{snake_name}'` to the `League` union type
- Add entry to `LeagueRankings` with point thresholds
- Add entry to `LeagueNames`: `{snake_name}: '{Display Name}'`
- Add entry to `LeagueDiscordColumn`: `{snake_name}: '{snake_name}_name'`
- Add `case '{snake_name}':` to `getLeagueAttributes()` switch → `{PascalName}League.findByPk(username)`
- Add `case '{snake_name}':` to `insertLeagueName()` switch → `{PascalName}League.upsert(...)`
- If setting as current: change `CURRENT_LEAGUE` to `'{snake_name}'`

### Step 6: Update Config

In `src/config.ts`, add to `config.ranks`:

```typescript
{snake_name}: {
  bronze: process.env.{UPPER_SNAKE}_BRONZE,
  iron: process.env.{UPPER_SNAKE}_IRON,
  steel: process.env.{UPPER_SNAKE}_STEEL,
  mithril: process.env.{UPPER_SNAKE}_MITHRIL,
  adamant: process.env.{UPPER_SNAKE}_ADAMANT,
  rune: process.env.{UPPER_SNAKE}_RUNE,
  dragon: process.env.{UPPER_SNAKE}_DRAGON,
},
```

### Step 7: Register Command

In `src/discord/interactions/commands/index.ts`:

- If league has NOT started yet: use `leagueNameBronze('{snake_name}')` and import `leagueNameBronze` from `'./leagueNameBronze'`
- If league IS active: use `leagueNameLocal('{snake_name}')`
- Add the call to the `commandData` array

### Step 8: Update Remove League Roles Command

In `src/discord/interactions/commands/remove_league_roles.ts`:

- Add `{snake_name}_name: null` to the `result.update()` call

## Verification

After all changes:

1. Run `npx tsc --noEmit` — confirms no type errors (the `League` union type enforces exhaustiveness on all mapping objects)
2. Run `npx eslint` on all changed files
3. Run `yarn test` if possible (pretest recreates SQLite DB with new migrations)

## Files Changed Summary

| File                                                       | Action                                          |
| ---------------------------------------------------------- | ----------------------------------------------- |
| `src/database/models/League/{PascalName}League.ts`         | **NEW**                                         |
| `src/database/migrations/*-create-{kebab}-league.ts`       | **NEW**                                         |
| `src/database/migrations/*-add-discord-user-{kebab}.ts`    | **NEW**                                         |
| `src/database/models/DiscordUser.ts`                       | Add property + schema column                    |
| `src/database/models/index.ts`                             | Import + export model                           |
| `src/leagues.ts`                                           | Type, rankings, names, column map, switch cases |
| `src/config.ts`                                            | Rank role env vars                              |
| `src/discord/interactions/commands/index.ts`               | Register command                                |
| `src/discord/interactions/commands/remove_league_roles.ts` | Add null reset                                  |

## Notes

- No changes are needed to tasks, actions, messages, or scheduled jobs — they all work dynamically off `CURRENT_LEAGUE` and the `League` type
- The `League` union type provides compile-time exhaustiveness checking: if any mapping object (`LeagueRankings`, `LeagueNames`, `LeagueDiscordColumn`) is missing the new league key, TypeScript will report an error
- Environment variables for Discord role IDs (`{UPPER_SNAKE}_BRONZE` etc.) must be configured in `.env` and deployment environments separately
