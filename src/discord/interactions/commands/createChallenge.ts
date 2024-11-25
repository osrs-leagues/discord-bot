import { SlashCommandBuilder } from '@discordjs/builders';
import { channelGroups } from '../../Channel';
import Role from '../../Role';
import { Command } from './types';
import { ChallengeDifficulty, Region } from '../../../database';
import {
  challengeCache,
  createChallenge,
  getDifficultyName,
} from '../../../challenges';

const createChallengeCommand: Command = {
  channels: channelGroups.STAFF,
  roles: [Role.Administrator, Role.Tester],
  data: new SlashCommandBuilder()
    .setName('create_challenge')
    .setDescription('Create a challenge.')
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('The description of the challenge.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('difficulty')
        .setDescription('The difficulty of the challenge to approve')
        .addChoices(
          Object.values(ChallengeDifficulty)
            .map((difficulty) => [
              getDifficultyName(difficulty as ChallengeDifficulty),
              difficulty.toString(),
            ])
            .filter<[name: string, value: string]>(
              (difficulty): difficulty is [string, string] =>
                difficulty[0] !== 'Unknown',
            ),
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('region_one')
        .setDescription('The first region of the challenge.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('region_two')
        .setDescription('The second region of the challenge.'),
    ),
  execute: async (interaction) => {
    try {
      const description = interaction.options.getString('description');
      const difficulty = parseInt(interaction.options.getString('difficulty'));
      const regionOneName = interaction.options.getString('region_one');
      const regionTwoName = interaction.options.getString('region_two');
      let regionOne: Region;
      let regionTwo: Region;
      if (regionOneName) {
        regionOne = challengeCache.regions.find(
          (region) => region.name === regionOneName,
        );
        if (!regionOne) {
          interaction.reply({
            content: 'Region One not found.',
            ephemeral: true,
          });
          return;
        }
      }
      if (regionTwoName) {
        regionTwo = challengeCache.regions.find(
          (region) => region.name === regionTwoName,
        );
        if (!regionTwo) {
          interaction.reply({
            content: 'Region Two not found.',
            ephemeral: true,
          });
          return;
        }
      }
      const challenge = await createChallenge(
        description,
        difficulty,
        regionOne?.id,
        regionTwo?.id,
      );
      interaction.reply({
        content: `Challenge created with ID: ${challenge.id}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: 'An error occurred while deleting the challenge.',
        ephemeral: true,
      });
    }
  },
};

export default createChallengeCommand;
