import { type LeftOperand } from "../LeftOperandsProvider";
import { Condition } from "./Condition";
import { ExpressionValue } from "./FilterElement";
import { type FilterContainer, FilterElement } from "./FilterElement";
import { OccurrenceLimiter } from "./OccurrenceLimiter";

describe("OccurrenceLimiter", () => {
  describe("fromOperand", () => {
    it("returns a limiter when maxOccurrences is set", () => {
      // Arrange
      const operand: LeftOperand = {
        value: "channel",
        label: "Channel",
        type: "channel",
        slug: "channel",
        maxOccurrences: 1,
      };

      // Act
      const limiter = OccurrenceLimiter.fromOperand(operand);

      // Assert
      expect(limiter).not.toBeNull();
      expect(limiter!.fieldName).toBe("channel");
      expect(limiter!.maxOccurrences).toBe(1);
    });

    it("returns null when maxOccurrences is undefined", () => {
      // Arrange
      const operand: LeftOperand = {
        value: "attribute",
        label: "Attribute",
        type: "attribute",
        slug: "attribute",
      };

      // Act
      const limiter = OccurrenceLimiter.fromOperand(operand);

      // Assert
      expect(limiter).toBeNull();
    });
  });

  describe("filterAvailableOperands", () => {
    const channelOperand: LeftOperand = {
      value: "channel",
      label: "Channel",
      type: "channel",
      slug: "channel",
      maxOccurrences: 1,
    };

    const priceOperand: LeftOperand = {
      value: "price",
      label: "Price",
      type: "price",
      slug: "price",
      maxOccurrences: 1,
    };

    const categoryOperand: LeftOperand = {
      value: "category",
      label: "Category",
      type: "category",
      slug: "category",
      maxOccurrences: 1,
    };

    const attributeOperand: LeftOperand = {
      value: "attribute",
      label: "Attribute",
      type: "attribute",
      slug: "attribute",
    };

    function makeFilterElement(slug: string): FilterElement {
      return new FilterElement(
        new ExpressionValue(slug, slug, slug),
        Condition.createEmpty(),
        false,
        undefined,
      );
    }

    it("removes limited operand when it already exists in the container", () => {
      // Arrange
      const operands = [channelOperand, priceOperand, categoryOperand];
      const container: FilterContainer = [makeFilterElement("channel")];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([priceOperand, categoryOperand]);
    });

    it("keeps limited operand when it does NOT exist in the container", () => {
      // Arrange
      const operands = [channelOperand, priceOperand, categoryOperand];
      const container: FilterContainer = [makeFilterElement("price")];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([channelOperand, categoryOperand]);
    });

    it("keeps all operands when the container is empty", () => {
      // Arrange
      const operands = [channelOperand, priceOperand];
      const container: FilterContainer = [];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([channelOperand, priceOperand]);
    });

    it("does NOT limit operands without maxOccurrences", () => {
      // Arrange
      const operands = [attributeOperand, priceOperand];
      const container: FilterContainer = [makeFilterElement("attribute")];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([attributeOperand, priceOperand]);
    });

    it("removes multiple limited operands when each is at max occurrences", () => {
      // Arrange
      const billingCountryOperand: LeftOperand = {
        value: "billingCountry",
        label: "Billing Country",
        type: "billingCountry",
        slug: "billingCountry",
        maxOccurrences: 1,
      };
      const operands = [channelOperand, billingCountryOperand, attributeOperand];
      const container: FilterContainer = [
        makeFilterElement("channel"),
        makeFilterElement("billingCountry"),
      ];

      // Act
      const result = OccurrenceLimiter.filterAvailableOperands(operands, container);

      // Assert
      expect(result).toEqual([attributeOperand]);
    });

    it("handles same slug with different limits in different operand sets", () => {
      // Arrange — metadata limited in order context
      const orderMetadata: LeftOperand = {
        value: "metadata",
        label: "Metadata",
        type: "metadata",
        slug: "metadata",
        maxOccurrences: 1,
      };
      // metadata unlimited in collection context
      const collectionMetadata: LeftOperand = {
        value: "metadata",
        label: "Metadata",
        type: "metadata",
        slug: "metadata",
      };
      const container: FilterContainer = [makeFilterElement("metadata")];

      // Act — order context: should remove
      const orderResult = OccurrenceLimiter.filterAvailableOperands([orderMetadata], container);
      // Act — collection context: should keep
      const collectionResult = OccurrenceLimiter.filterAvailableOperands(
        [collectionMetadata],
        container,
      );

      // Assert
      expect(orderResult).toEqual([]);
      expect(collectionResult).toEqual([collectionMetadata]);
    });
  });
});
