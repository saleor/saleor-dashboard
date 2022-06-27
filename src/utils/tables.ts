export function getFooterColSpanWithBulkActions(
  arr: any[],
  numberOfColumns: number,
): number {
  if (arr === undefined || arr.length > 0) {
    return numberOfColumns + 1;
  }

  return numberOfColumns;
}
