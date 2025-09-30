import {
  orderListPath,
  orderListUrl,
  orderListUrlWithCustomerEmail,
  orderListUrlWithCustomerId,
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
});
