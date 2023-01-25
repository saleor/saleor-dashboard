export function makeGetColumnData(
  regexp: RegExp,
): (column: string) => string | null {
  return column => {
    if (!regexp.test(column)) {
      return null;
    }

    return column.match(regexp)[1];
  };
}

export const getColumnAttribute = makeGetColumnData(/^attribute:(.*)/);
export const getColumnChannel = makeGetColumnData(/^channel:(.*)/);
export const getColumnChannelAvailability = makeGetColumnData(
  /^availableInChannel:(.*)/,
);
export const getColumnStock = makeGetColumnData(/^stock:(.*)/);

export const getCurrentRow = (
  rowIndex: number,
  currentIndex: number,
  removedIndexArray: number[],
) =>
  rowIndex ===
  currentIndex + removedIndexArray.filter(r => r <= currentIndex).length;
