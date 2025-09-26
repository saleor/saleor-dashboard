import { ApolloClient } from "@apollo/client";

import { LegacyChannelHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import {
  ConditionItem,
  ConditionOptions,
  StaticElementName,
} from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { OrderChannelQueryVarsBuilder } from "./OrderChannelQueryVarsBuilder";

describe("OrderChannelQueryVarsBuilder", () => {
  const builder = new OrderChannelQueryVarsBuilder();
  const client = {} as ApolloClient<unknown>;

  // Helper for channel filters with specific condition labels
  function createChannelFilterElement(
    fieldName: string,
    selectedValue: unknown,
    conditionLabel?: string,
  ): FilterElement {
    const value = new ExpressionValue(fieldName, fieldName, fieldName);
    const conditionType = Array.isArray(selectedValue) ? "multiselect" : "select";
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel || fieldName,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(
      conditionItem,
      selectedValue as ConditionValue,
    );
    const condition = new Condition(
      ConditionOptions.fromName(fieldName as StaticElementName),
      selected,
      false,
    );

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("should return true for channels field", () => {
      // Arrange
      const element = createChannelFilterElement("channels", "channel-usd");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-channels fields", () => {
      // Arrange
      const element = createChannelFilterElement("status", "CONFIRMED");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for channel (singular) field", () => {
      // Arrange
      const element = createChannelFilterElement("channel", "channel-usd");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for channelId field", () => {
      // Arrange
      const element = createChannelFilterElement("status", "channel-id-123");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return LegacyChannelHandler", () => {
      // Arrange
      const inputValue = "USD";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue);

      // Assert
      expect(fetcher).toBeInstanceOf(LegacyChannelHandler);
    });

    it("should pass client and inputValue to LegacyChannelHandler", () => {
      // Arrange
      const inputValue = "EUR";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue);

      // Assert
      expect(fetcher).toBeDefined();
      expect(fetcher).toBeInstanceOf(LegacyChannelHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    describe("field name mapping", () => {
      it("should map 'channels' field to 'channelId' in query", () => {
        // Arrange
        const element = createChannelFilterElement("channels", "channel-usd", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: "channel-usd" },
        });
      });
    });

    describe("single channel selection", () => {
      it("should handle single channel with 'is' condition", () => {
        // Arrange
        const element = createChannelFilterElement("channels", "channel-usd", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: "channel-usd" },
        });
      });

      it("should handle ItemOption with channel ID", () => {
        // Arrange
        const channelOption = {
          label: "USD Channel",
          value: "channel-usd-id",
          slug: "channel-usd",
        };
        const element = createChannelFilterElement("channels", channelOption, "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: "channel-usd-id" },
        });
      });
    });

    describe("multiple channel selection", () => {
      it("should handle multiple channels as array", () => {
        // Arrange
        const channelOptions = [
          { label: "USD Channel", value: "channel-usd", slug: "channel-usd" },
          { label: "EUR Channel", value: "channel-eur", slug: "channel-eur" },
          { label: "GBP Channel", value: "channel-gbp", slug: "channel-gbp" },
        ];
        const element = createChannelFilterElement("channels", channelOptions, "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { oneOf: ["channel-usd", "channel-eur", "channel-gbp"] },
        });
      });

      it("should handle string array directly", () => {
        // Arrange
        const channels = ["channel-usd", "channel-eur"];
        const element = createChannelFilterElement("channels", channels, "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { oneOf: ["channel-usd", "channel-eur"] },
        });
      });
    });

    describe("immutability and query preservation", () => {
      it("should preserve existing fields in query", () => {
        // Arrange
        const element = createChannelFilterElement("channels", "channel-eur", "is");
        const query = {
          status: { oneOf: ["PENDING", "CONFIRMED"] },
          createdAt: { gte: "2023-01-01T00:00:00.000Z" },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query as any, element);

        // Assert
        expect(result).toEqual({
          status: { oneOf: ["PENDING", "CONFIRMED"] },
          createdAt: { gte: "2023-01-01T00:00:00.000Z" },
          channelId: { eq: "channel-eur" },
        });
      });

      it("should override existing channelId field", () => {
        // Arrange
        const element = createChannelFilterElement("channels", "channel-new", "is");
        const query = {
          channelId: { eq: "channel-old" },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: "channel-new" },
        });
      });
    });

    describe("edge cases", () => {
      it("should handle empty string channel", () => {
        // Arrange
        const element = createChannelFilterElement("channels", "", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: "" },
        });
      });

      it("should handle null/undefined values", () => {
        // Arrange
        const element = createChannelFilterElement("channels", null, "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: null,
        });
      });

      it("should handle empty array of channels", () => {
        // Arrange
        const element = createChannelFilterElement("channels", [], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: [] },
        });
      });

      it("should handle single-element array", () => {
        // Arrange
        const element = createChannelFilterElement("channels", ["channel-single"], "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { oneOf: ["channel-single"] },
        });
      });

      it("should handle channels with special characters", () => {
        // Arrange
        const element = createChannelFilterElement("channels", "channel-€UR_test-123", "is");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          channelId: { eq: "channel-€UR_test-123" },
        });
      });
    });
  });
});
