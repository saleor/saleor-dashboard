import { fireEvent, render, screen } from "@testing-library/react";

import { type FilterEventEmitter } from "./EventEmitter";
import { SwatchAttributeMultiselect } from "./SwatchAttributeMultiselect";
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
      label: "Dark Orange",
      value: "orange",
      slug: "dark-orange",
      swatchColor: "#c45c26",
    },
    {
      label: "Plaid",
      value: "plaid",
      slug: "plaid",
      swatchFileUrl: "https://example.com/plaid.png",
    },
  ],
};

describe("ConditionalFilter / UI / SwatchAttributeMultiselect", () => {
  it("renders color and file swatches next to names in the list", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <SwatchAttributeMultiselect
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
    expect(screen.getByRole("option", { name: "Dark Orange" })).toBeInTheDocument();
    expect(screen.getAllByTestId("swatch-preview")[0]).toHaveStyle({
      backgroundColor: "#c45c26",
      width: "20px",
      height: "20px",
    });
    expect(screen.getByRole("option", { name: "Plaid" })).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toHaveAttribute(
      "src",
      "https://example.com/plaid.png",
    );
  });

  it("selects a swatch from the list", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <SwatchAttributeMultiselect
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
    fireEvent.click(screen.getByRole("option", { name: "Dark Orange" }));

    // Assert
    expect(emitter.changeRightOperator).toHaveBeenCalledWith(0, [
      expect.objectContaining({
        value: "orange",
        label: "Dark Orange",
        swatchColor: "#c45c26",
      }),
    ]);
  });

  it("renders selected pills with a swatch", () => {
    // Arrange
    const emitter = createEmitter();
    const orange = selected.options[0];

    render(
      <SwatchAttributeMultiselect
        index={0}
        selected={{ ...selected, value: [orange] }}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    // Assert
    expect(screen.getByTestId("swatch-attribute-chip")).toHaveAttribute("title", "Dark Orange");
    expect(screen.getByTestId("swatch-preview")).toHaveStyle({ backgroundColor: "#c45c26" });
  });
});
