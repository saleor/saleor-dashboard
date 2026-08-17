import { channel } from "@dashboard/channels/fixtures";
import { CountryCode } from "@dashboard/graphql";

import { buildChannelDuplicateSource, getChannelDuplicateFormPrefill } from "./channelDuplicate";

describe("buildChannelDuplicateSource", () => {
  it("copies settings and assignment ids from the source channel", () => {
    // Arrange / Act
    const source = buildChannelDuplicateSource(channel, ["SZ1", "SZ2"]);

    // Assert
    expect(source.name).toBe("Test");
    expect(source.slug).toBe("test");
    expect(source.currencyCode).toBe("zl");
    expect(source.defaultCountry).toBe(CountryCode.PL);
    expect(source.warehouseIds).toEqual(["WH1", "WH2"]);
    expect(source.shippingZoneIds).toEqual(["SZ1", "SZ2"]);
    expect(source.allocationStrategy).toBe(channel.stockSettings.allocationStrategy);
    expect(source.orderSettings.markAsPaidStrategy).toBe(channel.orderSettings.markAsPaidStrategy);
    expect(source.checkoutSettings.allowLegacyGiftCardUse).toBe(true);
  });
});

describe("getChannelDuplicateFormPrefill", () => {
  it("suggests a copy name and unique-looking slug", () => {
    // Arrange
    const source = buildChannelDuplicateSource(channel, []);

    // Act
    const prefill = getChannelDuplicateFormPrefill(source, { name: "Copy of Test" });

    // Assert
    expect(prefill.name).toBe("Copy of Test");
    expect(prefill.slug).toBe("test-copy");
    expect(prefill.currencyCode).toBe("zl");
    expect(prefill.defaultCountry).toBe(CountryCode.PL);
    expect(prefill.countryDisplayName).toBe("Poland");
  });
});
