---
applyTo: src/tasks/**
---

# Task Instructions

Tasks are standalone executable units of work, typically called by scheduled jobs or other tasks.

## Pattern

```typescript
import { Task } from './types';

const myTask: Task<MyParams, MyResult> = {
  execute: async (params) => {
    try {
      // Perform work
      return result;
    } catch (error) {
      console.error('Error running myTask task.', error);
      return fallbackValue;
    }
  },
};

export default myTask;
```

## Task Type

```typescript
type Task<TParams = undefined, TResult = boolean> = {
  execute: (params?: TParams) => Promise<TResult>;
};
```

- Default `TParams = undefined` for tasks with no input
- Default `TResult = boolean` for success/failure tasks
- Override generics when needed: `Task<{ username: string }, HiscoreResult>`, `Task<undefined, number>`

## Conventions

- **Default export** only — one task per file, named descriptively (e.g., `fetchHiscoreUser`, `updateDiscordRoles`)
- **Register** in `src/tasks/index.ts` with named imports and re-exports
- **Error handling**: Wrap entire `execute` body in try-catch with `console.error`; return a sensible fallback (`false`, `0`, etc.)
- Use `console.log` for start/progress logging; `console.time`/`console.timeEnd` for long operations
- Tasks can call other tasks: `const result = await fetchHiscoreUser.execute({ username })`
- For batch DB writes, use `sequelize.transaction()` (import sequelize from `../database`)
- Access Discord client via `import { client } from '../discord'` when needed (e.g., fetching guild members)

## Existing Tasks

| Task                       | Params         | Returns      | Purpose                                               |
| -------------------------- | -------------- | ------------ | ----------------------------------------------------- |
| `fetchHiscoreUser`         | `{ username }` | hiscore data | Fetch player from OSRS hiscores via axios             |
| `fetchLeaguePointRankings` | none           | `boolean`    | Scrape hiscores with puppeteer for rank thresholds    |
| `updateDiscordRoles`       | none           | `number`     | Update all users' Discord roles to match current rank |
| `updateLeagueUsers`        | none           | `boolean`    | Fetch all users' league points from hiscores          |
| `postLeagueRankings`       | none           | `number`     | Fetch & post ranking stats to statistics channel      |
