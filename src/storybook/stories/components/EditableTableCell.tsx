import { TableBody, TableCell, TableHead } from "@material-ui/core";
import EditableTableCell from "@saleor/components/EditableTableCell";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableRowLink from "@saleor/components/TableRowLink";
import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "../../CardDecorator";
import Decorator from "../../Decorator";

storiesOf("Generics / EditableTableCell", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <ResponsiveTable>
      <TableHead>
        <TableCell>Some header</TableCell>
        <TableCell>Some header</TableCell>
        <TableCell>Some header</TableCell>
      </TableHead>
      <TableBody>
        <TableRowLink>
          <TableCell>Some value</TableCell>
          <EditableTableCell
            value={"Some editable text"}
            onConfirm={() => undefined}
          />
          <TableCell>Some value</TableCell>
        </TableRowLink>
      </TableBody>
    </ResponsiveTable>
  ));
