import React, { ReactNode } from "react";

import { isSelected } from "../lists";

export interface DisplayColumnProps<TColumn extends string = string> {
  displayColumns: TColumn[];
  column: TColumn;
  children: ReactNode;
}

const DisplayColumn = ({ displayColumns, children, column }: DisplayColumnProps) => {
  const display = React.useMemo(
    () => isSelected(column, displayColumns, (a, b) => a === b),
    [column, displayColumns],
  );

  return <>{display && children}</>;
};

DisplayColumn.displayName = "DisplayColumn";
export default DisplayColumn;
