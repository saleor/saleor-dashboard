import { fireEvent, render, screen } from "@testing-library/react";

import SortableChipsField from "./SortableChipsField";
import * as useActiveDragId from "./useActiveDragId";
import * as useSortableDragOver from "./useSortableDragOver";

jest.mock("./useActiveDragId");
jest.mock("./useSortableDragOver");

describe("SortableChipsField", () => {
  const mockValues = [
    { value: "1", label: "Value 1" },
    { value: "2", label: "Value 2" },
  ];
  const onValueDelete = jest.fn();
  const onValueReorder = jest.fn();

  beforeEach(() => {
    (useActiveDragId.useActiveDragId as jest.Mock).mockReturnValue({
      activeId: null,
      handleDragStart: jest.fn(),
      handleDragEnd: jest.fn(),
    });
    (useSortableDragOver.useSortableDragOver as jest.Mock).mockReturnValue({
      handleDragOver: jest.fn(),
    });
    onValueDelete.mockClear();
    onValueReorder.mockClear();
  });

  it("should render chips for each value", () => {
    // Arrange
    render(
      <SortableChipsField
        values={mockValues}
        onValueDelete={onValueDelete}
        onValueReorder={onValueReorder}
      />,
    );
    // Assert
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Value 2")).toBeInTheDocument();
  });

  it("should display helper text on error", () => {
    // Arrange
    render(
      <SortableChipsField
        values={mockValues}
        onValueDelete={onValueDelete}
        onValueReorder={onValueReorder}
        error
        helperText="This is an error"
      />,
    );
    // Assert
    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("should call onValueDelete when a chip is removed", () => {
    // Arrange
    render(
      <SortableChipsField
        values={mockValues}
        onValueDelete={onValueDelete}
        onValueReorder={onValueReorder}
      />,
    );

    // Act
    const closeButtons = screen.getAllByTestId("button-close");

    fireEvent.click(closeButtons[0]);

    // Assert
    expect(onValueDelete).toHaveBeenCalledWith("1");
  });

  it("should disable close buttons when loading", () => {
    // Arrange
    render(
      <SortableChipsField
        values={mockValues}
        onValueDelete={onValueDelete}
        onValueReorder={onValueReorder}
        loading
      />,
    );

    // Assert
    const closeButtons = screen.getAllByTestId("button-close");

    expect(closeButtons[0]).toBeDisabled();
    expect(closeButtons[1]).toBeDisabled();
  });

  it("should expand hidden chips when the more button is clicked", () => {
    // Arrange
    const longValues = [
      { value: "1", label: "Value 1" },
      { value: "2", label: "Value 2" },
      { value: "3", label: "Value 3" },
      { value: "4", label: "Value 4" },
      { value: "5", label: "Value 5" },
      { value: "6", label: "Value 6" },
      { value: "7", label: "Value 7" },
    ];

    render(
      <SortableChipsField
        values={longValues}
        onValueDelete={onValueDelete}
        onValueReorder={onValueReorder}
      />,
    );

    // Assert
    expect(screen.getByRole("button", { name: "+{count} more" })).toBeInTheDocument();
    expect(screen.queryByText("Value 6")).not.toBeInTheDocument();
    expect(screen.queryByText("Value 7")).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "+{count} more" }));

    // Assert
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    expect(screen.getByText("Value 6")).toBeInTheDocument();
    expect(screen.getByText("Value 7")).toBeInTheDocument();
  });

  it("should collapse chips when the show less button is clicked", () => {
    // Arrange
    const longValues = [
      { value: "1", label: "Value 1" },
      { value: "2", label: "Value 2" },
      { value: "3", label: "Value 3" },
      { value: "4", label: "Value 4" },
      { value: "5", label: "Value 5" },
      { value: "6", label: "Value 6" },
      { value: "7", label: "Value 7" },
    ];

    render(
      <SortableChipsField
        values={longValues}
        onValueDelete={onValueDelete}
        onValueReorder={onValueReorder}
      />,
    );

    // Act - Expand first
    fireEvent.click(screen.getByRole("button", { name: "+{count} more" }));

    // Assert - All chips are visible
    expect(screen.getByText("Value 6")).toBeInTheDocument();
    expect(screen.getByText("Value 7")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();

    // Act - Collapse
    fireEvent.click(screen.getByRole("button", { name: "Show less" }));

    // Assert - Hidden chips are not visible, button text changed back
    expect(screen.getByRole("button", { name: "+{count} more" })).toBeInTheDocument();
    expect(screen.queryByText("Value 6")).not.toBeInTheDocument();
    expect(screen.queryByText("Value 7")).not.toBeInTheDocument();
  });
});
