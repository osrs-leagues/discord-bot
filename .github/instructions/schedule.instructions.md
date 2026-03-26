---
applyTo: src/schedule/**
---

# Schedule / Jobs Instructions

Jobs are cron-scheduled wrappers around tasks, with per-environment intervals.

## Job Pattern

```typescript
import { Job } from '../types';
import { myTask } from '../../tasks';

const myJob: Job = {
  enabled: true, // Set false to disable entirely
  interval: {
    test: undefined, // No scheduling in test
    development: undefined, // Usually undefined for dev
    stage: '0 0 * * *', // Cron expression for staging
    production: '0 */1 * * *', // Cron expression for production
  },
  runOnStart: false, // Run immediately on bot startup?
  execute: () => {
    try {
      myTask.execute();
    } catch (error) {
      console.error('Error executing myJob.', error);
    }
  },
};

export default myJob;
```

## Job Type

```typescript
type Job = {
  enabled: boolean;
  interval: { [key in Environment]: string | undefined };
  runOnStart: boolean;
  execute: () => void;
};
```

Where `Environment = 'test' | 'development' | 'stage' | 'production'`.

## Conventions

- **Default export** only — one job per file in `src/schedule/jobs/`
- **Register** in `src/schedule/jobs/index.ts` with named imports and re-exports
- The job is also added to the `jobs` array in `src/schedule/index.ts`
- `interval` values are standard cron expressions; use `undefined` to skip an environment
- Jobs that should only run when a league is active: `enabled: config.current_league_active`
- `execute` is synchronous (fire-and-forget) — the job body calls `task.execute()` which returns a Promise but the job doesn't await it unless needed
- Error handling in `execute`: try-catch with `console.error`
- Offset production intervals by minutes to avoid all jobs firing at :00 (e.g., `'2 */6 * * *'` = every 6h at minute 2)
