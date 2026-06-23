import { ShippingMethodTypeEnum } from "@dashboard/graphql";

import { type ShippingZoneRateCommonFormData } from "./components/ShippingZoneRatesPage/types";
import {
  getShippingMethodChannelVariables,
  getUpdateShippingWeightRateVariables,
} from "./handlers";

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
  });
});
