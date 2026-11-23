import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FilterEventEmitter } from "./EventEmitter";
import { Filters } from "./Filters";
import { type Row } from "./types";

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: (): null => null,
  unobserve: (): null => null,
}));

// Same as STATIC_CONDITIONS.numberOfOrders: "is"/"lower" and "greater"/"between" share a
// value, so only the label tells them apart.
const numberOfOrdersConditions: Row["condition"]["options"] = [
  { type: "number", label: "is", value: "input-1" },
  { type: "number", label: "lower", value: "input-1" },
  { type: "number", label: "greater", value: "input-2" },
  { type: "number.range", label: "between", value: "input-2" },
];

const numberOfOrdersRow: Row = {
  value: { label: "Number of orders", value: "numberOfOrders", type: "numberOfOrders" },
  isAttribute: false,
  condition: {
    options: numberOfOrdersConditions,
    selected: {
      value: "",
      conditionValue: { type: "number", label: "is", value: "input-1" },
    },
  },
};

const renderRow = (emitter: FilterEventEmitter): void => {
  render(
    <Wrapper>
      <Filters
        value={[numberOfOrdersRow]}
        leftOptions={[]}
        emitter={emitter}
        locale={{ WHERE: "Where", AND: "And" }}
      />
    </Wrapper>,
  );
};

describe("Filter condition select", () => {
  it.each([
    ["lower", "input-1"],
    ["between", "input-2"],
    ["greater", "input-2"],
  ])("passes on the %s condition when it shares its value with another", async (label, value) => {
    // Arrange
    const emitter = new FilterEventEmitter();
    const changeCondition = jest.spyOn(emitter, "changeCondition");

    renderRow(emitter);

    // Act
    await userEvent.click(screen.getByTestId("condition-0"));
    await userEvent.click(screen.getByRole("option", { name: label }));

    // Assert
    expect(changeCondition).toHaveBeenCalledWith(0, expect.objectContaining({ label, value }));
  });
});
