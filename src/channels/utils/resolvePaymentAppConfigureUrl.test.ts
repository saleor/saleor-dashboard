import { AppTypeEnum } from "@dashboard/graphql";

import { resolvePaymentAppConfigureUrl } from "./resolvePaymentAppConfigureUrl";

describe("resolvePaymentAppConfigureUrl", () => {
  it("returns custom extension edit URL for local apps", () => {
    // Arrange
    const app = {
      id: "app-local",
      type: AppTypeEnum.LOCAL,
      isActive: true,
      appUrl: null,
    };

    // Act
    const url = resolvePaymentAppConfigureUrl(app);

    // Assert
    expect(url).toBe("/extensions/custom/app-local?");
  });

  it("returns manifest manage URL when app has no configuration screen", () => {
    // Arrange
    const app = {
      id: "app-1",
      type: AppTypeEnum.THIRDPARTY,
      isActive: true,
      appUrl: null,
    };

    // Act
    const url = resolvePaymentAppConfigureUrl(app);

    // Assert
    expect(url).toBe("/extensions/app/app-1/edit?");
  });

  it("returns manifest iframe URL for active third-party apps with appUrl", () => {
    // Arrange
    const app = {
      id: "app-2",
      type: AppTypeEnum.THIRDPARTY,
      isActive: true,
      appUrl: "https://payments.example.com",
    };

    // Act
    const url = resolvePaymentAppConfigureUrl(app);

    // Assert
    expect(url).toBe("/extensions/app/app-2?");
  });
});
