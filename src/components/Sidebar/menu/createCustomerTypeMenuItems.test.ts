import { customerListUrlWithCustomerType } from "@dashboard/customers/urls";
import { PermissionEnum } from "@dashboard/graphql";

import {
  createCustomerTypeMenuItems,
  CUSTOMER_TYPE_NAV_ALL_ID,
  CUSTOMER_TYPE_NAV_ID_PREFIX,
  getCustomerTypeIdsFromSearch,
  isCustomerTypeNavItem,
  MAX_CUSTOMER_TYPE_NAV_TYPES,
  selectCustomerTypesForNav,
} from "./createCustomerTypeMenuItems";

const listPermissions = [
  PermissionEnum.MANAGE_USERS,
  PermissionEnum.MANAGE_ORDERS,
  PermissionEnum.MANAGE_STAFF,
];

describe("createCustomerTypeMenuItems", () => {
  const types = [
    { id: "type-b2b", name: "B2B" },
    { id: "type-default", name: "Default" },
  ];

  it("puts All first, then pinned types, then the remaining name order", () => {
    // Arrange & Act
    const items = createCustomerTypeMenuItems({
      customerTypes: types,
      allLabel: "All",
      pinnedIds: ["type-default"],
    });

    // Assert
    expect(items.map(item => item.label)).toEqual(["All", "Default", "B2B"]);
  });

  it("puts All first, then each customer type as a filtered list shortcut", () => {
    // Arrange & Act
    const items = createCustomerTypeMenuItems({ customerTypes: types, allLabel: "All" });

    // Assert
    expect(items).toEqual([
      {
        id: CUSTOMER_TYPE_NAV_ALL_ID,
        label: "All",
        url: customerListUrlWithCustomerType(),
        permissions: listPermissions,
        type: "item",
      },
      {
        id: `${CUSTOMER_TYPE_NAV_ID_PREFIX}type-b2b`,
        label: "B2B",
        url: customerListUrlWithCustomerType(types[0]),
        permissions: listPermissions,
        type: "item",
      },
      {
        id: `${CUSTOMER_TYPE_NAV_ID_PREFIX}type-default`,
        label: "Default",
        url: customerListUrlWithCustomerType(types[1]),
        permissions: listPermissions,
        type: "item",
      },
    ]);
  });

  it("caps type shortcuts so the submenu stays a handful", () => {
    // Arrange
    const manyTypes = Array.from({ length: 12 }, (_, index) => ({
      id: `type-${index}`,
      name: `Type ${index}`,
    }));

    // Act
    const items = createCustomerTypeMenuItems({ customerTypes: manyTypes, allLabel: "All" });

    // Assert
    expect(items[0]?.id).toBe(CUSTOMER_TYPE_NAV_ALL_ID);
    expect(items).toHaveLength(1 + MAX_CUSTOMER_TYPE_NAV_TYPES);
  });

  it("omits the type shortcut when there is only one type", () => {
    // Arrange & Act
    const items = createCustomerTypeMenuItems({
      customerTypes: [{ id: "type-default", name: "Default" }],
      allLabel: "All",
    });

    // Assert
    expect(items.map(item => item.label)).toEqual(["All"]);
  });

  it("still includes All when there are no types", () => {
    // Arrange & Act
    const items = createCustomerTypeMenuItems({ customerTypes: [], allLabel: "All" });

    // Assert
    expect(items).toEqual([
      {
        id: CUSTOMER_TYPE_NAV_ALL_ID,
        label: "All",
        url: customerListUrlWithCustomerType(),
        permissions: listPermissions,
        type: "item",
      },
    ]);
  });
});

describe("selectCustomerTypesForNav", () => {
  const types = [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Bravo" },
    { id: "c", name: "Charlie" },
    { id: "d", name: "Delta" },
  ];

  it("puts pinned types first, then the remaining name order", () => {
    // Arrange & Act
    const result = selectCustomerTypesForNav({
      customerTypes: types,
      pinnedIds: ["c", "a"],
      selectedTypeIds: [],
    });

    // Assert
    expect(result.map(type => type.id)).toEqual(["c", "a", "b", "d"]);
  });

  it("ignores pinned ids that are no longer in the catalog", () => {
    // Arrange & Act
    const result = selectCustomerTypesForNav({
      customerTypes: types,
      pinnedIds: ["gone", "b"],
      selectedTypeIds: [],
    });

    // Assert
    expect(result.map(type => type.id)).toEqual(["b", "a", "c", "d"]);
  });

  it("caps the list and keeps a selected type that would otherwise be dropped", () => {
    // Arrange & Act
    const result = selectCustomerTypesForNav({
      customerTypes: types,
      pinnedIds: [],
      selectedTypeIds: ["d"],
      limit: 2,
    });

    // Assert
    expect(result.map(type => type.id)).toEqual(["a", "d"]);
  });

  it("does not promote a type when several types are selected", () => {
    // Arrange & Act
    const result = selectCustomerTypesForNav({
      customerTypes: types,
      pinnedIds: [],
      selectedTypeIds: ["c", "d"],
      limit: 2,
    });

    // Assert
    expect(result.map(type => type.id)).toEqual(["a", "b"]);
  });
});

describe("getCustomerTypeIdsFromSearch", () => {
  it("reads indexed and bare customerTypes params", () => {
    // Arrange & Act & Assert
    expect(getCustomerTypeIdsFromSearch("?customerTypes%5B0%5D=type-b2b")).toEqual(["type-b2b"]);
    expect(getCustomerTypeIdsFromSearch("/customers/?customerTypes%5B0%5D=type-b2b")).toEqual([
      "type-b2b",
    ]);
    expect(getCustomerTypeIdsFromSearch("customerTypes=type-b2b&customerTypes=type-b2b")).toEqual([
      "type-b2b",
    ]);
    expect(getCustomerTypeIdsFromSearch("")).toEqual([]);
  });
});

describe("isCustomerTypeNavItem", () => {
  it("recognizes All and type shortcuts and ignores other items", () => {
    // Arrange & Act & Assert
    expect(isCustomerTypeNavItem({ id: CUSTOMER_TYPE_NAV_ALL_ID })).toBe(true);
    expect(isCustomerTypeNavItem({ id: `${CUSTOMER_TYPE_NAV_ID_PREFIX}type-1` })).toBe(true);
    expect(isCustomerTypeNavItem({ id: "customers" })).toBe(false);
  });
});
