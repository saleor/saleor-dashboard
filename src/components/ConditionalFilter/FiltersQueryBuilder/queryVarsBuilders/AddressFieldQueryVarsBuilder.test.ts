import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import {
  ConditionItem,
  ConditionOptions,
  StaticElementName,
} from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue, ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { AddressFieldQueryVarsBuilder } from "./AddressFieldQueryVarsBuilder";

describe("AddressFieldQueryVarsBuilder", () => {
  const builder = new AddressFieldQueryVarsBuilder();

  // Helper function to create address FilterElement
  function createAddressElement(
    fieldName: StaticElementName,
    value: ConditionValue,
    conditionType: string = "select",
    conditionLabel: string = "is",
  ): FilterElement {
    const expressionValue = new ExpressionValue(fieldName, fieldName, fieldName);
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, value);
    const condition = new Condition(ConditionOptions.fromName(fieldName), selected, false);

    return new FilterElement(expressionValue, condition, false);
  }

  describe("canHandle", () => {
    it("should return true for billingPhoneNumber", () => {
      // Arrange
      const element = createAddressElement("billingPhoneNumber", "555-1234");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for billingCountry", () => {
      // Arrange
      const element = createAddressElement("billingCountry", "US");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for shippingPhoneNumber", () => {
      // Arrange
      const element = createAddressElement("shippingPhoneNumber", "555-5678");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for shippingCountry", () => {
      // Arrange
      const element = createAddressElement("shippingCountry", "CA");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for non-address fields", () => {
      // Arrange
      const element = createAddressElement("customer", "john@example.com");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should return NoopValuesHandler", () => {
      // Arrange
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    describe("billingPhoneNumber", () => {
      it("should create billingAddress.phoneNumber filter for single value", () => {
        // Arrange
        const element = createAddressElement("billingPhoneNumber", "555-1234");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          billingAddress: {
            phoneNumber: { eq: "555-1234" },
          },
        });
      });

      it("should create billingAddress.phoneNumber filter with multiple values", () => {
        // Arrange
        const phoneOptions: ItemOption[] = [
          { label: "Office", value: "555-1111", slug: "555-1111" },
          { label: "Mobile", value: "555-2222", slug: "555-2222" },
        ];
        const element = createAddressElement(
          "billingPhoneNumber",
          phoneOptions,
          "multiselect",
          "in",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          billingAddress: {
            phoneNumber: { oneOf: ["555-1111", "555-2222"] },
          },
        });
      });

      it("should merge with existing billingAddress fields", () => {
        // Arrange
        const element = createAddressElement("billingPhoneNumber", "555-1234");
        const query = {
          billingAddress: {
            country: { eq: "US" },
          },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          billingAddress: {
            country: { eq: "US" },
            phoneNumber: { eq: "555-1234" },
          },
        });
      });
    });

    describe("billingCountry", () => {
      it("should create billingAddress.country filter for single value", () => {
        // Arrange
        const element = createAddressElement("billingCountry", "US");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          billingAddress: {
            country: { eq: "US" },
          },
        });
      });

      it("should create billingAddress.country filter with multiple values", () => {
        // Arrange
        const countryOptions: ItemOption[] = [
          { label: "United States", value: "US", slug: "US" },
          { label: "Canada", value: "CA", slug: "CA" },
        ];
        const element = createAddressElement("billingCountry", countryOptions, "multiselect", "in");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          billingAddress: {
            country: { oneOf: ["US", "CA"] },
          },
        });
      });

      it("should merge with existing billingAddress fields", () => {
        // Arrange
        const element = createAddressElement("billingCountry", "CA");
        const query = {
          billingAddress: {
            phoneNumber: { eq: "555-1234" },
          },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          billingAddress: {
            phoneNumber: { eq: "555-1234" },
            country: { eq: "CA" },
          },
        });
      });
    });

    describe("shippingPhoneNumber", () => {
      it("should create shippingAddress.phoneNumber filter for single value", () => {
        // Arrange
        const element = createAddressElement("shippingPhoneNumber", "777-8888");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          shippingAddress: {
            phoneNumber: { eq: "777-8888" },
          },
        });
      });

      it("should create shippingAddress.phoneNumber filter with multiple values", () => {
        // Arrange
        const phoneOptions: ItemOption[] = [
          { label: "Primary", value: "777-1111", slug: "777-1111" },
          { label: "Secondary", value: "777-2222", slug: "777-2222" },
        ];
        const element = createAddressElement(
          "shippingPhoneNumber",
          phoneOptions,
          "multiselect",
          "in",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          shippingAddress: {
            phoneNumber: { oneOf: ["777-1111", "777-2222"] },
          },
        });
      });

      it("should merge with existing shippingAddress fields", () => {
        // Arrange
        const element = createAddressElement("shippingPhoneNumber", "777-8888");
        const query = {
          shippingAddress: {
            country: { eq: "GB" },
          },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          shippingAddress: {
            country: { eq: "GB" },
            phoneNumber: { eq: "777-8888" },
          },
        });
      });
    });

    describe("shippingCountry", () => {
      it("should create shippingAddress.country filter for single value", () => {
        // Arrange
        const element = createAddressElement("shippingCountry", "GB");
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          shippingAddress: {
            country: { eq: "GB" },
          },
        });
      });

      it("should create shippingAddress.country filter with multiple values", () => {
        // Arrange
        const countryOptions: ItemOption[] = [
          { label: "United Kingdom", value: "GB", slug: "GB" },
          { label: "Germany", value: "DE", slug: "DE" },
        ];
        const element = createAddressElement(
          "shippingCountry",
          countryOptions,
          "multiselect",
          "in",
        );
        const query = {};

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          shippingAddress: {
            country: { oneOf: ["GB", "DE"] },
          },
        });
      });

      it("should merge with existing shippingAddress fields", () => {
        // Arrange
        const element = createAddressElement("shippingCountry", "DE");
        const query = {
          shippingAddress: {
            phoneNumber: { eq: "777-8888" },
          },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query, element);

        // Assert
        expect(result).toEqual({
          shippingAddress: {
            phoneNumber: { eq: "777-8888" },
            country: { eq: "DE" },
          },
        });
      });
    });

    describe("complex scenarios", () => {
      it("should handle both billing and shipping addresses in same query", () => {
        // Arrange
        const billingElement = createAddressElement("billingCountry", "US");
        const shippingElement = createAddressElement("shippingCountry", "CA");
        let query = {};

        // Act
        query = builder.updateWhereQueryVariables(query, billingElement);
        query = builder.updateWhereQueryVariables(query, shippingElement);

        // Assert
        expect(query).toEqual({
          billingAddress: {
            country: { eq: "US" },
          },
          shippingAddress: {
            country: { eq: "CA" },
          },
        });
      });

      it("should handle multiple fields for same address type", () => {
        // Arrange
        const phoneElement = createAddressElement("billingPhoneNumber", "555-1234");
        const countryElement = createAddressElement("billingCountry", "US");
        let query = {};

        // Act
        query = builder.updateWhereQueryVariables(query, phoneElement);
        query = builder.updateWhereQueryVariables(query, countryElement);

        // Assert
        expect(query).toEqual({
          billingAddress: {
            phoneNumber: { eq: "555-1234" },
            country: { eq: "US" },
          },
        });
      });

      it("should preserve existing non-address fields", () => {
        // Arrange
        const element = createAddressElement("billingPhoneNumber", "555-1234");
        const query = {
          status: { eq: "CONFIRMED" },
          totalGross: { amount: { gte: 100 } },
        };

        // Act
        const result = builder.updateWhereQueryVariables(query as any, element);

        // Assert
        expect(result).toEqual({
          status: { eq: "CONFIRMED" },
          totalGross: { amount: { gte: 100 } },
          billingAddress: {
            phoneNumber: { eq: "555-1234" },
          },
        });
      });
    });
  });
});
