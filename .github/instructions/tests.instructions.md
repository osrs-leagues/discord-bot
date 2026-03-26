---
applyTo: '**/*.test.ts'
---

# Test Instructions

## Test Framework

Jest 27 with ts-jest preset. Tests run against a real SQLite database (not mocked).

## Test Setup

- `jest.setup.ts`: Loads `dotenv/config` (empty setup file)
- `jest.database.ts`: Initializes database and loads challenge cache in `beforeAll`; closes DB connection in `afterAll`
- The `pretest` script recreates the SQLite DB, runs all migrations and seeds before every test run

## Test File Location

- Co-located `__tests__/` directories next to source files
- Top-level domain tests: `src/__tests__/{module}.test.ts`
- Model tests: `src/database/models/__tests__/{Model}.test.ts`
- Action tests: `src/discord/actions/__tests__/{action}.test.ts`
- Command tests: `src/discord/interactions/commands/__tests__/{command}.test.ts`
- Utility tests: `src/discord/actions/setRegionComboRole/__tests__/setRegionComboRole.utils.test.ts`

## Naming

- Test files: `{module}.test.ts`
- Describe blocks: module or function name
- Test cases: descriptive sentences starting with "should" or describing expected behavior

## Patterns

### Domain Logic Tests (database-backed)

```typescript
import { ChallengeDifficulty } from '../database';
import * as challenges from '../challenges';

describe('challenges', () => {
  describe('generateNewChallenges', () => {
    test('generateNewChallenges should exclude challenge ids', () => {
      const challenges = challenges.generateNewChallenges(
        ChallengeDifficulty.NOVICE,
        [],
        [excludeId1, excludeId2],
      );
      expect(challenges).not.toContain(excludeId1);
    });
  });
});
```

### Pure Function Tests (no database)

```typescript
import { getRelicEmoji } from '../relics';

describe('relics', () => {
  it('should return the emoji name for a relic', () => {
    expect(getRelicEmoji('Power Miner')).toBe('echopowerminer');
  });
});
```

### Model Tests

Test seed data population and model behavior:

```typescript
import DiscordUser from '../DiscordUser';

describe('DiscordUser', () => {
  test('seed should populate', async () => {
    const user = await DiscordUser.findByPk('1234');
    expect(user.twisted_name).toBe('test');
  });
});
```

### Action Tests (mock Discord interactions)

Mock `CommandInteraction` as a plain object with `jest.fn()` methods:

```typescript
import { CommandInteraction } from 'discord.js';

test('it should perform the action', async () => {
  const interaction = {
    followUp: jest.fn(),
    editReply: jest.fn(),
  } as unknown as CommandInteraction;

  const result = await myAction(interaction, userId, difficulty);
  expect(result).toBe(true);
  expect(interaction.editReply).toHaveBeenCalledWith('Expected message');
});
```

Use `as unknown as CommandInteraction` (with `@ts-ignore` if needed) to avoid mocking the full discord.js types.

### Test Data Setup

Use `beforeAll` for creating test-specific DB records; reference `challengeCache` for seeded data:

```typescript
beforeAll(async () => {
  await DiscordUser.create({ user_id: 'test_user' });
  const challenges = challengeCache.challenges.filter(
    (c) => c.difficulty === ChallengeDifficulty.NOVICE,
  );
  await ChallengeCard.create({
    challengeOneId: challenges[0]?.id,
    // ...
  });
});
```

## Assertions

- `expect(value).toBe(expected)` for primitives
- `expect(array).toHaveLength(n)` for array length
- `expect(array).not.toContain(value)` for exclusion
- `expect(array).toContainEqual(object)` for object inclusion
- `expect(array).toEqual([...])` for exact array match
- `expect(fn).toHaveBeenCalledWith(args)` for mock verification
- `expect(value).toBeDefined()` for existence checks
