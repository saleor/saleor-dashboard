import { TableCell } from "@material-ui/core";
import Wrapper from "@test/wrapper";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { SortableTableBody } from "./SortableTableBody";
import { SortableTableRow } from "./SortableTableRow";

describe("SortableTableBody", () => {
  it("renders sortable rows without the legacy sortable-hoc context API", () => {
    // Arrange
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    // Act
    render(
      <table>
        <SortableTableBody onSortEnd={jest.fn()}>
          <SortableTableRow id="attr-1" index={0}>
            <TableCell>Color</TableCell>
          </SortableTableRow>
          <SortableTableRow id="attr-2" index={1}>
            <TableCell>Size</TableCell>
          </SortableTableRow>
        </SortableTableBody>
      </table>,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getAllByTestId("button-drag-handle")).toHaveLength(2);
    expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(/legacy contextTypes API/);

    consoleError.mockRestore();
  });

  it("prevents native text selection when starting a drag from the handle", () => {
    // Arrange
    render(
      <table>
        <SortableTableBody onSortEnd={jest.fn()}>
          <SortableTableRow id="attr-1" index={0}>
            <TableCell>Color</TableCell>
          </SortableTableRow>
        </SortableTableBody>
      </table>,
      { wrapper: Wrapper },
    );

    const handle = screen.getByTestId("button-drag-handle").parentElement;

    if (!handle) {
      throw new Error("Expected drag handle wrapper");
    }

    // Act
    const event = createEvent.pointerDown(handle);

    fireEvent(handle, event);

    // Assert
    expect(event.defaultPrevented).toBe(true);
  });

  it("navigates when a linked row is clicked without dragging", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ["/list"] });

    render(
      <Router history={history}>
        <table>
          <SortableTableBody onSortEnd={jest.fn()}>
            <SortableTableRow id="attr-1" href="/attributes/attr-1">
              <TableCell>Color</TableCell>
            </SortableTableRow>
          </SortableTableBody>
        </table>
      </Router>,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByText("Color"));

    // Assert
    expect(history.location.pathname).toBe("/attributes/attr-1");
  });

  it("calls row onClick when the row is clicked without dragging", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <table>
        <SortableTableBody onSortEnd={jest.fn()}>
          <SortableTableRow id="value-1" onClick={onClick}>
            <TableCell>Red</TableCell>
          </SortableTableRow>
        </SortableTableBody>
      </table>,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByText("Red"));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
