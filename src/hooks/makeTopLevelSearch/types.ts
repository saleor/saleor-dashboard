export interface CommonSearchOpts {
  onLoadMore?: () => void;
  loading?: boolean;
  data?: {
    search?: {
      pageInfo?: {
        hasNextPage: boolean;
      };
    };
  };
}
