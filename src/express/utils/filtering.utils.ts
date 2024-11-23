import { FindOptions, Op } from 'sequelize';

import { FilterParam, FilterRequest } from './utils.types';

const filterOpsMap: { [key in FilterParam]: symbol } = {
  [FilterParam.EndsWith]: Op.endsWith,
  [FilterParam.Equal]: Op.eq,
  [FilterParam.GreaterThan]: Op.gt,
  [FilterParam.GreaterThanEqual]: Op.gte,
  [FilterParam.LessThan]: Op.lt,
  [FilterParam.LessThanEqual]: Op.lte,
  [FilterParam.Like]: Op.like,
  [FilterParam.NotBetween]: Op.notBetween,
  [FilterParam.NotEqual]: Op.ne,
  [FilterParam.NotIn]: Op.notIn,
  [FilterParam.NotLike]: Op.notLike,
  [FilterParam.Or]: Op.or,
  [FilterParam.Substring]: Op.substring,
  [FilterParam.Within]: Op.in,
};

export const filterRequest = <T>(request: FilterRequest<T>): FindOptions<T> => {
  const filter = request?.filter;
  if (!filter) {
    return undefined;
  }
  const sequelizeFilter = Object.keys(filter).reduce<FindOptions<T>>(
    (combined, value) => {
      const filterOpsParam = filter[value as keyof T];
      const filterOps = Object.keys(filterOpsParam)?.[0] as FilterParam;
      if (filterOps) {
        return {
          ...combined,
          [value]: {
            [filterOpsMap[filterOps]]: filterOpsParam[filterOps],
          },
        };
      } else {
        return combined;
      }
    },
    {},
  );
  return sequelizeFilter;
};
