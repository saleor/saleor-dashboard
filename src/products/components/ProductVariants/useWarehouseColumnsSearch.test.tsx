import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  PermissionEnum,
  WarehouseClickAndCollectOptionEnum,
  type WarehouseFragment,
  WarehouseListDocument,
  type WarehouseListQuery,
  type WarehouseListQueryVariables,
} from "@dashboard/graphql";
import { act, renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";

import { useWarehouseColumnsSearch } from "./useWarehouseColumnsSearch";

// The dashboard's custom `useQuery` (makeQuery.ts) injects every PERMISSION_*
// flag (defaulting to false when there is no user) as a query variable, so the
// mocks must match those exact variables.
const permissionVariables = Object.keys(PermissionEnum).reduce<Record<string, boolean>>(
  (acc, code) => ({ ...acc, [`PERMISSION_${code}`]: false }),
  {},
);

type WarehouseNode = NonNullable<WarehouseListQuery["warehouses"]>["edges"][number]["node"];
type PageInfo = NonNullable<WarehouseListQuery["warehouses"]>["pageInfo"];

const makeWarehouse = (id: string, name: string): WarehouseFragment => ({
  __typename: "Warehouse",
  id,
  name,
});

const makeNode = (warehouse: WarehouseFragment): WarehouseNode => ({
  ...warehouse,
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
  shippingZones: { __typename: "ShippingZoneCountableConnection", edges: [] },
});

const makePage = (
  warehouses: WarehouseFragment[],
  pageInfo: Partial<Omit<PageInfo, "__typename">> = {},
): WarehouseListQuery => ({
  __typename: "Query",
  warehouses: {
    __typename: "WarehouseCountableConnection",
    edges: warehouses.map(warehouse => ({
      __typename: "WarehouseCountableEdge",
      node: makeNode(warehouse),
    })),
    pageInfo: {
      __typename: "PageInfo",
      endCursor: null,
      startCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      ...pageInfo,
    },
  },
});

const makeMock = (
  variables: WarehouseListQueryVariables,
  data: WarehouseListQuery,
): MockedResponse<WarehouseListQuery> => ({
  request: {
    query: WarehouseListDocument,
    variables: { ...variables, ...permissionVariables },
  },
  result: { data },
});

const usWarehouse = makeWarehouse("w-1", "US Warehouse");
const euWarehouse = makeWarehouse("w-2", "EU Warehouse");
const asiaWarehouse = makeWarehouse("w-3", "Asia Warehouse");
const farWarehouse = makeWarehouse("w-51", "Far away warehouse");
const defaultWarehouses: WarehouseFragment[] = [usWarehouse, euWarehouse];

const firstPageMock = makeMock(
  { first: 10, filter: { search: "" } },
  makePage([usWarehouse, euWarehouse], { hasNextPage: true, endCursor: "cursor-2" }),
);
const searchPageMock = makeMock({ first: 10, filter: { search: "eu" } }, makePage([euWarehouse]));
const nextPageMock = makeMock(
  { first: 10, after: "cursor-2", filter: { search: "" } },
  makePage([asiaWarehouse], { hasPreviousPage: true, startCursor: "cursor-3" }),
);
const missingWarehouseMock = makeMock(
  { first: 100, filter: { ids: ["w-51"] } },
  makePage([farWarehouse]),
);

const createWrapper = (mocks: MockedResponse[]) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );

  Wrapper.displayName = "MockedWrapper";

  return Wrapper;
};

const ids = (warehouses: WarehouseFragment[] | undefined) =>
  warehouses?.map(warehouse => warehouse.id);

describe("useWarehouseColumnsSearch", () => {
  it("lists the first page of warehouses from the API for the picker", async () => {
    // Arrange
    const selectedColumns = ["name", "warehouse:w-1"];

    // Act
    const { result } = renderHook(
      () => useWarehouseColumnsSearch({ warehouses: defaultWarehouses, selectedColumns }),
      { wrapper: createWrapper([firstPageMock]) },
    );

    // Assert
    await waitFor(() => expect(ids(result.current.availableWarehouses)).toEqual(["w-1", "w-2"]));
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it("resolves selected warehouses from the default list without waiting for the API", () => {
    // Arrange
    const selectedColumns = ["warehouse:w-2", "sku", "warehouse:w-1"];

    // Act
    const { result } = renderHook(
      () => useWarehouseColumnsSearch({ warehouses: defaultWarehouses, selectedColumns }),
      { wrapper: createWrapper([firstPageMock]) },
    );

    // Assert
    expect(ids(result.current.selectedWarehouses)).toEqual(["w-2", "w-1"]);
  });

  it("is not resolved until the default warehouses and column selection are known", () => {
    // Arrange & Act
    const { result } = renderHook(
      () => useWarehouseColumnsSearch({ warehouses: undefined, selectedColumns: undefined }),
      { wrapper: createWrapper([firstPageMock]) },
    );

    // Assert
    expect(result.current.selectedWarehouses).toBeUndefined();
  });

  it("fetches selected warehouses that are outside the default list by id", async () => {
    // Arrange
    const selectedColumns = ["warehouse:w-1", "warehouse:w-51"];

    // Act
    const { result } = renderHook(
      () => useWarehouseColumnsSearch({ warehouses: defaultWarehouses, selectedColumns }),
      { wrapper: createWrapper([firstPageMock, missingWarehouseMock]) },
    );

    // Assert
    expect(result.current.selectedWarehouses).toBeUndefined();
    await waitFor(() =>
      expect(result.current.selectedWarehouses).toEqual([
        usWarehouse,
        expect.objectContaining({ id: "w-51", name: "Far away warehouse" }),
      ]),
    );
  });

  it("searches warehouses on the server", async () => {
    // Arrange
    const { result } = renderHook(
      () =>
        useWarehouseColumnsSearch({
          warehouses: defaultWarehouses,
          selectedColumns: [],
        }),
      { wrapper: createWrapper([firstPageMock, searchPageMock]) },
    );

    await waitFor(() => expect(result.current.availableWarehouses).toHaveLength(2));

    // Act
    act(() => result.current.onSearch("eu"));

    // Assert
    await waitFor(() => expect(ids(result.current.availableWarehouses)).toEqual(["w-2"]));
  });

  it("pages through warehouses with the API cursor", async () => {
    // Arrange
    const { result } = renderHook(
      () =>
        useWarehouseColumnsSearch({
          warehouses: defaultWarehouses,
          selectedColumns: [],
        }),
      { wrapper: createWrapper([firstPageMock, nextPageMock]) },
    );

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    // Act
    act(() => result.current.onNextPage(""));

    // Assert
    await waitFor(() => expect(ids(result.current.availableWarehouses)).toEqual(["w-3"]));
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
  });
});
