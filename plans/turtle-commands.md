# Turtle Commands Implementation Plan

## Overview

Add a collectible turtle image system: moderators add turtle images with rarities, and anyone can roll a random turtle. Rarer turtles appear less often, but one is always returned.

---

## Phase 1: Database — Turtle Model & Migration

### Step 1: Create `Turtle` model

- **File**: `src/database/models/Turtle.ts` (new)
- Extend `InitializableModel<Turtle>` following `DMTicket.ts` pattern
- Schema:

| Column      | Type   | Constraints                                         |
| ----------- | ------ | --------------------------------------------------- |
| `id`        | BIGINT | PK, auto-increment                                  |
| `name`      | STRING | nullable (optional display name)                    |
| `image_url` | STRING | not null                                            |
| `rarity`    | STRING | not null (enum: COMMON, UNCOMMON, RARE, ULTRA_RARE) |
| `added_by`  | STRING | nullable (Discord user ID)                          |
| `createdAt` | DATE   | auto                                                |
| `updatedAt` | DATE   | auto                                                |

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
  - `image_url` (string, required): Externally hosted image URL (e.g., Imgur)
  - `rarity` (string, required): Dropdown choice — Common, Uncommon, Rare, Ultra Rare
  - `name` (string, optional): Display name for the turtle
- **Execute logic**:
  1. Validate `image_url` with `new URL()` check — reply with ephemeral error if invalid
  2. Create `Turtle` record in DB with the selected rarity
  3. Reply with ephemeral confirmation including the turtle name/rarity

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

## Phase 3: Rarity System

### Rarity Categories

Defined as an enum (`TurtleRarity`) with fixed weights:

| Category   | Enum Value   | Weight |
| ---------- | ------------ | ------ |
| Common     | `COMMON`     | 1      |
| Uncommon   | `UNCOMMON`   | 1/10   |
| Rare       | `RARE`       | 1/100  |
| Ultra Rare | `ULTRA_RARE` | 1/500  |

### Weighted Random Selection

A turtle is **always** returned:

1. For each turtle, look up its `weight` from the rarity category
2. Sum all weights → `totalWeight`
3. Generate `roll = Math.random() * totalWeight`
4. Iterate turtles, accumulating weights; return the turtle where cumulative weight exceeds `roll`

### Example

3 Common turtles + 1 Ultra Rare turtle:

| Turtle   | Rarity     | Weight |
| -------- | ---------- | ------ |
| Turtle A | Common     | 1      |
| Turtle B | Common     | 1      |
| Turtle C | Common     | 1      |
| Turtle D | Ultra Rare | 0.002  |

- `totalWeight` = 3.002
- P(each Common) = 1 / 3.002 ≈ **33.3%**
- P(Ultra Rare) = 0.002 / 3.002 ≈ **0.067%** (~1 in 1,500)

Relative rarities are preserved while guaranteeing a result. A Common turtle is always 500x more likely than an Ultra Rare.

---

## Phase 4: Testing

- **File**: `src/__tests__/turtle.test.ts` (new)
- Test cases:
  - Weighted selection with a single turtle always returns that turtle
  - Weighted selection with multiple turtles respects relative probabilities (statistical test over many iterations)
  - All rarity categories map to correct weights
  - Ultra Rare turtles are selected far less frequently than Common turtles

---

## Phase 5: Deployment

1. `yarn build` — TypeScript compiles without errors
2. `yarn lint` — No violations
3. `yarn test` — Existing + new tests pass
4. `yarn commands` — Deploy slash commands to Discord
5. Manual test: `/add_turtle` to add images, `/turtle` to roll

---

## Design Decisions

### Image storage via externally hosted URL

Images are stored as externally hosted URLs (e.g., Imgur). The bot never downloads or re-uploads images — it passes the URL directly to Discord's embed API via `.setImage(url)`, and Discord's client fetches the image from the external host at render time.

This approach was chosen over Discord attachment uploads or message link extraction because Discord CDN URLs include expiring tokens and may break over time. Externally hosted URLs remain permanent as long as the host is live.

### Predefined rarity categories (not free-text fractions)

Four fixed tiers (Common, Uncommon, Rare, Ultra Rare) with weights defined in code. This avoids mod confusion — free-text fractions like "1/50" express relative weight, not absolute probability, so the actual drop rate shifts every time a turtle is added. Predefined categories make rarity immediately understandable and consistent.

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
