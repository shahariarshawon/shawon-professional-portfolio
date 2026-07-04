export type TMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

export type TApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: TMeta;
};