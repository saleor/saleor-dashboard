import { CompactSelection, type GridSelection } from "@glideapps/glide-data-grid";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, type RenderResult } from "@testing-library/react";
import { type ReactElement } from "react";
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

interface DatagridHarnessProps {
  rows: number;
  selection: GridSelection;
  onRowSelectionChange: (rowsId: number[], clearSelection: () => void) => void;
  onControlledSelectionChange?: (selection: GridSelection | undefined) => void;
}

const DatagridHarness = ({
  rows,
  selection,
  onRowSelectionChange,
  onControlledSelectionChange = jest.fn(),
}: DatagridHarnessProps): ReactElement => {
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
        onControlledSelectionChange={onControlledSelectionChange}
        onRowSelectionChange={onRowSelectionChange}
      />
    </DatagridChangeStateContext.Provider>
  );
};

const renderDatagrid = (props: DatagridHarnessProps): RenderResult =>
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

  it("does not rewrite the grid selection while loading so a refetch can restore it", () => {
    // Arrange - products report 1 placeholder row while disabled/loading
    const onRowSelectionChange = jest.fn();
    const onControlledSelectionChange = jest.fn();

    // Act
    renderDatagrid({
      rows: 1,
      selection: selectionOf(0, 1, 2, 3, 7, 19),
      onRowSelectionChange,
      onControlledSelectionChange,
    });

    // Assert - report is clamped to avoid a crash, selection itself is left intact
    expect(onRowSelectionChange).toHaveBeenCalledWith([0], expect.any(Function));
    expect(onControlledSelectionChange).not.toHaveBeenCalled();
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
