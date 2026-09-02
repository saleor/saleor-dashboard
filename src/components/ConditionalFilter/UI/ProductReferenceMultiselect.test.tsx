import { fireEvent, render, screen } from "@testing-library/react";

import { type FilterEventEmitter } from "./EventEmitter";
import { ProductReferenceMultiselect } from "./ProductReferenceMultiselect";
import { type MultiselectOperator } from "./types";

const intersectionObserverMock = () => ({
  observe: () => null,
  unobserve: () => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

const createEmitter = (): FilterEventEmitter =>
  ({
    changeRightOperator: jest.fn(),
    inputChangeRightOperator: jest.fn(),
    focusRightOperator: jest.fn(),
    blurRightOperator: jest.fn(),
    scrollEndRightOperator: jest.fn(),
  }) as unknown as FilterEventEmitter;

const selected: MultiselectOperator = {
  conditionValue: { type: "multiselect", label: "in", value: "input-2" },
  loading: false,
  value: [],
  options: [
    {
      label: "Apple Juice",
      value: "apple",
      slug: "apple-juice",
      productThumbnailUrl: "https://example.com/apple.png",
    },
    {
      label: "Alpine Oversized Hoodie",
      value: "hoodie",
      slug: "alpine-hoodie",
    },
  ],
};

describe("ConditionalFilter / UI / ProductReferenceMultiselect", () => {
  it("renders product thumbnails next to names in the list", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <ProductReferenceMultiselect
        index={0}
        selected={selected}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole("combobox"));

    // Assert
    expect(screen.getByRole("option", { name: "Apple Juice" })).toBeInTheDocument();
    expect(screen.getByTestId("product-reference-thumbnail")).toHaveAttribute(
      "src",
      "https://example.com/apple.png",
    );
    expect(screen.getByRole("option", { name: "Alpine Oversized Hoodie" })).toBeInTheDocument();
  });

  it("selects a product from the list", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <ProductReferenceMultiselect
        index={0}
        selected={selected}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    // Act
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Apple Juice" }));

    // Assert
    expect(emitter.changeRightOperator).toHaveBeenCalledWith(0, [
      expect.objectContaining({
        value: "apple",
        label: "Apple Juice",
        productThumbnailUrl: "https://example.com/apple.png",
      }),
    ]);
  });

  it("renders selected pills with a thumbnail", () => {
    // Arrange
    const emitter = createEmitter();
    const apple = selected.options[0];

    render(
      <ProductReferenceMultiselect
        index={0}
        selected={{ ...selected, value: [apple] }}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    // Assert
    expect(screen.getByTestId("product-reference-chip")).toHaveAttribute("title", "Apple Juice");
    expect(screen.getByTestId("product-reference-thumbnail")).toHaveAttribute(
      "src",
      "https://example.com/apple.png",
    );
  });
});
