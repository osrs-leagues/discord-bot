# @osrs-leagues/discord-bot

## 2.4.0

### Minor Changes

- 2c3a6b2: Update the updateDiscordRoles tasks to update tblr points
- 2c3a6b2: Add command to set tblr name

## 2.3.1

### Patch Changes

- 9828338: Test release

## 2.3.0

### Minor Changes

- 3b9ab4b: Add support for multiple interaction types
- 3b9ab4b: Update league rank command responses to use the rank colors
- 3b9ab4b: Add a command to set region roles
- 67c04c5: Add Trailblazer Reloaded hiscores lookup
- 58fff9b: Update dependencies
- 9629e1b: Update Github workflows to deploy stage and production heroku apps
- d549493: Abstract league name commands into local and remote commands
- 920f499: Standardize channels and roles for slash commands
- 67c04c5: Migrate Shattered Relics league lookup to database

## 2.2.1

### Patch Changes

- 92f9740: Add ability to enable/disable jobs. Disable all jobs for end of leagues.

## 2.2.0

### Minor Changes

- 500404e: Add post league rankings job.

## 2.1.2

### Patch Changes

- 9e3e977: Allow jobs to run upon startup.
- 2048c86: Fix the update all discord roles task.

## 2.1.1

### Patch Changes

- 9c68cd3: Fix puppeteer on heroku and fix the league point rankings job.

## 2.1.0

### Minor Changes

- b54095a: Add support for channel listening. Add #imp-spotting channel listener.
- f7c948e: Add remove roles command.

### Patch Changes

- 9d42ad6: Add error boundaries to jobs & tasks.

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
