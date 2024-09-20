import { createChannelFilterElement } from "./utils";

describe("ProductListDatagrid utils", () => {
  describe("createChannelFilterElement", () => {
    it("should return FilterElement with cleared constraint", () => {
      // Arrange & Act
      const result = createChannelFilterElement();

      // Assert
      expect(result).toMatchObject({
        condition: {
          loading: false,
          options: [{ label: "is", type: "select", value: "input-5" }],
        },
        constraint: undefined,
        loading: false,
        value: {
          label: "Channel",
          type: "channel",
          value: "channel",
        },
      });
    });
  });
});
