# @osrs-leagues/discord-bot

## 2.0.1

### Patch Changes

- 1dd9a07: Fix typos in role config variables.

## 2.0.0

### Major Changes

- 898d206: Add jobs & tasks for updating all discord user roles for the current league.
- 7536423: Add support for channel & role restrictions on commands.
- 2198e4a: Add /shattered_relics_name and /league_name to set discord roles for the Shattered Relics league.
- baba7b4: Setup project to use typescript, eslint, prettier, lint-staged+husky, jest testing. Setup Github Workflows & changeset releasing.
- 64a1fac: Add support for sequelize and define the DiscordUser model.
- f489d6f: Add support for discord.js version 13.
- e91fcc3: Add support for scheduled jobs & task execution; Add league rankings fetch job & task.
- 97ecc40: Add /trailblazer_name command for setting Trailblazer League discord role.
- e39fe14: Add /twisted_name command for setting Twisted League discord role.
