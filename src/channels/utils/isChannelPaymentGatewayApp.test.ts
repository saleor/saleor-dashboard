import { AppTypeEnum, PermissionEnum } from "@dashboard/graphql";

import { isChannelPaymentGatewayApp } from "./isChannelPaymentGatewayApp";

describe("isChannelPaymentGatewayApp", () => {
  it("returns true for active third-party apps with HANDLE_PAYMENTS", () => {
    // Arrange
    const app = {
      type: AppTypeEnum.THIRDPARTY,
      permissions: [{ code: PermissionEnum.HANDLE_PAYMENTS }],
    };

    // Act & Assert
    expect(isChannelPaymentGatewayApp(app)).toBe(true);
  });

  it("returns false for local apps even when they declare HANDLE_PAYMENTS", () => {
    // Arrange
    const app = {
      type: AppTypeEnum.LOCAL,
      permissions: [{ code: PermissionEnum.HANDLE_PAYMENTS }],
    };

    // Act & Assert
    expect(isChannelPaymentGatewayApp(app)).toBe(false);
  });

  it("returns false for third-party apps without HANDLE_PAYMENTS", () => {
    // Arrange
    const app = {
      type: AppTypeEnum.THIRDPARTY,
      permissions: [{ code: PermissionEnum.MANAGE_ORDERS }],
    };

    // Act & Assert
    expect(isChannelPaymentGatewayApp(app)).toBe(false);
  });
});
