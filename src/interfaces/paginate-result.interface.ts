export interface PaginateResult<T> {
  result: T[];
  total: number;
  page: number;
  pages: number;
}
