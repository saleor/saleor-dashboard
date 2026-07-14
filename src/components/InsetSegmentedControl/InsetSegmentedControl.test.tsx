import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InsetSegmentedControl } from "./InsetSegmentedControl";

describe("InsetSegmentedControl", () => {
  it("calls onChange when a segment is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <InsetSegmentedControl
        aria-label="View mode"
        value="timeline"
        onChange={onChange}
        options={[
          { value: "timeline", label: "Timeline", testId: "timeline-segment" },
          { value: "matrix", label: "Line matrix", testId: "matrix-segment" },
        ]}
      />,
    );

    // Act
    await user.click(screen.getByTestId("matrix-segment"));

    // Assert
    expect(onChange).toHaveBeenCalledWith("matrix");
  });

  it("marks the active segment with aria-pressed", () => {
    // Arrange // Act
    render(
      <InsetSegmentedControl
        aria-label="View mode"
        value="matrix"
        onChange={jest.fn()}
        options={[
          { value: "timeline", label: "Timeline", testId: "timeline-segment" },
          { value: "matrix", label: "Line matrix", testId: "matrix-segment" },
        ]}
      />,
    );

    // Assert
    expect(screen.getByTestId("timeline-segment")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("matrix-segment")).toHaveAttribute("aria-pressed", "true");
  });
});
