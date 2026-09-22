import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { FilterEventEmitter } from "./EventEmitter";
import { RightOperator } from "./RightOperator";

const intersectionObserverMock = (): { observe: () => null; unobserve: () => null } => ({
  observe: (): null => null,
  unobserve: (): null => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

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

  it("uses the product picker for the static Products filter before options load", () => {
    // Arrange & Act
    render(
      <RightOperator
        index={0}
        selected={{
          conditionValue: { type: "multiselect", label: "in", value: "input-2" },
          loading: true,
          value: [],
          options: [],
        }}
        emitter={new FilterEventEmitter()}
        error={false}
        helperText=""
        disabled={false}
        layout="panel"
        leftType="products"
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("right-0").closest("[data-product-reference]")).toBeInTheDocument();
  });

  it("uses the product picker when options carry product fields", () => {
    // Arrange & Act
    render(
      <RightOperator
        index={0}
        selected={{
          conditionValue: { type: "multiselect", label: "in", value: "input-2" },
          loading: false,
          value: [],
          options: [
            {
              label: "Apple Juice",
              value: "apple",
              slug: "apple-juice",
              productName: "Apple Juice",
              productThumbnailUrl: "https://example.com/apple.png",
            },
          ],
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
    expect(screen.getByTestId("right-0").closest("[data-product-reference]")).toBeInTheDocument();
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
