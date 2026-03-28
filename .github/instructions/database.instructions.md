---
applyTo: src/database/**
---

# Database Layer Instructions

## Model Definition Pattern

All models extend `InitializableModel<T>` from `./models/types.ts`. Every model must:

1. Extend `InitializableModel<ModelName>`
2. Use `declare` for all properties (never class field initializers)
3. Implement `static initialize(sequelize: Sequelize)` using `ModelName.init({...}, { sequelize, tableName: 'ModelName' })`
4. Implement `static initializeAssociations()` for relationships (can be empty)
5. Always include `createdAt: DataTypes.DATE` and `updatedAt: DataTypes.DATE` in the schema
6. Register the model in `src/database/models/index.ts` — add to the `models` array and add named exports

### Property Types

- Use `CreationOptional<T>` for auto-generated fields (`id`, `createdAt`, `updatedAt`)
- Use `ForeignKey<Model['field']>` for foreign key references
- Mark optional fields with `?` and `CreationOptional`
- Primary keys with auto-increment: `DataTypes.BIGINT` with `autoIncrement: true, primaryKey: true, unique: true`
- String primary keys: `DataTypes.STRING` with `allowNull: false, primaryKey: true, unique: true`

### Example Model

```typescript
import { CreationOptional, DataTypes, ForeignKey, Sequelize } from 'sequelize';
import { InitializableModel } from './types';
import OtherModel from './OtherModel';

class MyModel extends InitializableModel<MyModel> {
  declare readonly id: CreationOptional<number>;
  declare name: string;
  declare otherId: ForeignKey<OtherModel['id']>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    MyModel.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        otherId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: { model: 'OtherModel', key: 'id' },
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { tableName: 'MyModel', sequelize },
    );
  };

  static initializeAssociations() {
    MyModel.belongsTo(OtherModel, { foreignKey: 'otherId' });
  }
}

export default MyModel;
```

### League Model Pattern

League models all share the same schema: `name: string` (PK) + `points: number`. Place new league models in `src/database/models/League/`. When adding a new league, also update:

- `src/leagues.ts` (League type, mappings, CURRENT_LEAGUE)
- `src/database/models/DiscordUser.ts` (add league name column)
- Create a migration for both the new league table and the DiscordUser column

## Migration Pattern

- Filename: `{timestamp}-{description}.ts` (e.g., `1732481549425-create-discord-user.ts`)
- Use `module.exports = { up, down }` (CommonJS for Sequelize CLI compatibility)
- Import `{ DataTypes, QueryInterface }` from `sequelize`
- `up(queryInterface)` creates/alters tables; `down(queryInterface)` reverses
- Reference model types in `createTable<ModelType>()` for type safety
- Add indexes using `.then(async () => { await queryInterface.addIndex(...) })` chained after `createTable`

```typescript
import { DataTypes, QueryInterface } from 'sequelize';
import { MyModel } from '../models';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<MyModel>('MyModel', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('MyModel');
  },
};
```

## Seeder Pattern

- Filename: `{number}-{table-name}.ts` (e.g., `1-discord-user.ts`)
- Use `module.exports = { up, down }` (CommonJS for Sequelize CLI compatibility)
- `up`: Use `queryInterface.bulkInsert()` with `createdAt` and `updatedAt` where required
- `down`: Use `queryInterface.delete()` or `queryInterface.bulkDelete()`
- For seeders that depend on other tables, query the DB first (e.g., `queryInterface.sequelize.query('SELECT * FROM "Region"')`)

## Naming Conventions

| Element               | Convention      | Example                                   |
| --------------------- | --------------- | ----------------------------------------- |
| Table names           | PascalCase      | `DiscordUser`, `ChallengeCard`            |
| Column names          | snake_case      | `user_id`, `discord_role_id`              |
| Model files           | PascalCase      | `DiscordUser.ts`, `RaffleTicket.ts`       |
| Migration files       | timestamp-kebab | `1732481549425-create-discord-user.ts`    |
| Foreign keys in model | camelCase       | `regionOneId`, `discordUserId`            |
| Foreign keys in DB    | camelCase       | Sequelize auto-maps from model definition |

## Database Config

- Development/Test: SQLite (`./.sqlite/{env}.db`)
- Stage/Production: MySQL via `JAWSDB_URL` with SSL
- Use `sequelize.transaction()` for multi-step writes (see `src/raffles.ts` for example)
