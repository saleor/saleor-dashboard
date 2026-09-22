import { render, screen } from "@testing-library/react";

import { RangeInputWrapper } from "./RangeInputWrapper";

describe("RangeInputWrapper", () => {
  it("marks date ranges as inline so start and end share a compact row", () => {
    // Arrange & Act
    render(
      <RangeInputWrapper inline>
        <span data-test-id="range-child">range</span>
      </RangeInputWrapper>,
    );

    // Assert
    const wrapper = screen.getByTestId("range-child").parentElement;

    expect(wrapper).toHaveAttribute("data-range-layout", "inline");
    expect(wrapper).toHaveAttribute("data-range-size", "date");
  });

  it("marks datetime ranges with a wider compact size", () => {
    // Arrange & Act
    render(
      <RangeInputWrapper inline compact="datetime">
        <span data-test-id="range-child">range</span>
      </RangeInputWrapper>,
    );

    // Assert
    expect(screen.getByTestId("range-child").parentElement).toHaveAttribute(
      "data-range-size",
      "datetime",
    );
  });
});
