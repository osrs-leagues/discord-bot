import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { commandData } from './discord/commands';
import config from './config';

const rest = new REST({ version: '9' }).setToken(config.discord_bot.token);

rest
  .put(
    Routes.applicationGuildCommands(
      config.discord_bot.application_id,
      config.guild_id,
    ),
    {
      body: commandData.map((command) => command.data.toJSON()),
    },
  )
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
