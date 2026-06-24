import { PostalCodeRuleInclusionTypeEnum, ShippingMethodTypeEnum } from "@dashboard/graphql";

import { type ShippingZoneRateCommonFormData } from "./components/ShippingZoneRatesPage/types";
import {
  createChannelsChangeHandler,
  getShippingMethodChannelVariables,
  getUpdateShippingWeightRateVariables,
} from "./handlers";
import { normalizeChannelPriceValue } from "./utils/channelPricingState";

const baseWeightFormData: ShippingZoneRateCommonFormData = {
  channelListings: [],
  name: "Standard",
  description: null,
  minValue: "",
  maxValue: "",
  minDays: "1",
  maxDays: "5",
  type: ShippingMethodTypeEnum.WEIGHT,
  taxClassId: "",
};

describe("shipping handlers", () => {
  describe("getShippingMethodChannelVariables", () => {
    it("maps empty order price bounds to null", () => {
      // Arrange
      const channels = [
        {
          id: "channel-1",
          name: "USD",
          currency: "USD",
          price: "10",
          minValue: "",
          maxValue: "   ",
        },
      ];

      // Act
      const variables = getShippingMethodChannelVariables("rate-id", channels);

      // Assert
      expect(variables.input.addChannels).toEqual([
        {
          channelId: "channel-1",
          price: "10",
          minimumOrderPrice: null,
          maximumOrderPrice: null,
        },
      ]);
    });

    it("preserves set order price bounds", () => {
      // Arrange
      const channels = [
        {
          id: "channel-1",
          name: "USD",
          currency: "USD",
          price: "10",
          minValue: "5",
          maxValue: "100",
        },
      ];

      // Act
      const variables = getShippingMethodChannelVariables("rate-id", channels);

      // Assert
      expect(variables.input.addChannels?.[0]).toMatchObject({
        minimumOrderPrice: "5",
        maximumOrderPrice: "100",
      });
    });
    it("maps null price to empty string", () => {
      // Arrange
      const channels = [
        {
          id: "channel-1",
          name: "USD",
          currency: "USD",
          price: null as unknown as string,
          minValue: "",
          maxValue: "",
        },
      ];

      // Act
      const variables = getShippingMethodChannelVariables("rate-id", channels);

      // Assert
      expect(variables.input.addChannels?.[0]?.price).toBe("");
    });
  });

  describe("normalizeChannelPriceValue", () => {
    it("normalizes null and empty values to empty string", () => {
      // Assert
      expect(normalizeChannelPriceValue(null)).toBe("");
      expect(normalizeChannelPriceValue("")).toBe("");
      expect(normalizeChannelPriceValue(10)).toBe("10");
      expect(normalizeChannelPriceValue("15.5")).toBe("15.5");
    });
  });

  describe("createChannelsChangeHandler", () => {
    it("normalizes null price from price field to empty string", () => {
      // Arrange
      const setSelectedChannels = jest.fn();
      const triggerChange = jest.fn();
      const channels = [
        {
          id: "channel-1",
          name: "USD",
          currency: "USD",
          price: "10",
          minValue: "",
          maxValue: "",
        },
      ];
      const handleChange = createChannelsChangeHandler(
        channels,
        setSelectedChannels,
        triggerChange,
      );

      // Act
      handleChange("channel-1", {
        maxValue: "",
        minValue: "",
        price: null as unknown as string,
      });

      // Assert
      expect(setSelectedChannels).toHaveBeenCalledWith([
        expect.objectContaining({ id: "channel-1", price: "" }),
      ]);
      expect(triggerChange).toHaveBeenCalled();
    });
  });

  describe("getUpdateShippingWeightRateVariables", () => {
    it("maps empty weight bounds to null", () => {
      // Act
      const variables = getUpdateShippingWeightRateVariables(
        baseWeightFormData,
        "zone-id",
        "rate-id",
        [],
        [],
      );

      // Assert
      expect(variables.input.minimumOrderWeight).toBeNull();
      expect(variables.input.maximumOrderWeight).toBeNull();
    });

    it("parses weight bounds when set", () => {
      // Arrange
      const formData: ShippingZoneRateCommonFormData = {
        ...baseWeightFormData,
        minValue: "1",
        maxValue: "10",
      };

      // Act
      const variables = getUpdateShippingWeightRateVariables(
        formData,
        "zone-id",
        "rate-id",
        [],
        [],
      );

      // Assert
      expect(variables.input.minimumOrderWeight).toBe(1);
      expect(variables.input.maximumOrderWeight).toBe(10);
    });

    it("uses inclusion type fallback when no postal code rules exist", () => {
      // Act
      const variables = getUpdateShippingWeightRateVariables(
        baseWeightFormData,
        "zone-id",
        "rate-id",
        [],
        [],
        PostalCodeRuleInclusionTypeEnum.INCLUDE,
      );

      // Assert
      expect(variables.input.inclusionType).toBe(PostalCodeRuleInclusionTypeEnum.INCLUDE);
    });
  });
});
