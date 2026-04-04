# Turtle Commands Implementation Plan

## Overview

Add a collectible turtle image system: moderators add turtle images with rarities, and anyone can roll a random turtle. Rarer turtles appear less often, but one is always returned.

---

## Phase 1: Database — Turtle Model & Migration

### Step 1: Create `Turtle` model

- **File**: `src/database/models/Turtle.ts` (new)
- Extend `InitializableModel<Turtle>` following `DMTicket.ts` pattern
- Schema:

| Column               | Type    | Constraints                      |
| -------------------- | ------- | -------------------------------- |
| `id`                 | BIGINT  | PK, auto-increment               |
| `name`               | STRING  | nullable (optional display name) |
| `image_url`          | STRING  | not null                         |
| `rarity_numerator`   | INTEGER | not null, default 1              |
| `rarity_denominator` | INTEGER | not null                         |
| `added_by`           | STRING  | nullable (Discord user ID)       |
| `createdAt`          | DATE    | auto                             |
| `updatedAt`          | DATE    | auto                             |

- Empty `initializeAssociations()`

### Step 2: Create migration

- **File**: `src/database/migrations/{timestamp}-create-turtle.ts` (new)
- Standard `createTable<Turtle>('Turtle', {...})` / `dropTable('Turtle')` pattern

### Step 3: Register model

- **File**: `src/database/models/index.ts`
- Add `Turtle` to the `models` array and named exports

---

## Phase 2: Commands & Message Embed

### Step 4: Create `add_turtle` command

- **File**: `src/discord/interactions/commands/add_turtle.ts` (new)
- **Roles**: `[Role.Administrator, Role.Moderator]`
- **Channels**: `channelGroups.STAFF`
- **Options**:
  - `rarity` (string, required): Format "X/Y" (e.g., "1/50")
  - `image` (string, optional): Direct URL to the turtle image
  - `message_link` (string, optional): Discord message link to extract image from
  - `name` (string, optional): Display name for the turtle
- **Execute logic**:
  1. Require at least one of `image` or `message_link` — reply with ephemeral error if neither provided
  2. If `message_link` provided, parse channel/message IDs from the link (`https://discord.com/channels/{guild}/{channel}/{message}`), fetch the message via `interaction.client.channels.fetch(channelId)` → `channel.messages.fetch(messageId)`, and extract the first attachment or embed image URL
  3. Parse rarity string with regex `/^(\d+)\/(\d+)$/` — validate numerator > 0, denominator > 0, numerator ≤ denominator
  4. Validate image URL with `new URL()` check
  5. Create `Turtle` record in DB
  6. Reply with ephemeral confirmation including the turtle name/rarity

### Step 5: Create `turtle` command

- **File**: `src/discord/interactions/commands/turtle.ts` (new)
- **Roles**: none (anyone can use)
- **Channels**: `channelGroups.BOT_COMMANDS`
- **No options**
- **Execute logic**:
  1. Fetch all turtles from DB (`Turtle.findAll()`)
  2. If none exist, reply with "No turtles available yet!"
  3. Perform weighted random selection (see Phase 3)
  4. Send a follow-up with the turtle embed (non-ephemeral so everyone sees it)

### Step 6: Create turtle message embed

- **File**: `src/discord/messages/turtle.ts` (new)
- Pure factory function: `getTurtleMessage({ turtle: Turtle }): MessageEmbed`
- Display turtle image via `.setImage(image_url)`
- Show name (if set) and rarity in the embed description/footer

### Step 7: Register commands

- **File**: `src/discord/interactions/commands/index.ts`
- Import both commands, add to `commandData` array

---

## Phase 3: Rarity Algorithm

Weighted random selection that normalizes rarity fractions so a turtle is **always** returned:

1. For each turtle, compute `weight = rarity_numerator / rarity_denominator`
2. Sum all weights → `totalWeight`
3. Generate `roll = Math.random() * totalWeight`
4. Iterate turtles, accumulating weights; return the turtle where cumulative weight exceeds `roll`

### Example

| Turtle   | Rarity | Weight |
| -------- | ------ | ------ |
| Turtle A | 1/100  | 0.01   |
| Turtle B | 1/3    | 0.333  |

- `totalWeight` = 0.343
- P(A) = 0.01 / 0.343 ≈ **2.9%**
- P(B) = 0.333 / 0.343 ≈ **97.1%**

Relative rarities are preserved while guaranteeing a result.

---

## Phase 4: Testing

- **File**: `src/__tests__/turtle.test.ts` (new)
- Test cases:
  - Weighted selection with a single turtle always returns that turtle
  - Weighted selection with multiple turtles respects relative probabilities (statistical test over many iterations)
  - Rarity parsing correctly handles valid formats ("1/50", "3/10")
  - Rarity parsing rejects invalid formats ("0/50", "abc", "3/0", "5/3")

---

## Phase 5: Deployment

1. `yarn build` — TypeScript compiles without errors
2. `yarn lint` — No violations
3. `yarn test` — Existing + new tests pass
4. `yarn commands` — Deploy slash commands to Discord
5. Manual test: `/add_turtle` to add images, `/turtle` to roll

---

## Design Decisions

### Image storage via URL string (not file upload)

`@discordjs/builders` v0.11 does not have `addAttachmentOption()`. Images are stored as URLs. Two input methods are supported:

- **Direct URL**: Moderator pastes any persistent image URL (Imgur, external host, etc.)
- **Message link**: Moderator posts an image in Discord, copies the message link, and passes it to the command — the bot extracts the attachment URL automatically

> **Note**: Discord CDN attachment URLs may expire. External hosting (Imgur, etc.) is recommended for permanence when using direct URLs. Message link extraction is convenient but the resulting CDN URL may eventually expire.

### Rarity as numerator + denominator columns

Two integer columns rather than a float — preserves exact fractions and avoids floating-point precision issues during selection.

### `turtle` uses non-ephemeral reply

So the whole channel sees the rolled turtle.

### No `list_turtles` / `remove_turtle` in initial scope

Can be added as follow-up work.

---

## Files Changed

| File                                                   | Status   |
| ------------------------------------------------------ | -------- |
| `src/database/models/Turtle.ts`                        | New      |
| `src/database/migrations/{timestamp}-create-turtle.ts` | New      |
| `src/database/models/index.ts`                         | Modified |
| `src/discord/interactions/commands/add_turtle.ts`      | New      |
| `src/discord/interactions/commands/turtle.ts`          | New      |
| `src/discord/messages/turtle.ts`                       | New      |
| `src/discord/interactions/commands/index.ts`           | Modified |
| `src/__tests__/turtle.test.ts`                         | New      |

---

## Future Considerations

- `remove_turtle` command for cleaning up expired URLs
- `list_turtles` command with pagination for viewing all available turtles
- Duplicate URL prevention (unique constraint on `image_url`)
- Channel scope: currently `channelGroups.BOT_COMMANDS` — could open to `channelGroups.ALL`
