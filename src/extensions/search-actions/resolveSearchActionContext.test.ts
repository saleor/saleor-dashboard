import { resolveSearchActionContext } from "./resolveSearchActionContext";

describe("resolveSearchActionContext", () => {
  it("resolves a product detail route to PRODUCT_DETAILS with productId", () => {
    // Arrange
    const pathname = "/products/UHJvZHVjdDox";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result).toEqual({
      view: "PRODUCT_DETAILS",
      params: { productId: "UHJvZHVjdDox" },
    });
  });

  it("resolves a product list route to PRODUCT_LIST without params", () => {
    // Arrange
    const pathname = "/products/";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result).toEqual({ view: "PRODUCT_LIST", params: {} });
  });

  it("treats the product create page as a non-detail route (no product context)", () => {
    // Arrange
    const pathname = "/products/add";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result.params).toEqual({});
    expect(result.view).not.toBe("PRODUCT_DETAILS");
  });

  it("collapses a nested product variant route to the parent product", () => {
    // Arrange
    const pathname = "/products/UHJvZHVjdDox/variant/VmFyaWFudDox";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result).toEqual({
      view: "PRODUCT_DETAILS",
      params: { productId: "UHJvZHVjdDox" },
    });
  });

  it("resolves a draft order detail route ahead of the order route", () => {
    // Arrange
    const pathname = "/orders/drafts/T3JkZXI6MQ==";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result).toEqual({
      view: "DRAFT_ORDER_DETAILS",
      params: { draftOrderId: "T3JkZXI6MQ==" },
    });
  });

  it("resolves the draft order list route without treating 'drafts' as an order id", () => {
    // Arrange
    const pathname = "/orders/drafts";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result).toEqual({ view: "DRAFT_ORDER_LIST", params: {} });
  });

  it("collapses an order fulfillment sub-route to the parent order", () => {
    // Arrange
    const pathname = "/orders/T3JkZXI6MQ==/fulfill";

    // Act
    const result = resolveSearchActionContext(pathname);

    // Assert
    expect(result).toEqual({
      view: "ORDER_DETAILS",
      params: { orderId: "T3JkZXI6MQ==" },
    });
  });

  it("resolves voucher and discount detail routes under /discounts", () => {
    // Act / Assert
    expect(resolveSearchActionContext("/discounts/vouchers/VjE=")).toEqual({
      view: "VOUCHER_DETAILS",
      params: { voucherId: "VjE=" },
    });
    expect(resolveSearchActionContext("/discounts/sales/RDE=")).toEqual({
      view: "DISCOUNT_DETAILS",
      params: { discountId: "RDE=" },
    });
  });

  it("resolves a menu (structure) detail route", () => {
    // Act
    const result = resolveSearchActionContext("/structures/TWVudTox");

    // Assert
    expect(result).toEqual({ view: "MENU_DETAILS", params: { menuId: "TWVudTox" } });
  });

  it("returns no view for non-entity routes", () => {
    // Act / Assert
    expect(resolveSearchActionContext("/")).toEqual({ view: null, params: {} });
    expect(resolveSearchActionContext("/configuration")).toEqual({ view: null, params: {} });
    expect(resolveSearchActionContext("/gift-cards/settings")).toEqual({ view: null, params: {} });
  });
});
