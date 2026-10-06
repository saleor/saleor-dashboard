/** The pager is only for moving to another page. A single page has nothing else to show. */
export const paginationHasAnotherPage = (
  hasNextPage?: boolean,
  hasPreviousPage?: boolean,
): boolean => Boolean(hasNextPage || hasPreviousPage);
