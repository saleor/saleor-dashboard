import { render, screen } from "@testing-library/react";

import { AssignPickerListLoading } from "./AssignPickerListLoading";
import { shouldShowAssignPickerListLoading } from "./shouldShowAssignPickerListLoading";

describe("AssignPickerListLoading", () => {
  it("renders the loading throbber", () => {
    // Act
    render(<AssignPickerListLoading />);

    // Assert
    expect(screen.getByTestId("assign-picker-list-loading")).toBeInTheDocument();
  });
});

describe("shouldShowAssignPickerListLoading", () => {
  it("returns true only while loading with an empty list", () => {
    // Assert
    expect(shouldShowAssignPickerListLoading(true, 0)).toBe(true);
    expect(shouldShowAssignPickerListLoading(true, 3)).toBe(false);
    expect(shouldShowAssignPickerListLoading(false, 0)).toBe(false);
  });
});
