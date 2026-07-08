import { render, screen } from "@testing-library/react";

import { AssignPickerListEmptyState } from "./AssignPickerListEmptyState";

describe("AssignPickerListEmptyState", () => {
  it("renders the empty state message", () => {
    // Act
    render(<AssignPickerListEmptyState>No products available</AssignPickerListEmptyState>);

    // Assert
    expect(screen.getByTestId("assign-picker-list-empty")).toBeInTheDocument();
    expect(screen.getByText("No products available")).toBeInTheDocument();
  });
});
