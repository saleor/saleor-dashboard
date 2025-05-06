import { TableCell } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";

import { stopPropagation } from "../../misc";

export interface IconButtonTableCellProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const IconButtonTableCell: React.FC<IconButtonTableCellProps> = props => {
  const { children, className, disabled, onClick } = props;

  return (
    <TableCell className={className}>
      <Button
        data-test-id="delete-button"
        variant="secondary"
        disabled={disabled}
        onClick={stopPropagation(onClick)}
        icon={children}
      />
    </TableCell>
  );
};

IconButtonTableCell.displayName = "IconButtonTableCell";
export default IconButtonTableCell;
