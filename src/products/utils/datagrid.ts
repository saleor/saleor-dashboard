// @ts-strict-ignore
export function makeGetColumnData(regexp: RegExp): (column: string) => string | null {
  return column => {
    if (!regexp.test(column)) {
      return null;
    }

    return column.match(regexp)[1];
  };
}

export const getColumnAttribute = makeGetColumnData(/^attribute:(.*)/);
export const getColumnChannel = makeGetColumnData(/^channel:(.*)/);
export const getColumnChannelAvailability = makeGetColumnData(/^availableInChannel:(.*)/);
export const getColumnStock = makeGetColumnData(/^warehouse:(.*)/);

export const getColumnName = (column: string) => {
  const splited = column.split(":");
  return splited[0];
};

export const isCurrentRow = (datagridChangeIndex: number, variantIndex: number) =>
  datagridChangeIndex === variantIndex;
