import React from "react";

import TableCellHeader, { TableCellHeaderProps } from "../TableCellHeader";

// Workaround because child of <Tooltip /> must be able to hold ref
export const RefTableCellHeader = React.forwardRef<
  unknown,
  TableCellHeaderProps
>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <TableCellHeader innerRef={ref} {...rest}>
      {children}
    </TableCellHeader>
  );
});

RefTableCellHeader.displayName = "RefTableCellHeader";
export default RefTableCellHeader;
