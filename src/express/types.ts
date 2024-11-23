export type SerializerResponse<ModelType> = {
  [key in keyof Partial<ModelType>]:
    | string
    | number
    | boolean
    | object
    | undefined;
};

export type Serializer<ModelType> = {
  serialize(model: ModelType): SerializerResponse<ModelType>;
};

export type ApiError = {
  title: string;
  description: string;
  status: number;
};

export type ErrorResponse = {
  error: ApiError;
};
