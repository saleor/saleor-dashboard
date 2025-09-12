import { InitialOrderStateResponse } from "@dashboard/components/ConditionalFilter/API/initialState/orders/InitialOrderState";
import { createOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { TokenArray } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray";
import { OrderWhereInput } from "@dashboard/graphql";
import { getExistingKeys } from "@test/filters";

describe("OrderList Filters", () => {
  describe("empty state", () => {
    it("should return empty object when no filters are applied", () => {
      // Arrange
      const filterVariables = createOrderQueryVariables([]);

      // Act & Assert
      expect(getExistingKeys(filterVariables)).toHaveLength(0);
    });

    it("should handle empty URL parameters", () => {
      // Arrange
      const params = new URLSearchParams("");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      expect(getExistingKeys(filterVariables)).toHaveLength(0);
    });
  });

  describe("enum filters", () => {
    it("should filter by single order status", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.status%5D=FULFILLED");
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.status = [
        { label: "Fulfilled", slug: "FULFILLED", value: "FULFILLED" },
        { label: "Canceled", slug: "CANCELED", value: "CANCELED" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];
      const statusFilter = andItems.find(item => "status" in item);

      expect(statusFilter?.status).toEqual({ eq: "FULFILLED" });
    });

    it("should filter by multiple order statuses with 'in' operator", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs2.status%5D%5B0%5D=FULFILLED&0%5Bs2.status%5D%5B1%5D=PARTIALLY_FULFILLED",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.status = [
        { label: "Fulfilled", slug: "FULFILLED", value: "FULFILLED" },
        { label: "Partially Fulfilled", slug: "PARTIALLY_FULFILLED", value: "PARTIALLY_FULFILLED" },
        { label: "Canceled", slug: "CANCELED", value: "CANCELED" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];
      const statusFilter = andItems.find(item => "status" in item);

      expect(statusFilter?.status).toEqual({ oneOf: ["FULFILLED", "PARTIALLY_FULFILLED"] });
    });

    it("should handle authorize and charge status enums", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.authorizeStatus%5D=FULL&1=AND&2%5Bs0.chargeStatus%5D=FULLY_CHARGED",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.authorizeStatus = [{ label: "Full", slug: "FULL", value: "FULL" }];
      initialOrderState.chargeStatus = [
        { label: "Fully Charged", slug: "FULLY_CHARGED", value: "FULLY_CHARGED" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];
      const authorizeFilter = andItems.find(item => "authorizeStatus" in item);
      const chargeFilter = andItems.find(item => "chargeStatus" in item);

      expect(authorizeFilter?.authorizeStatus).toEqual({ eq: "FULL" });
      expect(chargeFilter?.chargeStatus).toEqual({ eq: "FULLY_CHARGED" });
    });
  });

  describe("boolean filters", () => {
    it("should handle boolean filters and convert them from string values to bool", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.isClickAndCollect%5D=true&1=AND&2%5Bs0.hasInvoices%5D=false&3=AND&4%5Bs0.hasFulfillments%5D=true",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.isClickAndCollect = [
        { label: "Yes", slug: "true", value: "true" },
        { label: "No", slug: "false", value: "false" },
      ];
      initialOrderState.hasInvoices = [
        { label: "Yes", slug: "true", value: "true" },
        { label: "No", slug: "false", value: "false" },
      ];
      initialOrderState.hasFulfillments = [
        { label: "Yes", slug: "true", value: "true" },
        { label: "No", slug: "false", value: "false" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];

      const clickCollectFilter = andItems.find(item => "isClickAndCollect" in item);
      const invoicesFilter = andItems.find(item => "hasInvoices" in item);
      const fulfillmentsFilter = andItems.find(item => "hasFulfillments" in item);

      expect(clickCollectFilter?.isClickAndCollect).toBe(true);
      expect(invoicesFilter?.hasInvoices).toBe(false);
      expect(fulfillmentsFilter?.hasFulfillments).toBe(true);
    });

    it("should handle gift card boolean filters", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.isGiftCardUsed%5D=true&1=AND&2%5Bs0.isGiftCardBought%5D=false",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.isGiftCardUsed = [
        { label: "Yes", slug: "true", value: "true" },
        { label: "No", slug: "false", value: "false" },
      ];
      initialOrderState.isGiftCardBought = [
        { label: "Yes", slug: "true", value: "true" },
        { label: "No", slug: "false", value: "false" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const giftCardUsedFilter = andItems.find(item => "isGiftCardUsed" in item);
      const giftCardBoughtFilter = andItems.find(item => "isGiftCardBought" in item);

      expect(giftCardUsedFilter?.isGiftCardUsed).toBe(true);
      expect(giftCardBoughtFilter?.isGiftCardBought).toBe(false);
    });
  });

  describe("date range filters", () => {
    it("should filter by date range with 'between' operator", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs3.createdAt%5D%5B0%5D=2024-01-01&0%5Bs3.createdAt%5D%5B1%5D=2024-12-31",
      );
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];
      const dateFilter = andItems.find(item => "createdAt" in item);

      expect(dateFilter?.createdAt).toEqual({
        gte: "2024-01-01T00:00:00.000Z",
        lte: "2024-12-31T00:00:00.000Z",
      });
    });

    it("should filter by date with 'greater than' operator", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs5.updatedAt%5D=2024-06-01");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const dateFilter = andItems.find(item => "updatedAt" in item);

      expect(dateFilter?.updatedAt).toEqual({
        gte: "2024-06-01T00:00:00.000Z",
      });
    });

    it("should filter by invoice creation date (between)", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs3.invoicesCreatedAt%5D%5B0%5D=2024-03-01&0%5Bs3.invoicesCreatedAt%5D%5B1%5D=2024-03-31",
      );
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const invoicesFilter = andItems.find(item => "invoices" in item);

      expect(invoicesFilter?.invoices).toEqual([
        {
          createdAt: {
            gte: "2024-03-01T00:00:00.000Z",
            lte: "2024-03-31T00:00:00.000Z",
          },
        },
      ]);
    });

    it("should filter by invoice creation date (greater than)", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs5.invoicesCreatedAt%5D=2024-06-01");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const invoicesFilter = andItems.find(item => "invoices" in item);

      expect(invoicesFilter?.invoices).toEqual([
        {
          createdAt: {
            gte: "2024-06-01T00:00:00.000Z",
          },
        },
      ]);
    });

    it("should filter by invoice creation date (less than)", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs4.invoicesCreatedAt%5D=2024-12-31");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const invoicesFilter = andItems.find(item => "invoices" in item);

      expect(invoicesFilter?.invoices).toEqual([
        {
          createdAt: {
            lte: "2024-12-31T00:00:00.000Z",
          },
        },
      ]);
    });
  });

  describe("price filters", () => {
    it("should filter by total gross amount with single value", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.totalGross%5D%5B0%5D=100");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const priceFilter = andItems.find(item => "totalGross" in item);

      expect(priceFilter?.totalGross).toEqual({
        amount: { oneOf: [100] },
      });
    });

    it("should filter by total net amount with range", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs3.totalNet%5D%5B0%5D=50&0%5Bs3.totalNet%5D%5B1%5D=500",
      );
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const priceFilter = andItems.find(item => "totalNet" in item);

      expect(priceFilter?.totalNet).toEqual({
        amount: { range: { gte: 50, lte: 500 } },
      });
    });

    it("should handle price filters with 'less than' operator", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs4.totalGross%5D=1000");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const priceFilter = andItems.find(item => "totalGross" in item);

      expect(priceFilter?.totalGross).toEqual({
        amount: { range: { lte: 1000 } },
      });
    });
  });

  describe("metadata filters", () => {
    it("should filter by order metadata key-value pairs", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.metadata%5D%5B0%5D=campaign&0%5Bs0.metadata%5D%5B1%5D=summer2024",
      );
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];
      const metadataFilter = andItems.find(item => "metadata" in item);

      expect(metadataFilter?.metadata).toEqual({
        key: "campaign",
        value: { eq: "summer2024" },
      });
    });

    it("should handle multiple metadata filters", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.metadata%5D%5B0%5D=source&0%5Bs0.metadata%5D%5B1%5D=mobile&1=AND&2%5Bs0.metadata%5D%5B0%5D=priority&2%5Bs0.metadata%5D%5B1%5D=high",
      );
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const metadataFilters = andItems.filter(item => "metadata" in item);

      expect(metadataFilters).toHaveLength(2);
      expect(metadataFilters[0]?.metadata).toEqual({
        key: "source",
        value: { eq: "mobile" },
      });
      expect(metadataFilters[1]?.metadata).toEqual({
        key: "priority",
        value: { eq: "high" },
      });
    });

    it("should filter by nested metadata in order lines", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.linesMetadata%5D%5B0%5D=customization&0%5Bs0.linesMetadata%5D%5B1%5D=engraved",
      );
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const linesFilter = andItems.find(item => "lines" in item);

      expect(linesFilter?.lines).toEqual([
        {
          metadata: {
            key: "customization",
            value: { eq: "engraved" },
          },
        },
      ]);
    });
  });

  describe("nested array filters", () => {
    it("should filter by fulfillment warehouse (single selection)", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.fulfillmentWarehouse%5D=warehouse-us");
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.fulfillmentWarehouse = [
        { label: "US Warehouse", slug: "warehouse-us", value: "WH123" },
        { label: "EU Warehouse", slug: "warehouse-eu", value: "WH456" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const fulfillmentsFilter = andItems.find(item => "fulfillments" in item);

      expect(fulfillmentsFilter?.fulfillments).toEqual([
        {
          warehouse: { id: { eq: "WH123" } },
        },
      ]);
    });

    it("should filter by fulfillment warehouse (multiple selection)", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs2.fulfillmentWarehouse%5D%5B0%5D=warehouse-us&0%5Bs2.fulfillmentWarehouse%5D%5B1%5D=warehouse-eu",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.fulfillmentWarehouse = [
        { label: "US Warehouse", slug: "warehouse-us", value: "WH123" },
        { label: "EU Warehouse", slug: "warehouse-eu", value: "WH456" },
        { label: "Asia Warehouse", slug: "warehouse-asia", value: "WH789" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const fulfillmentsFilter = andItems.find(item => "fulfillments" in item);

      expect(fulfillmentsFilter?.fulfillments).toEqual([
        {
          warehouse: { id: { oneOf: ["WH123", "WH456"] } },
        },
      ]);
    });

    it("should combine multiple fulfillment filters", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.fulfillmentWarehouse%5D=warehouse-us&1=AND&2%5Bs0.fulfillmentStatus%5D=FULFILLED",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.fulfillmentWarehouse = [
        { label: "US Warehouse", slug: "warehouse-us", value: "WH123" },
      ];
      initialOrderState.fulfillmentStatus = [
        { label: "Fulfilled", slug: "FULFILLED", value: "FULFILLED" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const fulfillmentsFilter = andItems.find(item => "fulfillments" in item);

      expect(fulfillmentsFilter?.fulfillments).toHaveLength(2);
      expect(fulfillmentsFilter?.fulfillments).toContainEqual({
        warehouse: { id: { eq: "WH123" } },
      });
      expect(fulfillmentsFilter?.fulfillments).toContainEqual({
        status: { eq: "FULFILLED" },
      });
    });

    it("should filter by transaction payment type", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.transactionsPaymentType%5D=CARD");
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.transactionsPaymentType = [{ label: "Card", slug: "CARD", value: "CARD" }];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const transactionsFilter = andItems.find(item => "transactions" in item);

      expect(transactionsFilter?.transactions).toEqual([
        {
          paymentMethodDetails: {
            type: { eq: "CARD" },
          },
        },
      ]);
    });
  });

  describe("order data filters", () => {
    it("should filter by customer (maps to user field)", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.customer%5D=john.doe@example.com");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const userFilter = andItems.find(item => "user" in item);

      expect(userFilter?.user).toEqual({ eq: "john.doe@example.com" });
    });

    it("should filter by user email directly", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.userEmail%5D%5B0%5D=customer@shop.com");
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.userEmail = [
        { label: "customer@shop.com", slug: "customer@shop.com", value: "customer@shop.com" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const emailFilter = andItems.find(item => "userEmail" in item);

      // Single selection with arrays uses eq
      expect(emailFilter?.userEmail).toEqual({ eq: "customer@shop.com" });
    });

    it("should filter by order number", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.number%5D%5B0%5D=12345");
      const tokenizedUrl = new TokenArray(params.toString());

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const numberFilter = andItems.find(item => "number" in item);

      expect(numberFilter?.number).toEqual({ oneOf: [12345] });
    });

    it("should filter by voucher code", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs0.voucherCode%5D%5B0%5D=SUMMER20");
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.voucherCode = [{ label: "SUMMER20", slug: "SUMMER20", value: "SUMMER20" }];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const voucherFilter = andItems.find(item => "voucherCode" in item);

      // Single selection with arrays uses eq
      expect(voucherFilter?.voucherCode).toEqual({ eq: "SUMMER20" });
    });

    it("should filter by multiple order IDs", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs2.ids%5D%5B0%5D=T3JkZXI6MQ%3D%3D&0%5Bs2.ids%5D%5B1%5D=T3JkZXI6Mg%3D%3D",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.ids = [
        { label: "Order #1", slug: "T3JkZXI6MQ==", value: "T3JkZXI6MQ==" },
        { label: "Order #2", slug: "T3JkZXI6Mg==", value: "T3JkZXI6Mg==" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const idsFilter = andItems.find(item => "ids" in item);

      expect(idsFilter?.ids).toEqual(["T3JkZXI6MQ==", "T3JkZXI6Mg=="]);
    });
  });

  describe("edge-cases", () => {
    it("should map channels field from URL to channelId in GraphQL", () => {
      // Arrange
      const params = new URLSearchParams("0%5Bs2.channels%5D%5B0%5D=default-channel");
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.channelId = [
        { label: "Default Channel", slug: "default-channel", value: "CH123" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const channelFilter = andItems.find(item => "channelId" in item);

      expect(channelFilter?.channelId).toEqual({ oneOf: ["CH123"] });
    });

    it("should handle address filters for billing and shipping", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.billingCountry%5D=US&1=AND&2%5Bs0.shippingCountry%5D=CA",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.billingCountry = [{ label: "United States", slug: "US", value: "US" }];
      initialOrderState.shippingCountry = [{ label: "Canada", slug: "CA", value: "CA" }];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const billingFilter = andItems.find(item => "billingAddress" in item);
      const shippingFilter = andItems.find(item => "shippingAddress" in item);

      expect(billingFilter?.billingAddress).toEqual({
        country: { eq: "US" },
      });
      expect(shippingFilter?.shippingAddress).toEqual({
        country: { eq: "CA" },
      });
    });
  });

  describe("multiple filters at once", () => {
    it("should combine multiple filter types with AND logic", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs0.status%5D=FULFILLED&1=AND&2%5Bs0.isClickAndCollect%5D=false&3=AND&4%5Bs3.createdAt%5D%5B0%5D=2024-01-01&4%5Bs3.createdAt%5D%5B1%5D=2024-03-31&5=AND&6%5Bs0.totalGross%5D%5B0%5D=100&7=AND&8%5Bs0.customer%5D=user@example.com",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.status = [{ label: "Fulfilled", slug: "FULFILLED", value: "FULFILLED" }];
      initialOrderState.isClickAndCollect = [{ label: "No", slug: "false", value: "false" }];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      expect(filterVariables.AND).toBeDefined();

      const andItems = filterVariables.AND as OrderWhereInput[];

      // Should have 5 different filters combined with AND
      expect(andItems.length).toBeGreaterThanOrEqual(5);

      // Check each filter type is present
      expect(andItems.find(item => "status" in item)).toBeDefined();
      expect(andItems.find(item => "isClickAndCollect" in item)).toBeDefined();
      expect(andItems.find(item => "createdAt" in item)).toBeDefined();
      expect(andItems.find(item => "totalGross" in item)).toBeDefined();
      expect(andItems.find(item => "user" in item)).toBeDefined();
    });

    it("should handle complex nested filters with arrays", () => {
      // Arrange
      const params = new URLSearchParams(
        "0%5Bs2.fulfillmentWarehouse%5D%5B0%5D=wh1&0%5Bs2.fulfillmentWarehouse%5D%5B1%5D=wh2&1=AND&2%5Bs0.fulfillmentStatus%5D=FULFILLED&3=AND&4%5Bs0.fulfillmentsMetadata%5D%5B0%5D=tracking&4%5Bs0.fulfillmentsMetadata%5D%5B1%5D=express",
      );
      const tokenizedUrl = new TokenArray(params.toString());
      const initialOrderState = InitialOrderStateResponse.empty();

      initialOrderState.fulfillmentWarehouse = [
        { label: "Warehouse 1", slug: "wh1", value: "WH001" },
        { label: "Warehouse 2", slug: "wh2", value: "WH002" },
      ];
      initialOrderState.fulfillmentStatus = [
        { label: "Fulfilled", slug: "FULFILLED", value: "FULFILLED" },
      ];

      // Act
      const filterVariables = createOrderQueryVariables(
        tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
      );

      // Assert
      const andItems = filterVariables.AND as OrderWhereInput[];
      const fulfillmentsFilters = andItems.filter(item => "fulfillments" in item);

      // All fulfillment-related filters should be combined
      expect(fulfillmentsFilters.length).toBeGreaterThanOrEqual(1);

      const fulfillmentsFilter = fulfillmentsFilters[0];

      expect(fulfillmentsFilter?.fulfillments).toBeDefined();

      // Check that warehouse, status, and metadata filters are all present
      const hasWarehouseFilter = fulfillmentsFilter?.fulfillments?.some(f => "warehouse" in f);
      const hasStatusFilter = fulfillmentsFilter?.fulfillments?.some(f => "status" in f);
      const hasMetadataFilter = fulfillmentsFilter?.fulfillments?.some(f => "metadata" in f);

      expect(hasWarehouseFilter).toBe(true);
      expect(hasStatusFilter).toBe(true);
      expect(hasMetadataFilter).toBe(true);
    });
  });
});
