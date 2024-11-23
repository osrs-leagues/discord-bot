import { RequestHandler } from 'express';
import { Challenge } from '../../../../database';
import {
  GetChallengesResponse,
  GetChallengesRequest,
} from './challenges.types';
import {
  paginateRequest,
  paginateResponse,
} from '../../../utils/pagination.utils';
import { SerializerResponse } from '../../../types';
import { filterRequest } from '../../../utils/filtering.utils';
import challengeSerializer from './challenges.serializer';

/**
 * GET /api/v1/challenges
 */
export const getChallenges: RequestHandler<
  object,
  GetChallengesResponse,
  GetChallengesRequest
> = async (req, res) => {
  const { count, rows: administrators } = await Challenge.findAndCountAll({
    ...paginateRequest<Challenge>(req.query),
    ...filterRequest<Challenge>(req.query),
  });

  res.status(200).json(
    paginateResponse<SerializerResponse<Challenge>>(
      req.body,
      administrators.map((administrator) =>
        challengeSerializer.serialize(administrator),
      ),
      count,
    ),
  );
};
