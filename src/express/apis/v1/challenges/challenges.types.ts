import { Challenge } from '../../../../database';
import { ErrorResponse, SerializerResponse } from '../../../types';
import {
  FilterRequest,
  PaginatedRequest,
  PaginatedResponse,
} from '../../../utils/utils.types';

export type GetChallengesRequest = PaginatedRequest & FilterRequest<Challenge>;

export type GetChallengesResponse =
  | PaginatedResponse<SerializerResponse<Challenge>>
  | ErrorResponse;
