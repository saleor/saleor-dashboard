import {
  orderListPath,
  orderListUrl,
  orderListUrlWithChannel,
  orderListUrlWithCustomerEmail,
  orderListUrlWithCustomerId,
  withOrderFulfillmentDialog,
} from "./urls";

describe("Order URLs", () => {
  describe("orderListUrl", () => {
    it("should return base path when no params provided", () => {
      const result = orderListUrl();

      expect(result).toBe("/orders");
    });

    it("should return base path when params is undefined", () => {
      const result = orderListUrl(undefined);

      expect(result).toBe("/orders");
    });

    it("should build URL with query parameters", () => {
      const params = {
        customer: "test@example.com",
        status: ["UNFULFILLED"],
      };
      const result = orderListUrl(params);

      expect(result).toContain("/orders?");
      expect(result).toContain("customer=test%40example.com");
      expect(result).toContain("status%5B0%5D=UNFULFILLED"); // Arrays are encoded as [0]
    });
  });

  describe("orderListUrlWithCustomerEmail", () => {
    it("should return orderListPath when userEmail is undefined", () => {
      const result = orderListUrlWithCustomerEmail(undefined);

      expect(result).toBe(orderListPath);
    });

    it("should build URL with userEmail filter", () => {
      const userEmail = "test@example.com";
      const result = orderListUrlWithCustomerEmail(userEmail);

      expect(result).toContain("/orders?");
      expect(result).toContain("userEmail");
      expect(result).toContain("test%40example.com");
    });
  });

  describe("orderListUrlWithCustomerId", () => {
    it("should return orderListPath when userId is undefined", () => {
      const result = orderListUrlWithCustomerId(undefined);

      expect(result).toBe(orderListPath);
    });

    it("should build URL with customer filter", () => {
      const userId = "VXNlcjoxMjM=";
      const result = orderListUrlWithCustomerId(userId);

      expect(result).toContain("/orders?");
      expect(result).toContain("customer");
      expect(result).toContain(encodeURIComponent(userId));
    });
  });

  describe("orderListUrlWithChannel", () => {
    it("should return orderListPath when channel is undefined", () => {
      // Arrange
      // Act
      const result = orderListUrlWithChannel(undefined);

      // Assert
      expect(result).toBe(orderListPath);
    });

    it("should build URL with channel filter using channel slug", () => {
      // Arrange
      const channel = {
        id: "Q2hhbm5lbDox",
        name: "Channel-USD",
        slug: "channel-usd",
      };

      // Act
      const result = orderListUrlWithChannel(channel);

      // Assert
      expect(result).toContain("/orders?");
      expect(result).toContain("channel");
      expect(result).toContain("channel-usd");
    });
  });
});

describe("withOrderFulfillmentDialog", () => {
  const focusedParams = { lineId: "line-1" };

  it.each([
    ["edit-fulfillment", "fulfillment-1"],
    ["cancel-fulfillment", "fulfillment-2"],
    ["approve-fulfillment", "fulfillment-3"],
  ] as const)("preserves lineId when opening %s", (action, fulfillmentId) => {
    // Arrange // Act
    const result = withOrderFulfillmentDialog(focusedParams, action, fulfillmentId);

    // Assert
    expect(result).toEqual({
      lineId: "line-1",
      action,
      id: fulfillmentId,
    });
  });

  it("replaces a previous dialog action while keeping line focus", () => {
    // Arrange
    const params = {
      lineId: "line-1",
      action: "view-fulfillment-metadata" as const,
      id: "fulfillment-old",
    };

    // Act
    const result = withOrderFulfillmentDialog(params, "cancel-fulfillment", "fulfillment-new");

    // Assert
    expect(result).toEqual({
      lineId: "line-1",
      action: "cancel-fulfillment",
      id: "fulfillment-new",
    });
  });
});
