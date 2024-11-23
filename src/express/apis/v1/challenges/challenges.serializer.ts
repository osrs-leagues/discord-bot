import { Challenge } from '../../../../database';
import { Serializer } from '../../../types';

const challengeSerializer: Serializer<Challenge> = {
  serialize(challenge: Challenge) {
    return {
      id: challenge.id,
      description: challenge.description,
      difficulty: challenge.difficulty,
      createdAt: challenge.createdAt,
      updatedAt: challenge.updatedAt,
      regionOneId: challenge.regionOneId,
      regionTwoId: challenge.regionTwoId,
    };
  },
};

export default challengeSerializer;
