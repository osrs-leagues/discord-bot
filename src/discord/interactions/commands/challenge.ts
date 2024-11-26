import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, MessageActionRow, MessageButton } from 'discord.js';
import { Command } from './types';
import { channelGroups } from '../../Channel';
import {
  Challenge,
  ChallengeCardStatus,
  ChallengeDifficulty,
} from '../../../database/models';
import * as challenges from '../../../challenges';
import getChallengeCardMessage from '../../messages/challengeCard';

const challengeCommand: Command = {
  channels: channelGroups.SAGE_CHALLENGE,
  data: new SlashCommandBuilder()
    .setName('challenge')
    .setDescription("Creates and displays the Sage's Challenge Card!"),

  execute: async (interaction) => {
    await interaction.deferReply();
    try {
      const member = interaction.member as GuildMember;
      const userId = member.id;
      const userDisplayName = member.displayName;
      const userRoles = member.roles.cache.map((role) => role.name);

      // Fetch user's challenge main record
      let challengeCard = await challenges.loadChallengeCard(userId);
      let currentDifficultyTier: ChallengeDifficulty =
        ChallengeDifficulty.NOVICE;
      let currentChallengeStatus: ChallengeCardStatus =
        ChallengeCardStatus.STARTED;
      let challengeList: Challenge[] = [];
      let rerollsRemaining = 0;

      if (challengeCard) {
        currentDifficultyTier = challengeCard.difficulty;
        currentChallengeStatus = challengeCard.status;

        // Check if user has completed Grandmaster
        if (
          currentDifficultyTier === ChallengeDifficulty.GRANDMASTER &&
          currentChallengeStatus === ChallengeCardStatus.COMPLETED
        ) {
          interaction.editReply(
            "You have completed the Sage's Challenge event! There's nothing left to do.",
          );
          return;
        }
        if (
          currentChallengeStatus === ChallengeCardStatus.STARTED ||
          currentChallengeStatus === ChallengeCardStatus.APPROVAL
        ) {
          await challenges.verifyCardChallenges(challengeCard, userRoles);
          rerollsRemaining = challengeCard.rerollsRemaining;
          challengeList = challenges.existingChallengesToList(
            challengeCard,
            currentDifficultyTier,
          );
        } else if (currentChallengeStatus === ChallengeCardStatus.COMPLETED) {
          // Promote to next tier
          const nextTier = challenges.getNextDifficultyTier(
            currentDifficultyTier,
          );
          rerollsRemaining = challengeCard.rerollsRemaining;
          currentDifficultyTier = nextTier;
          currentChallengeStatus = ChallengeCardStatus.STARTED;

          // Region role requirement check based on difficulty
          const regionRoleCount = challenges.getRegionRoleCount(userRoles);
          const requiredRegionRoles = challenges.getChallengeCardEligibility(
            currentDifficultyTier,
          );

          if (regionRoleCount < requiredRegionRoles) {
            interaction.editReply({
              content: `You need at least ${requiredRegionRoles} region role(s) to generate challenges for ${challenges.getDifficultyName(
                nextTier,
              )} difficulty. Please acquire the necessary region roles and try again.`,
            });
            return;
          }

          // Generate new challenges for the next tier
          challengeList = challenges.generateNewChallenges(
            currentDifficultyTier,
            userRoles,
          );

          challengeCard = await challenges.createChallengeCard(
            userId,
            currentDifficultyTier,
            challengeList,
            rerollsRemaining,
          );
        }
      } else {
        // Region role requirement check based on difficulty
        const regionRoleCount = challenges.getRegionRoleCount(userRoles);
        const requiredRegionRoles = challenges.getChallengeCardEligibility(
          ChallengeDifficulty.NOVICE,
        );

        if (regionRoleCount < requiredRegionRoles) {
          interaction.editReply(
            `You need at least ${requiredRegionRoles} region role(s) to generate challenges for Novice difficulty. Please acquire the necessary region roles and try again.`,
          );
          return;
        }
        // New user: Create Novice challenges and ChallengeMain entry
        challengeList = challenges.generateNewChallenges(
          ChallengeDifficulty.NOVICE,
          userRoles,
        );
        rerollsRemaining = 2;
        // Save Novice challenges
        challengeCard = await challenges.createChallengeCard(
          userId,
          ChallengeDifficulty.NOVICE,
          challengeList,
          rerollsRemaining,
        );
      }

      // Create and send the embedded challenge card message
      const challengeEmbed = getChallengeCardMessage({
        difficulty: currentDifficultyTier,
        userDisplayName: userDisplayName,
        challenges: challengeList,
      });

      // Add "Reroll" button if rerolls are available and not already rerolled
      if (rerollsRemaining > 0 && challengeCard.rerolled === false) {
        const rerollButton = new MessageButton()
          .setCustomId(`reroll ${userId} ${currentDifficultyTier}`)
          .setLabel(`Reroll (${challengeCard.rerollsRemaining} remaining)`)
          .setStyle('PRIMARY');
        const row = new MessageActionRow().addComponents(rerollButton);

        interaction.editReply({
          embeds: [challengeEmbed],
          components: [row],
        });
      } else {
        interaction.editReply({ embeds: [challengeEmbed] });
      }
    } catch (error) {
      console.error('Error executing challenge command: ', error);
      interaction?.editReply(
        'There was an error processing your challenge. Please try again later.',
      );
    }
  },
};

export default challengeCommand;
