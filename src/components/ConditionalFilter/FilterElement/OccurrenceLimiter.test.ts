import { Condition } from "./Condition";
import { ExpressionValue } from "./FilterElement";
import { type FilterContainer, FilterElement } from "./FilterElement";
import { OccurrenceLimiter } from "./OccurrenceLimiter";

describe("OccurrenceLimiter", () => {
  describe("fromSlug", () => {
    it("returns a limiter with maxOccurrences 1 for 'channel'", () => {
      const limiter = OccurrenceLimiter.fromSlug("channel");

      expect(limiter).not.toBeNull();
      expect(limiter!.fieldName).toBe("channel");
      expect(limiter!.maxOccurrences).toBe(1);
    });

    it("returns a limiter for existing address fields", () => {
      const fields = [
        "billingPhoneNumber",
        "billingCountry",
        "shippingPhoneNumber",
        "shippingCountry",
      ];

      for (const field of fields) {
        const limiter = OccurrenceLimiter.fromSlug(field);

        expect(limiter).not.toBeNull();
        expect(limiter!.fieldName).toBe(field);
        expect(limiter!.maxOccurrences).toBe(1);
      }
    });

    it("returns null for slugs not in OCCURRENCE_LIMITS", () => {
      expect(OccurrenceLimiter.fromSlug("price")).toBeNull();
      expect(OccurrenceLimiter.fromSlug("category")).toBeNull();
      expect(OccurrenceLimiter.fromSlug("nonexistent")).toBeNull();
    });

    it("returns null for 'channels' (plural, used by orders)", () => {
      expect(OccurrenceLimiter.fromSlug("channels")).toBeNull();
    });
  });

  describe("filterAvailableOperands", () => {
    const channelOperand = {
      value: "channel",
      label: "Channel",
      type: "channel",
      slug: "channel",
    };

    const priceOperand = {
      value: "price",
      label: "Price",
      type: "price",
      slug: "price",
    };

    const categoryOperand = {
      value: "category",
      label: "Category",
      type: "category",
      slug: "category",
    };

    const channelsOperand = {
      value: "channels",
      label: "Channels",
      type: "channels",
      slug: "channels",
    };

    function makeFilterElement(slug: string): FilterElement {
      return new FilterElement(
        new ExpressionValue(slug, slug, slug),
        Condition.createEmpty(),
        false,
        undefined,
      );
    }

    it("removes 'channel' from operands when it already exists in the container", () => {
      // Arrange
      const operands = [channelOperand, priceOperand, categoryOperand];
      const container: FilterContainer = [makeFilterElement("channel")];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([priceOperand, categoryOperand]);
    });

    it("keeps 'channel' in operands when it does NOT exist in the container", () => {
      // Arrange
      const operands = [channelOperand, priceOperand, categoryOperand];
      const container: FilterContainer = [makeFilterElement("price")];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([channelOperand, priceOperand, categoryOperand]);
    });

    it("keeps 'channel' in operands when the container is empty", () => {
      // Arrange
      const operands = [channelOperand, priceOperand];
      const container: FilterContainer = [];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([channelOperand, priceOperand]);
    });

    it("does NOT limit 'channels' (plural, order filter slug)", () => {
      // Arrange
      const operands = [channelsOperand, priceOperand];
      const container: FilterContainer = [makeFilterElement("channels")];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([channelsOperand, priceOperand]);
    });

    it("removes multiple limited slugs when each is at max occurrences", () => {
      // Arrange
      const billingCountryOperand = {
        value: "billingCountry",
        label: "Billing Country",
        type: "billingCountry",
        slug: "billingCountry",
      };
      const operands = [channelOperand, billingCountryOperand, priceOperand];
      const container: FilterContainer = [
        makeFilterElement("channel"),
        makeFilterElement("billingCountry"),
      ];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([priceOperand]);
    });
  });
});
