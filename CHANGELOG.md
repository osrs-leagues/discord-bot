# @osrs-leagues/discord-bot

## 2.13.3

### Patch Changes

- c7ac98d: Fix hiscore index for leagues points; Set update users job to 2 hours

## 2.13.2

### Patch Changes

- e0b1126: Add cooldwon to turtle command in all channels. Restrict usage to turtles channel.

## 2.13.1

### Patch Changes

- a81ef96: Update turtle command permissions
- 1466add: Refactor turtle log message tests and update item display logic
- 63a76b6: Adjust turtle rarities

## 2.13.0

### Minor Changes

- 036de47: Add DM ticketing system
- 715db22: Add support for Turtles
- 3576a19: Add caching support for Turtles and related commands

### Patch Changes

- 6060178: Add support for turtle clog response padding
- 0b9b607: Use PAT_GITHUB_TOKEN for push-main token
- 545bd80: Exempt testing channels from turtle command cooldowns
- 380d832: Condense turtle clog response
- 04d4a65: Fix ChallengeCard flaky test caused by concurrent SQLite writes
- 2db5ae4: Restrict turtle commands to mods & staff channels
- 45c037b: Make command and select menu responses ephemeral for permission errors

## 2.12.0

### Minor Changes

- 04e8a5d: Add Demonic Pacts League

## 2.11.0

### Minor Changes

- 362ab0f: Add copilot instructions

### Patch Changes

- 5ffb726: Add additional banned emoji
- 3c9443d: Fix changeset release

## 2.10.0

### Minor Changes

- 9c2c395: Add reverse_approval command
- f41f0d9: Add banned emoji reaction listener
- 0947be6: Update GitHub Actions workflows to use latest actions versions and improve deployment process

### Patch Changes

- e95143c: Update GitHub Actions workflow permissions and fix GITHUB_TOKEN reference
- c33b83f: Add Heroku CLI installation step to deployment workflows

## 2.9.3

### Patch Changes

- 6aa8aaa: Update raging echoes command to be local

## 2.9.2

### Patch Changes

- 95a4fc9: Update updateRoles and updateUsers to rely on config.current_league_active
- 95a4fc9: Replace CURRENT_LEAGUE_STARTED with config.current_league_active

## 2.9.1

### Patch Changes

- 4cf29a4: Change Challenge description column to TEXT

## 2.9.0

### Minor Changes

- 5158544: Use deferred reply for all interactions that use await

### Patch Changes

- 5158544: Fix remove league roles crashing if role does not exist

## 2.8.3

### Patch Changes

- bc07bfe: Wrap all commands in try-catch and conditional interaction response

## 2.8.2

### Patch Changes

- 047be4c: Disallow duplicate relic selection for Reloaded relic

## 2.8.1

### Patch Changes

- c689ad7: Remove Reloaded prefix from relic name in random_relics command

## 2.8.0

### Minor Changes

- 4b0096f: Add random_relics command
- 4b0096f: Add random_combat_masteries command

## 2.7.1

### Patch Changes

- e2f7e36: league_name should use leagueNameBronze executor if the league has not started
- d67f994: Fix production deployments on Github release publishes.

## 2.7.0

### Minor Changes

- 8cf0304: Add edit_challenge command
- 8d5338c: Add view_challenge command
- 45562dc: Update regions command to add individial region roles rather than combo roles
- 4e8d28d: Add Raging Echoes League
- b7a5395: Add support for Sage's challenges
- 822561f: Add refresh_challenge_cache command
- 3310e9a: Add delete_challenge command
- 822561f: Add create_challenge command
- 3e782a2: Add challenge_statistics command to show totals for completed challenge cards and raffles
- b7a5395: Add support for database migration and seeding
- 95d2949: Add random regions command
- a7bfeec: Added raffle support for Sage's Challenge
- b7a5395: Add support for database tests
- b3d0273: Add accept and reject challenge commands
- 16f81ad: approveChallenge and rejectChallenge will now just @ the user in the approval channel instead of DMing them. Personalised messages for Master and Grandmaster tiers when approved.
- a166b6d: Add increment_reroll command

### Patch Changes

- ca492cb: Fix the variable used for stage and production database urls in sequelize config
- 02a0e69: Create a DiscordUser entry if it does not exist during ChallengeCard creation
- 4e8d28d: Add current league started boolean to choose remote vs bronze command
- 79a4ff6: Update remove region roles command to remove individual roles rather than combo
- 822561f: Remove challenge from cache when deleting
- 02a0e69: Disallow duplicate challenge selection during challenge card rerolls.
- 6d28ad8: Replace NUMBER type with TINYINT to support MySQL
- b3d0273: Remove all awaits from interaction responses
- eacd06c: Fix imports in challenges and raffles
- 4e8d28d: Replace hard-coded discord league colummn in league name commands
- 4e8d28d: Add migrate to Procfile

## 2.6.0

### Minor Changes

- a497ad9: Separate hiscore fetching and discord role updating jobs

### Patch Changes

- a497ad9: Add additional safeguards for interactions

## 2.5.0

### Minor Changes

- f9363f8: Improvements to updating all league users

## 2.4.4

### Patch Changes

- b94e63e: Fetch discord roles if they are not in the cache

## 2.4.3

### Patch Changes

- ec8121b: Enable remote commands

## 2.4.2

### Patch Changes

- 936a05b: Fix undefined interaction in commands and select menus
- 05358a5: Add league static point threshold
- 05358a5: Optimize setting league ranks

## 2.4.1

### Patch Changes

- 94a0698: Remove role restrictions on league_name and trailblazer_reloaded_name

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
