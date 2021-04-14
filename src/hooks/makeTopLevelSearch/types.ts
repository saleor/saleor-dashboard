export interface CommonSearchOpts {
  onLoadMore?: () => void;
  loading?: boolean;
  data?: {
    search?: {
      totalCount?: number;
      pageInfo?: {
        hasNextPage: boolean;
      };
    };
  };
}
