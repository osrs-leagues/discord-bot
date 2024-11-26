import { MessageEmbed } from 'discord.js';

import {
  getChallengeCount,
  getDifficultyName,
  getEmbedColour,
} from '../../challenges';
import { Challenge, ChallengeDifficulty } from '../../database';

type GetChallengeCardMessageParams = {
  difficulty: ChallengeDifficulty;
  userDisplayName: string;
  challenges: Challenge[];
};

const getChallengeCardMessage = ({
  difficulty,
  userDisplayName,
  challenges,
}: GetChallengeCardMessageParams): MessageEmbed => {
  const embedColour = getEmbedColour(difficulty);
  const challengeCount = getChallengeCount(difficulty);

  return new MessageEmbed()
    .setColor(embedColour)
    .setTitle(
      `Sage's ${getDifficultyName(
        difficulty,
      )} Challenge Card for ${userDisplayName}`,
    )
    .setDescription(
      challenges
        .slice(0, challengeCount)
        .map(
          (challenge, index) =>
            `**Challenge ${index + 1}:**\n${challenge.description}`,
        )
        .join('\n\n'),
    );
};

export default getChallengeCardMessage;
