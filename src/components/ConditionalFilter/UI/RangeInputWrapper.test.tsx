import { render, screen } from "@testing-library/react";

import { RangeInputWrapper } from "./RangeInputWrapper";

describe("RangeInputWrapper", () => {
  it("marks date ranges as inline so start and end can sit on one row", () => {
    // Arrange & Act
    render(
      <RangeInputWrapper inline>
        <span data-test-id="range-child">range</span>
      </RangeInputWrapper>,
    );

    // Assert
    expect(screen.getByTestId("range-child").parentElement).toHaveAttribute(
      "data-range-layout",
      "inline",
    );
  });
});
