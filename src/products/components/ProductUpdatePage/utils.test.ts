import { Locale } from "@dashboard/components/Locale";
import { ChannelFragment, ProductChannelListingAddInput } from "@dashboard/graphql";

import { mapByChannel, parseCurrency } from "./utils";

describe("parseCurrency", () => {
  it("rounds down to 3 decimals in 3 digit currency - EN locale (dot)", () => {
    // Arrange
    const value = "5.6777";
    const currency = "BHD";
    const locale = Locale.EN;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(5.677);
  });
  it("rounds down to 0 decimals in 0 digit currency - PL locale (comma)", () => {
    // Arrange
    const value = "12,90679";
    const currency = "JPY";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(12);
  });
  it("rounds down to 2 decimals in 2 digit currency - EN locale (dot)", () => {
    // Arrange
    const value = "244.98721";
    const currency = "PLN";
    const locale = Locale.EN;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(244.98);
  });
  it("rounds down to 3 decimals in 3 digit currency - PL locale (comma)", () => {
    // Arrange
    const value = "0,27386";
    const currency = "TND";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(0.273);
  });
  it("rounds down correctly (floating point difficult case)", () => {
    // Arrange
    const value = "2.07";
    const currency = "EUR";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(2.07);
  });
  it("should not trim price without decimal", () => {
    // Arrange
    const value = "2123";
    const currency = "EUR";
    const locale = Locale.PL;
    // Act
    const parsed = parseCurrency(value, locale, currency);

    // Assert
    expect(parsed).toBe(2123);
  });
});

describe("mapByChannel", () => {
  it("should map listing to channel data", () => {
    // Arrange
    const channels = [
      { id: "1", currencyCode: "USD" },
      { id: "2", currencyCode: "EUR" },
    ] as ChannelFragment[];
    const listing: ProductChannelListingAddInput = { channelId: "2" };
    const mapFunction = mapByChannel(channels);

    // Act
    const result = mapFunction(listing);

    // Assert
    expect(result).toEqual({ id: "2", currency: "EUR", currencyCode: "EUR", channelId: "2" });
  });

  it("should map listing to channel data when no channels", () => {
    // Arrange
    const channels = [] as ChannelFragment[];
    const listing: ProductChannelListingAddInput = { channelId: "3" };
    const mapFunction = mapByChannel(channels);

    // Act
    const result = mapFunction(listing);

    // Assert
    expect(result).toEqual({ channelId: "3", currency: undefined, id: "3" });
  });

  it("should map listing to channel data when channels undefined", () => {
    // Arrange
    const channels = undefined;
    const listing: ProductChannelListingAddInput = { channelId: "3" };
    const mapFunction = mapByChannel(channels);

    // Act
    const result = mapFunction(listing);

    // Assert
    expect(result).toEqual({ channelId: "3", currency: undefined, id: "3" });
  });
});
