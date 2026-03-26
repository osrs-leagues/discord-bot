---
applyTo: src/discord/actions/**
---

# Discord Actions Instructions

Actions are reusable Discord operations (role management, challenge approval/rejection) that are called by commands, buttons, and listeners.

## Pattern

Each action is a **default-exported async function** with a typed parameter object:

```typescript
export type MyActionParams = {
  member: GuildMember;
  guild: Guild;
  // ... other typed params
};

const myAction = async ({
  member,
  guild,
}: MyActionParams): Promise<ReturnType> => {
  try {
    // Perform Discord API operations
    return result;
  } catch (error) {
    console.error('Error in myAction:', error);
    return undefined; // Graceful fallback
  }
};

export default myAction;
```

## Conventions

- **Default export** only — one action per file
- **Typed parameter objects** for actions with multiple params (use `type` aliases, not interfaces)
- **Error handling**: Always wrap in try-catch with `console.error`. Return `undefined` or `false` on failure — never throw
- **Register** in `src/discord/actions/index.ts` with: `export { default as myAction } from './myAction'`
- Actions that interact with Discord interactions accept `CommandInteraction | ButtonInteraction` as first param
- Use `interaction.editReply()` (assumes caller has already deferred); use `interaction.followUp()` for additional messages
- Log error details with `JSON.stringify()` for debugging: `console.error('Error:', JSON.stringify({ member_id: member.id, ... }), error)`

## Role Management Pattern

When setting roles, always:

1. Try the guild role cache first: `guild.roles.cache.get(roleId)`
2. Fetch from Discord API if not cached: `guild.roles.fetch()`
3. Remove conflicting roles before adding the new one
4. Check if the member already has the role before adding: `member.roles.cache.has(roleToAdd.id)`

## Existing Actions

| Action               | Purpose                                       | Returns             |
| -------------------- | --------------------------------------------- | ------------------- |
| `setLeagueRole`      | Set rank role, remove old ranks               | `Rank \| undefined` |
| `removeLeagueRoles`  | Remove all league rank roles                  | `boolean`           |
| `setRegionRoles`     | Set region roles by name                      | `boolean`           |
| `setRegionComboRole` | Set 3-region combo role (e.g., A/D/Z)         | `Role \| undefined` |
| `approveChallenge`   | Approve challenge card, award raffle tickets  | `boolean`           |
| `rejectChallenge`    | Reject challenge card back to started         | `void`              |
| `reverseApproval`    | Reverse completed card, delete raffle tickets | `boolean`           |
| `setSageRole`        | Award Sage's Master/Grandmaster role          | `void`              |
