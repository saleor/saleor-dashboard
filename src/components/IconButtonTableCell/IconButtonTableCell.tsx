import { TableCell } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui-next";
import * as React from "react";

import { stopPropagation } from "../../misc";

interface IconButtonTableCellProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

const IconButtonTableCell = (props: IconButtonTableCellProps) => {
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
