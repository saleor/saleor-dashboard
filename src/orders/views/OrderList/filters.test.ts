import { InitialOrderStateResponse } from "@dashboard/components/ConditionalFilter/API/initialState/orders/InitialOrderState";
import { createOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { TokenArray } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray";
import { OrderWhereInput } from "@dashboard/graphql";
import { getExistingKeys } from "@test/filters";


describe("Filtering URL params", () => {
  it("should be empty object if no params given", () => {
    // Arrange & Act
    const filterVariables = createOrderQueryVariables([]);

    // Assert
    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    // Arrange
    const params = new URLSearchParams(
      "0%5Bs2.status%5D%5B0%5D=FULFILLED&0%5Bs2.status%5D%5B1%5D=CANCELED&1=AND&2%5Bs0.customer%5D=test&3=AND&4%5Bs0.isClickAndCollect%5D=false",
    );
    const tokenizedUrl = new TokenArray(params.toString());
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.status = [
      {
        label: "Fulfilled",
        slug: "FULFILLED",
        value: "FULFILLED",
      },
      {
        label: "Canceled",
        slug: "CANCELED",
        value: "CANCELED",
      },
      {
        label: "Unconfirmed",
        slug: "UNCONFIRMED",
        value: "UNCONFIRMED",
      },
    ];
    initialOrderState.isClickAndCollect = [
      {
        label: "No",
        slug: "false",
        value: "false",
      },
    ];

    // Act
    const filterVariables = createOrderQueryVariables(
      tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
    );

    // Assert
    // All filters are wrapped in `AND`
    expect(getExistingKeys(filterVariables)).toHaveLength(1);
    expect(filterVariables.AND).toBeDefined();
    expect(filterVariables.AND).toHaveLength(3);

    const andItems = filterVariables.AND as OrderWhereInput[];
    const userFilter = andItems.find(item => 'user' in item);
    const statusFilter = andItems.find(item => 'status' in item);
    const clickCollectFilter = andItems.find(item => 'isClickAndCollect' in item);

    expect(userFilter?.user).toEqual({ eq: "test" });
    expect(statusFilter?.status).toEqual({ oneOf: ["FULFILLED", "CANCELED"] });
    expect(clickCollectFilter?.isClickAndCollect).toBe(false);
  });

  it("should filter by the metadata", () => {
    // Arrange
    const params = new URLSearchParams(
      "0%5Bs0.metadata%5D%5B0%5D=key1&0%5Bs0.metadata%5D%5B1%5D=value1&1=AND&2%5Bs0.metadata%5D%5B0%5D=key2&2%5Bs0.metadata%5D%5B1%5D=value2&asc=false&sort=number",
    );
    const tokenizedUrl = new TokenArray(params.toString());

    // Act
    const filterVariables = createOrderQueryVariables(
      tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
    );

    // Assert
    expect(filterVariables.AND).toBeDefined();

    const andItems = filterVariables.AND as OrderWhereInput[];
    const metadataFilters = andItems.filter(item => 'metadata' in item);

    expect(metadataFilters[0]?.metadata).toEqual({
      key: "key1",
      value: { eq: "value1" },
    });
    expect(metadataFilters[1]?.metadata).toEqual({
      key: "key2",
      value: { eq: "value2" },
    });
  });

  it("should filter by totalGross with multi-digit numbers", () => {
    // Arrange
    const params = new URLSearchParams(
      "0%5Bs4.totalGross%5D=2222&1=AND&2%5Bs0.totalNet%5D%5B0%5D=321",
    );
    const tokenizedUrl = new TokenArray(params.toString());

    // Act
    const filterVariables = createOrderQueryVariables(
      tokenizedUrl.asFilterValuesFromResponse(InitialOrderStateResponse.empty()),
    );

    // Assert
    expect(filterVariables.AND).toBeDefined();

    const andItems = filterVariables.AND as Array<Record<string, any>>;
    const totalGrossFilter = andItems.find(item => 'totalGross' in item);
    const totalNetFilter = andItems.find(item => 'totalNet' in item);

    expect(totalGrossFilter?.totalGross).toEqual({ amount: { range: { lte: 2222 } } });
    expect(totalNetFilter?.totalNet).toEqual({ amount: { oneOf: [321] } });
  });

  it("should handle user-provided URL example correctly", () => {
    // Arrange
    const params = new URLSearchParams(
      "0%5Bs0.chargeStatus%5D=FULL&1=AND&2%5Bs0.isClickAndCollect%5D=false&3=AND&4%5Bs2.channels%5D%5B0%5D=channel-pln&5=AND&6%5Bs0.hasFulfillments%5D=true&7=AND&8%5Bs4.totalGross%5D=2222"
    );
    const tokenizedUrl = new TokenArray(params.toString());
    const initialOrderState = InitialOrderStateResponse.empty();

    initialOrderState.chargeStatus = [{ label: "Full", slug: "FULL", value: "FULL" }];
    initialOrderState.isClickAndCollect = [{ label: "No", slug: "false", value: "false" }];
    initialOrderState.channelId = [{ label: "PLN Channel", slug: "channel-pln", value: "channel-pln" }];
    initialOrderState.hasFulfillments = [{ label: "Yes", slug: "true", value: "true" }];

    // Act
    const filterVariables = createOrderQueryVariables(
      tokenizedUrl.asFilterValuesFromResponse(initialOrderState),
    );

    // Assert
    expect(filterVariables.AND).toBeDefined();

    const andItems = filterVariables.AND as Array<Record<string, any>>;
    const chargeStatusFilter = andItems.find(item => 'chargeStatus' in item);
    const clickCollectFilter = andItems.find(item => 'isClickAndCollect' in item);
    const channelFilter = andItems.find(item => 'channelId' in item);
    const fulfillmentsFilter = andItems.find(item => 'hasFulfillments' in item);
    const totalGrossFilter = andItems.find(item => 'totalGross' in item);

    expect(chargeStatusFilter?.chargeStatus).toEqual({ eq: "FULL" });
    expect(clickCollectFilter?.isClickAndCollect).toBe(false);
    expect(channelFilter?.channelId).toEqual({ oneOf: ["channel-pln"] }); // channels field maps to channelId
    expect(fulfillmentsFilter?.hasFulfillments).toBe(true);
    expect(totalGrossFilter?.totalGross).toEqual({ amount: { range: { lte: 2222 } } });
  });

  it("should handle boolean filter persistence correctly", () => {
    // Arrange - Test both Yes and No values for hasFulfillments
    const params = new URLSearchParams(
      "0%5Bs0.hasFulfillments%5D=true&1=AND&2%5Bs0.hasInvoices%5D=false"
    );
    const tokenizedUrl = new TokenArray(params.toString());
    const initialOrderState = InitialOrderStateResponse.empty();

    // Provide all boolean options as they should be available
    initialOrderState.hasFulfillments = [
      { label: "Yes", slug: "true", value: "true" },
      { label: "No", slug: "false", value: "false" }
    ];
    initialOrderState.hasInvoices = [
      { label: "Yes", slug: "true", value: "true" },
      { label: "No", slug: "false", value: "false" }
    ];

    // Act
    const filterValues = tokenizedUrl.asFilterValuesFromResponse(initialOrderState);
    const filterVariables = createOrderQueryVariables(filterValues);

    // Assert - Check that the filter values contain the correct selected options
    const hasFulfillmentsFilter = filterValues.find(f =>
      typeof f !== "string" && !Array.isArray(f) && f.value?.value === "hasFulfillments"
    );
    const hasInvoicesFilter = filterValues.find(f =>
      typeof f !== "string" && !Array.isArray(f) && f.value?.value === "hasInvoices"
    );

    expect(hasFulfillmentsFilter).toBeDefined();
    expect(hasInvoicesFilter).toBeDefined();

    // After the fix: These should be ItemOption objects representing the selected boolean values
    if (typeof hasFulfillmentsFilter !== "string" && !Array.isArray(hasFulfillmentsFilter) && hasFulfillmentsFilter) {
      expect(hasFulfillmentsFilter.condition.selected.value).toEqual({ label: "Yes", slug: "true", value: "true" });
    }

    if (typeof hasInvoicesFilter !== "string" && !Array.isArray(hasInvoicesFilter) && hasInvoicesFilter) {
      expect(hasInvoicesFilter.condition.selected.value).toEqual({ label: "No", slug: "false", value: "false" });
    }

    // Also check the final query variables
    expect(filterVariables.AND).toBeDefined();

    const andItems = filterVariables.AND as Array<Record<string, any>>;
    const fulfillmentsItem = andItems.find(item => 'hasFulfillments' in item);
    const invoicesItem = andItems.find(item => 'hasInvoices' in item);

    expect(fulfillmentsItem?.hasFulfillments).toBe(true);
    expect(invoicesItem?.hasInvoices).toBe(false);
  });
});
