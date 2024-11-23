import { FindOptions } from 'sequelize';

import { PaginatedRequest, PaginatedResponse } from './utils.types';

const DEFAULT_PER_PAGE = 25;
const DEFAULT_PAGE = 1;

export const paginateRequest = <T>(
  request: PaginatedRequest,
): FindOptions<T> => {
  const { amountPerPage = DEFAULT_PER_PAGE, page = DEFAULT_PAGE } =
    request.pagination ?? {};

  return {
    offset: amountPerPage * (page - 1),
    limit: amountPerPage,
  };
};

export const paginateResponse = <T>(
  request: PaginatedRequest,
  rows: T[],
  count: number,
): PaginatedResponse<T> => {
  const { amountPerPage = DEFAULT_PER_PAGE, page = DEFAULT_PAGE } =
    request.pagination ?? {};
  const totalPages = Math.ceil(count / (amountPerPage ?? 1));
  return {
    currentPage: page,
    nextPage: page === totalPages ? null : page + 1,
    previousPage: page === 1 ? null : page - 1,
    results: rows,
    totalPages: totalPages,
  };
};
