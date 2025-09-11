import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import { SortableChip } from "./SortableChip";

describe("SortableChip", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("should render the label", () => {
    // Arrange
    renderWithRouter(<SortableChip label="Test Chip" />);
    // Assert
    expect(screen.getByText("Test Chip")).toBeInTheDocument();
  });

  it("should render as a link when url is provided", () => {
    // Arrange
    const { container } = renderWithRouter(<SortableChip label="Test Chip" url="/test-url" />);

    // Assert
    expect(container.querySelector("a")).toHaveAttribute("href", "/test-url");
  });

  it("should call onClose when close button is clicked", () => {
    // Arrange
    const onClose = jest.fn();

    renderWithRouter(<SortableChip label="Test Chip" onClose={onClose} />);

    // Act
    fireEvent.click(screen.getByTestId("button-close"));

    // Assert
    expect(onClose).toHaveBeenCalled();
  });

  it("should disable close button when loading", () => {
    // Arrange
    renderWithRouter(<SortableChip label="Test Chip" loading />);
    // Assert
    expect(screen.getByTestId("button-close")).toBeDisabled();
  });

  it("should apply grabbing cursor style when isDragged is true", () => {
    // Arrange
    renderWithRouter(<SortableChip label="Test Chip" isDragged />);

    // Assert
    const dragHandle = screen.getByTestId("button-drag-handle");

    expect(dragHandle).toHaveStyle("cursor: grabbing");
  });
});
