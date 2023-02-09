import Skeleton from "@dashboard/components/Skeleton";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { commonMessages } from "@dashboard/intl";
import { TableBody, TableCell } from "@material-ui/core";
import { ResponsiveTable } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

export const ProductListDatagridSkeleton = () => (
  <ResponsiveTable>
    <TableHead colSpan={2} disabled={false} items={[]}>
      <TableCellHeader>
        <FormattedMessage {...commonMessages.name} />
      </TableCellHeader>
      <TableCellHeader>
        <FormattedMessage {...commonMessages.type} />
      </TableCellHeader>
      <TableCellHeader>
        <FormattedMessage {...commonMessages.description} />
      </TableCellHeader>
      <TableCellHeader></TableCellHeader>
    </TableHead>
    <TableBody>
      <TableRowLink href={""}>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
      </TableRowLink>
    </TableBody>
  </ResponsiveTable>
);
