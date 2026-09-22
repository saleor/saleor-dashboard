import { fireEvent, render, screen } from "@testing-library/react";

import { type FilterEventEmitter } from "./EventEmitter";
import { type MultiselectOperator } from "./types";
import { VariantReferenceMultiselect } from "./VariantReferenceMultiselect";

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
      label: "Darko Polo\nM",
      value: "polo-m",
      slug: "polo-m",
      productName: "Darko Polo",
      variantName: "M",
      productThumbnailUrl: "https://example.com/polo.png",
    },
    {
      label: "Darko Polo\nS",
      value: "polo-s",
      slug: "polo-s",
      productName: "Darko Polo",
      variantName: "S",
    },
    {
      label: "Monospace Tee\nL",
      value: "tee-l",
      slug: "tee-l",
      productName: "Monospace Tee",
      variantName: "L",
    },
  ],
};

describe("ConditionalFilter / UI / VariantReferenceMultiselect", () => {
  it("groups variants under a product name that is not selectable", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <VariantReferenceMultiselect
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
    expect(screen.getByText("Darko Polo").closest("button")).toBeNull();
    expect(screen.getByTestId("variant-reference-thumbnail")).toHaveAttribute(
      "src",
      "https://example.com/polo.png",
    );
    expect(screen.getByRole("option", { name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "M" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "L" })).toBeInTheDocument();
  });

  it("does not select a variant with Enter while the menu is closed", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <VariantReferenceMultiselect
        index={0}
        selected={selected}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    // Act
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });

    // Assert
    expect(emitter.changeRightOperator).not.toHaveBeenCalled();
  });

  it("selects the highlighted variant with the keyboard", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <VariantReferenceMultiselect
        index={0}
        selected={selected}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    const combobox = screen.getByRole("combobox");

    // Act
    fireEvent.click(combobox);
    fireEvent.keyDown(combobox, { key: "ArrowDown" });
    fireEvent.keyDown(combobox, { key: "Enter" });

    // Assert — groups sort Darko Polo first (M, then S)
    expect(emitter.changeRightOperator).toHaveBeenCalledWith(0, [
      expect.objectContaining({
        value: "polo-s",
        label: "Darko Polo\nS",
      }),
    ]);
  });

  it("highlights visual group order, not selected-first options", () => {
    // Arrange — selected Tee is prepended; groups still list Polo first
    const emitter = createEmitter();
    const tee = selected.options[2];
    const poloS = selected.options[1];

    render(
      <VariantReferenceMultiselect
        index={0}
        selected={{
          ...selected,
          value: [tee],
          options: [poloS],
        }}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    const combobox = screen.getByRole("combobox");

    // Act
    fireEvent.click(combobox);
    fireEvent.keyDown(combobox, { key: "Enter" });

    // Assert
    expect(emitter.changeRightOperator).toHaveBeenCalledWith(0, [
      tee,
      expect.objectContaining({
        value: "polo-s",
        label: "Darko Polo\nS",
      }),
    ]);
  });

  it("renders selected pills as image and size with the product name in the title", () => {
    // Arrange
    const emitter = createEmitter();
    const poloM = selected.options[0];

    render(
      <VariantReferenceMultiselect
        index={0}
        selected={{ ...selected, value: [poloM] }}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />,
    );

    // Assert
    expect(screen.getByTestId("variant-reference-chip")).toHaveAttribute("title", "Darko Polo · M");
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("Darko Polo")).toBeInTheDocument();
    expect(screen.getByTestId("variant-reference-thumbnail")).toHaveAttribute(
      "src",
      "https://example.com/polo.png",
    );
  });

  it("emits the two-line pill when a variant is selected", () => {
    // Arrange
    const emitter = createEmitter();

    render(
      <VariantReferenceMultiselect
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
    fireEvent.click(screen.getByRole("option", { name: "S" }));

    // Assert
    expect(emitter.changeRightOperator).toHaveBeenCalledWith(0, [
      expect.objectContaining({
        value: "polo-s",
        label: "Darko Polo\nS",
        productName: "Darko Polo",
        variantName: "S",
      }),
    ]);
  });
});
