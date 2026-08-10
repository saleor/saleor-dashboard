import { describe, expect, it } from "@jest/globals";
import { createIntl } from "react-intl";

import { getVariantPricingChannelStatus } from "./channelStatus";

const intl = createIntl({ locale: "en", messages: {} });

describe("getVariantPricingChannelStatus", () => {
  it("returns success when channel is active and product is published", () => {
    // Arrange
    // Act
    const status = getVariantPricingChannelStatus({ isActive: true, isPublished: true }, intl);

    // Assert
    expect(status.type).toBe("success");
    expect(status.label).toBe("Active channel");
  });

  it("returns hidden when channel is inactive", () => {
    // Arrange
    // Act
    const status = getVariantPricingChannelStatus({ isActive: false, isPublished: true }, intl);

    // Assert
    expect(status.type).toBe("hidden");
    expect(status.label).toBe("Inactive channel");
  });

  it("returns warning when product is unpublished on an active channel", () => {
    // Arrange
    // Act
    const status = getVariantPricingChannelStatus({ isActive: true, isPublished: false }, intl);

    // Assert
    expect(status.type).toBe("warning");
    expect(status.label).toBe("Unpublished");
  });
});
