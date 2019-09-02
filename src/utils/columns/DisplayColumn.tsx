import React from "react";

import { isSelected } from "../lists";

export interface DisplayColumnProps<TColumn extends string = string> {
  displayColumns: TColumn[];
  column: TColumn;
}

const DisplayColumn: React.FC<DisplayColumnProps> = ({
  displayColumns,
  children,
  column
}) => {
  const displayColumn = React.useCallback(
    (column: string) => isSelected(column, displayColumns, (a, b) => a === b),
    [displayColumns]
  );

  return <>{displayColumn(column) && children}</>;
};

DisplayColumn.displayName = "DisplayColumn";
export default DisplayColumn;
