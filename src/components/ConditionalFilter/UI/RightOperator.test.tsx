import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { FilterEventEmitter } from "./EventEmitter";
import { RightOperator } from "./RightOperator";

const rangeCondition = {
  label: "between",
  value: "between",
} as const;

describe("RightOperator", () => {
  it("keeps date-between start and end on one row", () => {
    // Arrange & Act
    render(
      <RightOperator
        index={0}
        selected={{
          value: ["", ""],
          conditionValue: { ...rangeCondition, type: "date.range" },
        }}
        emitter={new FilterEventEmitter()}
        error={false}
        helperText=""
        disabled={false}
        layout="panel"
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getAllByTestId("right-0")[0].closest("[data-range-layout]")).toHaveAttribute(
      "data-range-size",
      "date",
    );
  });

  it("keeps datetime-between start and end on one row", () => {
    // Arrange & Act
    render(
      <RightOperator
        index={1}
        selected={{
          value: ["", ""],
          conditionValue: { ...rangeCondition, type: "datetime.range" },
        }}
        emitter={new FilterEventEmitter()}
        error={false}
        helperText=""
        disabled={false}
        layout="panel"
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getAllByTestId("right-1")[0].closest("[data-range-layout]")).toHaveAttribute(
      "data-range-size",
      "datetime",
    );
  });
});
