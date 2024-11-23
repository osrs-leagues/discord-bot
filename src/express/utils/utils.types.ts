export type PaginatedRequest = {
  pagination?: {
    amountPerPage?: number;
    page?: number;
  };
};

export type PaginatedResponse<T> = {
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  results: T[];
  totalPages: number;
};

export enum FilterParam {
  EndsWith = 'endsWith',
  Equal = 'eq',
  GreaterThan = 'gt',
  GreaterThanEqual = 'gte',
  LessThan = 'lt',
  LessThanEqual = 'lte',
  Like = 'is',
  NotBetween = 'notBetween',
  NotEqual = 'ne',
  NotIn = 'notIn',
  NotLike = 'notLike',
  Or = 'or',
  Substring = 'substring',
  Within = 'in',
}

export type FilterRequest<T> = {
  filter?: {
    [key in keyof T]?: {
      [key in FilterParam]?: any;
    };
  };
};
