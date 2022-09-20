import { GridCell, Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { booleanCell, moneyCell, numberCell, textCell } from "./cells";
import Datagrid, { GetCellContentOpts } from "./Datagrid";
import { initialData } from "./fixtures";
import { numberCellEmptyValue } from "./NumberCell";

const errors = [{ id: "9", field: "balance" }];

const availableColumns = [
  { title: "ID", id: "uuid", width: 300 },
  { title: "Loaned", id: "loan-active", width: 70 },
  { title: "Loaned Amount", id: "loan", width: 200 },
  { title: "Name", id: "name", width: 200 },
  { title: "Balance", id: "balance", width: 200 },
  { title: "Eye color", id: "eyeColor", width: 200 },
  { title: "Age", id: "age", width: 80 },
] as const;

const DefaultStory: React.FC = () => {
  const getCellContent = React.useCallback(
    (
      [column, row]: Item,
      { changes, getChangeIndex }: GetCellContentOpts,
    ): GridCell => {
      const columnId = availableColumns[column].id;
      const change = changes.current[getChangeIndex(columnId, row)]?.data;
      const dataRow = initialData[row];

      const errorProps = {
        themeOverride: errors.find(
          err => err.id === initialData[row]?.id && err.field === columnId,
        )
          ? {
              accentColor: "#FF0000",
              bgCell: "#FF0000",
            }
          : undefined,
      };

      if (columnId === "loan-active") {
        return {
          ...errorProps,
          ...booleanCell(change ?? dataRow?.loan.active ?? null),
        };
      }

      if (columnId === "loan") {
        return {
          ...errorProps,
          ...moneyCell(
            change?.value ?? dataRow?.loan.amount ?? null,
            dataRow?.loan.currency ?? "USD",
          ),
        };
      }

      if (columnId === "balance") {
        return {
          ...errorProps,
          ...numberCell(change ?? dataRow?.balance ?? numberCellEmptyValue),
        };
      }

      if (columnId === "age") {
        return {
          ...errorProps,
          ...numberCell(change?.value ?? dataRow?.age ?? numberCellEmptyValue),
        };
      }

      const data = change ?? (dataRow ? dataRow[columnId] : "");
      return {
        ...errorProps,
        ...textCell(data),
      };
    },
    [],
  );

  return (
    <div style={{ width: 800, margin: "auto" }}>
      <Datagrid
        addButtonLabel="Add row"
        availableColumns={availableColumns}
        getCellContent={getCellContent}
        menuItems={() => [
          {
            label: "Do something",
            onSelect: () => undefined,
          },
        ]}
        selectionActions={selection => (
          <Button
            variant="tertiary"
            onClick={() =>
              // eslint-disable-next-line no-console
              console.log(selection.map(index => initialData[index]))
            }
          >
            Action 1
          </Button>
        )}
        rows={initialData.length}
      />
    </div>
  );
};

storiesOf("Generics / Datagrid", module)
  .addDecorator(Decorator)
  .add("default", () => <DefaultStory />);
