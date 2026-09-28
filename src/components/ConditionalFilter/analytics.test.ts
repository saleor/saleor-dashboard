import { getAnalyticsFilterKeys } from "./analytics";
import { Condition } from "./FilterElement/Condition";
import { ExpressionValue, FilterElement } from "./FilterElement/FilterElement";

describe("getAnalyticsFilterKeys", () => {
  it("extracts filter keys without values from nested filter groups", () => {
    // Arrange
    const statusFilter = new FilterElement(
      new ExpressionValue("status", "Status", "status"),
      Condition.createEmpty(),
      false,
    );
    const channelFilter = new FilterElement(
      new ExpressionValue("channel", "Channel", "channel"),
      Condition.createEmpty(),
      false,
    );

    // Act
    const result = getAnalyticsFilterKeys([statusFilter, "AND", [channelFilter]]);

    // Assert
    expect(result).toEqual(["status", "channel"]);
  });
});
