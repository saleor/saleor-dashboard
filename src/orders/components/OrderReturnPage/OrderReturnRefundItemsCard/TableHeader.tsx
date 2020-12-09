import { TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

interface TableHeaderProps {
  isRefund?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ isRefund = false }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <FormattedMessage
            defaultMessage="Product"
            description="table column header"
          />
        </TableCell>
        <TableCell align="right">
          <FormattedMessage
            defaultMessage="Price"
            description="table column header"
          />
        </TableCell>
        {isRefund ? 
        <TableCell align="right">
          <FormattedMessage
            defaultMessage="Return"
            description="table column header"
          />
        </TableCell>
        <TableCell align="center">
          <FormattedMessage
            defaultMessage="Refunded Qty"
            description="table column header"
          />
        </TableCell> 
        :
        <TableCell align="right">
        <FormattedMessage
          defaultMessage="Total"
          description="table column header"
        />
      </TableCell>
      <TableCell align="center">
        <FormattedMessage
          defaultMessage="Replace"
          description="table column header"
        />
      </TableCell> 
    }
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
