import { orderListPath, orderListUrl, orderListUrlWithCustomer } from "./urls";

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

  describe("orderListUrlWithCustomer", () => {
    it("should return orderListPath when userEmail is undefined", () => {
      const result = orderListUrlWithCustomer(undefined);

      expect(result).toBe(orderListPath);
    });

    it("should build URL with customer filter using conditional filter system", () => {
      const userEmail = "test@example.com";
      const result = orderListUrlWithCustomer(userEmail);

      // The result should contain the customer filter in URL parameters
      expect(result).toContain("/orders?");
      expect(result).toContain("customer");
      expect(result).toContain("test%40example.com"); // @ is URL encoded as %40

      // Should use conditional filter format, not legacy format
      expect(result).not.toContain("[eq][]");
    });

    it("should properly encode special characters in email", () => {
      const userEmail = "user+test@example.com";
      const result = orderListUrlWithCustomer(userEmail);

      expect(result).toContain("/orders?");
      expect(result).toContain("customer");
      // Both + and @ should be properly encoded
      expect(result).toContain("user%2Btest%40example.com");
    });

    it("should handle complex email addresses", () => {
      const userEmail = "user.name+tag@sub.domain.com";
      const result = orderListUrlWithCustomer(userEmail);

      expect(result).toContain("/orders?");
      expect(result).toContain("customer");
      // Should be properly URL encoded
      expect(result).toContain("user.name%2Btag%40sub.domain.com");
    });

    it("should generate different URLs for different emails", () => {
      const email1 = "user1@example.com";
      const email2 = "user2@example.com";

      const result1 = orderListUrlWithCustomer(email1);
      const result2 = orderListUrlWithCustomer(email2);

      expect(result1).not.toBe(result2);
      expect(result1).toContain("user1%40example.com");
      expect(result2).toContain("user2%40example.com");
    });
  });
});
