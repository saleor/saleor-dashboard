import { FILTER_CONTROL_ID_PREFIX, getFilterControlId } from "./filterControlId";

describe("getFilterControlId", () => {
  it("builds a stable id per filter control", () => {
    // Arrange & Act & Assert
    expect(getFilterControlId("right", 0)).toBe(`${FILTER_CONTROL_ID_PREFIX}-right-0`);
    expect(getFilterControlId("attribute", 2)).toBe(`${FILTER_CONTROL_ID_PREFIX}-attribute-2`);
  });
});
