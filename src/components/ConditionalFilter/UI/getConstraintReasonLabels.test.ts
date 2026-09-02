import { getConstraintReasonLabels } from "./getConstraintReasonLabels";
import { type Row } from "./types";

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

describe("getConstraintReasonLabels", () => {
  it("returns labels of present dependents in constraint order", () => {
    // Arrange
    const channel = channelRow(["price", "isPublished", "isAvailable"]);
    const rows: Array<Row | string> = [
      filterRow("isAvailable", "Is available"),
      "AND",
      filterRow("price", "Price"),
      "AND",
      channel,
    ];

    // Act
    const labels = getConstraintReasonLabels(channel, rows);

    // Assert
    expect(labels).toEqual(["Price", "Is available"]);
  });

  it("returns an empty list when the row is not a locked dependency", () => {
    // Arrange
    const price = filterRow("price", "Price");

    // Act // Assert
    expect(getConstraintReasonLabels(price, [price])).toEqual([]);
  });
});
