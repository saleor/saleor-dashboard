import { GridCell, GridCellKind, Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Datagrid from "./Datagrid";
import { initialData } from "./fixtures";
import useDatagridChange from "./useDatagridChange";

const errors = [{ id: "9", field: "balance" }];

const availableColumns = [
  { title: "ID", id: "uuid", width: 300 },
  { title: "Loaned", id: "loan-active", width: 70 },
  { title: "Loaned Amount", id: "loan", width: 200 },
  { title: "Name", id: "name", width: 200 },
  { title: "Balance", id: "balance", width: 200 },
  { title: "Eye color", id: "eyeColor", width: 200 },
  { title: "Age", id: "age", width: 80 }
] as const;

const DefaultStory: React.FC = () => {
  const { changes, onCellEdited, getChangeIndex } = useDatagridChange(
    availableColumns
  );

  const getCellContent = React.useCallback(([column, row]: Item): GridCell => {
    const columnId = availableColumns[column].id;
    const change = changes.current[getChangeIndex(columnId, row)]?.data;

    const baseProps = {
      allowOverlay: true,
      readonly: false,
      themeOverride: errors.find(
        err => err.id === initialData[row].id && err.field === columnId
      )
        ? {
            accentColor: "#FF0000",
            bgCell: "#FF0000"
          }
        : undefined
    };

    if (columnId === "loan-active") {
      const value = change ?? initialData[row].loan.active;
      return {
        ...baseProps,
        allowOverlay: false,
        kind: GridCellKind.Boolean,
        data: value
      };
    }

    if (columnId === "loan") {
      const value = change?.value ?? initialData[row][columnId].amount;
      return {
        ...baseProps,
        kind: GridCellKind.Custom,
        data: {
          kind: "money-cell",
          currency: initialData[row].loan.currency,
          value
        },
        copyData: value
      };
    }

    if (columnId === "balance") {
      const data = change ?? initialData[row][columnId];
      return {
        ...baseProps,
        kind: GridCellKind.Number,
        data,
        displayData: data?.toString()
      };
    }

    if (columnId === "age") {
      const value = change?.value ?? initialData[row][columnId];
      return {
        ...baseProps,
        kind: GridCellKind.Custom,
        data: {
          kind: "number-cell",
          value
        },
        copyData: value
      };
    }

    const data = initialData[row][columnId];
    return {
      ...baseProps,
      kind: GridCellKind.Text,
      data,
      displayData: data
    };
  }, []);

  return (
    <div style={{ width: 800, margin: "auto" }}>
      <Datagrid
        availableColumns={availableColumns}
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
      >
        {selected => (
          <>
            <Button
              variant="tertiary"
              // eslint-disable-next-line no-console
              onClick={() => console.log("action 1", selected)}
            >
              Action 1
            </Button>
            <Button
              variant="tertiary"
              // eslint-disable-next-line no-console
              onClick={() => console.log("action 2", selected)}
            >
              Action 2
            </Button>
          </>
        )}
      </Datagrid>
    </div>
  );
};

storiesOf("Generics / Datagrid", module)
  .addDecorator(Decorator)
  .add("default", () => <DefaultStory />);
