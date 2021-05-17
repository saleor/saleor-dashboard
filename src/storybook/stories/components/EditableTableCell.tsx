import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import EditableTableCell from "@saleor/components/EditableTableCell";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
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
        <TableRow>
          <TableCell>Some value</TableCell>
          <EditableTableCell
            value={"Some editable text"}
            onConfirm={() => undefined}
          />
          <TableCell>Some value</TableCell>
        </TableRow>
      </TableBody>
    </ResponsiveTable>
  ));
