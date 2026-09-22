import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { FilterEventEmitter } from "./EventEmitter";
import { Filters } from "./Filters";
import { type Row } from "./types";

const intersectionObserverMock = (): { observe: () => null; unobserve: () => null } => ({
  observe: (): null => null,
  unobserve: (): null => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

const locale = {
  WHERE: "Where",
  AND: "And",
};

const channelRow = (dependsOn: string[]): Row => ({
  value: { label: "Channel", value: "channel", type: "channel" },
  isAttribute: false,
  constraint: { dependsOn, removable: false, disabled: ["left", "condition"] },
  condition: {
    options: [],
    selected: {
      value: "",
      conditionValue: { type: "text", label: "is", value: "input-1" },
    },
  },
});

const filterRow = (value: string, label: string): Row => ({
  value: { label, value, type: value },
  isAttribute: false,
  condition: {
    options: [],
    selected: {
      value: "",
      conditionValue: { type: "number", label: "is", value: "input-2" },
    },
  },
});

const renderFilters = (value: Array<Row | string>): void => {
  render(
    <Wrapper>
      <Filters value={value} leftOptions={[]} emitter={new FilterEventEmitter()} locale={locale} />
    </Wrapper>,
  );
};

const follows = (earlier: HTMLElement, later: HTMLElement): boolean =>
  (earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

describe("Filters constraint hint", () => {
  it("squeezes the info icon in before Channel on the same row as And", () => {
    // Arrange // Act
    renderFilters([filterRow("price", "Price"), "AND", channelRow(["price"])]);

    // Assert
    const and = screen.getByText("And");
    const hint = screen.getByTestId("constraint-reason-2");
    const channel = screen.getByTestId("left-2");

    expect(hint).toHaveAccessibleName("Needed for filtering on Price");
    expect(follows(and, hint)).toBe(true);
    expect(follows(hint, channel)).toBe(true);
  });

  it("places the icon before a leading Channel selector", () => {
    // Arrange // Act
    renderFilters([channelRow(["price"]), "AND", filterRow("price", "Price")]);

    // Assert
    const where = screen.getByText("Where");
    const hint = screen.getByTestId("constraint-reason-0");
    const channel = screen.getByTestId("left-0");

    expect(hint).toHaveAccessibleName("Needed for filtering on Price");
    expect(follows(where, hint)).toBe(true);
    expect(follows(hint, channel)).toBe(true);
  });
});
