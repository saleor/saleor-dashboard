import { CompactSelection, type GridSelection } from "@glideapps/glide-data-grid";
import { ThemeWrapper } from "@test/themeWrapper";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Datagrid } from "./Datagrid";
import { DatagridChangeStateContext, useDatagridChangeState } from "./hooks/useDatagridChange";

// Glide's DataEditor is never rendered here: `loading` short-circuits the output to a
// throbber while the hooks, and so the row selection effect, still run.
const availableColumns = [{ id: "name", title: "Name", width: 200 }] as const;

const selectionOf = (...rows: number[]): GridSelection => ({
  rows: rows.reduce((acc, row) => acc.add(row), CompactSelection.empty()),
  columns: CompactSelection.empty(),
});

const DatagridHarness = ({
  rows,
  selection,
  onRowSelectionChange,
}: {
  rows: number;
  selection: GridSelection;
  onRowSelectionChange: (rowsId: number[], clearSelection: () => void) => void;
}) => {
  const datagrid = useDatagridChangeState();

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        loading
        rows={rows}
        availableColumns={availableColumns}
        emptyText="No rows"
        getCellContent={() => ({}) as never}
        getCellError={() => false}
        menuItems={() => []}
        selectionActions={() => null}
        controlledSelection={selection}
        onControlledSelectionChange={jest.fn()}
        onRowSelectionChange={onRowSelectionChange}
      />
    </DatagridChangeStateContext.Provider>
  );
};

const renderDatagrid = (props: {
  rows: number;
  selection: GridSelection;
  onRowSelectionChange: (rowsId: number[], clearSelection: () => void) => void;
}) =>
  render(
    <MemoryRouter>
      <ThemeWrapper>
        <DatagridHarness {...props} />
      </ThemeWrapper>
    </MemoryRouter>,
  );

describe("Datagrid row selection reporting", () => {
  it("reports the selected rows to the parent", () => {
    // Arrange
    const onRowSelectionChange = jest.fn();

    // Act
    renderDatagrid({
      rows: 5,
      selection: selectionOf(1, 2),
      onRowSelectionChange,
    });

    // Assert
    expect(onRowSelectionChange).toHaveBeenCalledWith([1, 2], expect.any(Function));
  });

  it("does not report rows past the last one when the list shrank under a live selection", () => {
    // Arrange - rows per page was lowered to 3 while rows 0-19 stayed selected
    const onRowSelectionChange = jest.fn();

    // Act
    renderDatagrid({
      rows: 3,
      selection: selectionOf(0, 1, 2, 3, 7, 19),
      onRowSelectionChange,
    });

    // Assert
    expect(onRowSelectionChange).toHaveBeenCalledWith([0, 1, 2], expect.any(Function));
  });

  it("reports no rows when the list emptied out under a live selection", () => {
    // Arrange
    const onRowSelectionChange = jest.fn();

    // Act
    renderDatagrid({
      rows: 0,
      selection: selectionOf(1, 2),
      onRowSelectionChange,
    });

    // Assert
    expect(onRowSelectionChange).toHaveBeenCalledWith([], expect.any(Function));
  });
});
