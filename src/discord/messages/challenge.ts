import { MessageEmbed } from 'discord.js';

import {
  challengeCache,
  getDifficultyName,
  getEmbedColour,
} from '../../challenges';
import { Challenge } from '../../database';

type GetChallengeCardMessageParams = {
  challenge: Challenge;
};

const getChallengeMessage = ({
  challenge,
}: GetChallengeCardMessageParams): MessageEmbed => {
  const embedColour = getEmbedColour(challenge.difficulty);
  const regions = challengeCache.regions.filter(
    (region) =>
      region.id === challenge.regionOneId ||
      region.id === challenge.regionTwoId,
  );

  return new MessageEmbed()
    .setColor(embedColour)
    .setTitle(`Challenge ${challenge.id}`)
    .setDescription(
      `**Description:**\n${
        challenge.description
      } \n\n**Difficulty:**\n${getDifficultyName(
        challenge.difficulty,
      )} \n\n**Regions:**\n${regions.map((region) => region.name).join(', ')}`,
    );
};

export default getChallengeMessage;
