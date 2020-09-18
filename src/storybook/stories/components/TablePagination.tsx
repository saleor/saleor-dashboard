import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TablePagination from "@saleor/components/TablePagination";
import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "../../CardDecorator";
import Decorator from "../../Decorator";

storiesOf("Generics / TablePagination", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("no previous / next page", () => (
    <ResponsiveTable>
      <TablePagination
        colSpan={1}
        hasNextPage={false}
        hasPreviousPage={false}
        onPreviousPage={undefined}
        onNextPage={undefined}
      />
    </ResponsiveTable>
  ))
  .add("previous page available", () => (
    <ResponsiveTable>
      <TablePagination
        colSpan={1}
        hasNextPage={false}
        hasPreviousPage={true}
        onPreviousPage={undefined}
        onNextPage={undefined}
      />
    </ResponsiveTable>
  ))
  .add("next page available", () => (
    <ResponsiveTable>
      <TablePagination
        colSpan={1}
        hasNextPage={true}
        hasPreviousPage={false}
        onPreviousPage={undefined}
        onNextPage={undefined}
      />
    </ResponsiveTable>
  ))
  .add("both previous and next pages are available", () => (
    <ResponsiveTable>
      <TablePagination
        colSpan={1}
        hasNextPage={true}
        hasPreviousPage={true}
        onPreviousPage={undefined}
        onNextPage={undefined}
      />
    </ResponsiveTable>
  ));
