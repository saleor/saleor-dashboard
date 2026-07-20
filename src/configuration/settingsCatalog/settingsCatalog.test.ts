import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { settingsCatalogEntries } from "./catalog";
import { allSettingsHashes, settingsHashes } from "./hashes";
import { canAccessSettingsEntry, resolveSettingsCatalog } from "./resolve";
import { searchSettingsCatalog } from "./search";

const intl = createIntl({ locale: "en", messages: {} });

const createUser = (permissions: PermissionEnum[]): UserFragment =>
  ({
    __typename: "User",
    id: "user-1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    isStaff: true,
    isActive: true,
    avatar: null,
    dateJoined: "2020-01-01",
    restrictedAccessToChannels: false,
    metadata: [],
    accessibleChannels: [],
    userPermissions: permissions.map(code => ({
      __typename: "UserPermission",
      code,
      name: code,
    })),
  }) as unknown as UserFragment;

describe("settingsCatalog", () => {
  it("has unique entry ids", () => {
    // Arrange
    const ids = settingsCatalogEntries.map(entry => entry.id);

    // Assert
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only known hashes when a setting or section declares one", () => {
    // Arrange
    const knownHashes = new Set(allSettingsHashes);

    // Act — channel concepts may omit hash until channel UI has anchors
    const hashedEntries = settingsCatalogEntries.filter(entry => Boolean(entry.hash));

    // Assert
    expect(hashedEntries.length).toBeGreaterThan(0);
    hashedEntries.forEach(entry => {
      if (!entry.hash) {
        return;
      }

      expect(knownHashes.has(entry.hash)).toBe(true);
      expect(entry.href.endsWith(`#${entry.hash}`)).toBe(true);
    });
  });

  it("indexes channel-only concepts for MANAGE_CHANNELS without duplicating order matrix fields", () => {
    // Arrange
    const channelsOnly = createUser([PermissionEnum.MANAGE_CHANNELS]);
    const ordersOnly = createUser([PermissionEnum.MANAGE_ORDERS]);

    // Act
    const forChannels = resolveSettingsCatalog(settingsCatalogEntries, intl, channelsOnly);
    const forOrders = resolveSettingsCatalog(settingsCatalogEntries, intl, ordersOnly);

    // Assert
    expect(forChannels.some(entry => entry.id === "channels.transaction-flow")).toBe(true);
    expect(forChannels.some(entry => entry.id === "channels.allocation-strategy")).toBe(true);
    expect(forChannels.some(entry => entry.id === "orders.automatically-confirm")).toBe(false);
    expect(forOrders.some(entry => entry.id === "channels.transaction-flow")).toBe(false);
    expect(forOrders.some(entry => entry.id === "orders.automatically-confirm")).toBe(true);
  });

  it("finds channel transaction flow via authorize alias", () => {
    // Arrange
    const user = createUser([PermissionEnum.MANAGE_CHANNELS]);
    const catalog = resolveSettingsCatalog(settingsCatalogEntries, intl, user);

    // Act
    const results = searchSettingsCatalog(catalog, "authorize");

    // Assert
    expect(results.some(entry => entry.id === "channels.transaction-flow")).toBe(true);
  });

  it("keeps settingsHashes values unique", () => {
    // Arrange
    const values = Object.values(settingsHashes);

    // Assert
    expect(new Set(values).size).toBe(values.length);
  });

  it("filters entries by permissions", () => {
    // Arrange
    const ordersOnly = createUser([PermissionEnum.MANAGE_ORDERS]);
    const settingsOnly = createUser([PermissionEnum.MANAGE_SETTINGS]);

    // Act
    const forOrders = resolveSettingsCatalog(settingsCatalogEntries, intl, ordersOnly);
    const forSettings = resolveSettingsCatalog(settingsCatalogEntries, intl, settingsOnly);

    // Assert
    expect(forOrders.some(entry => entry.id === "orders.automatically-confirm")).toBe(true);
    expect(forOrders.some(entry => entry.id === "store.hub")).toBe(false);
    expect(forSettings.some(entry => entry.id === "store.hub")).toBe(true);
    expect(forSettings.some(entry => entry.id === "orders.automatically-confirm")).toBe(false);
  });

  it("allows hub access when user has any listed permission", () => {
    // Arrange
    const entry = settingsCatalogEntries.find(item => item.id === "orders.hub");
    const user = createUser([PermissionEnum.MANAGE_ORDERS]);

    // Assert
    expect(entry).toBeDefined();

    if (!entry) {
      return;
    }

    expect(canAccessSettingsEntry(entry, user)).toBe(true);
  });

  it("finds order confirmation via alias keywords", () => {
    // Arrange
    const user = createUser([PermissionEnum.MANAGE_ORDERS, PermissionEnum.MANAGE_SETTINGS]);
    const catalog = resolveSettingsCatalog(settingsCatalogEntries, intl, user);

    // Act
    const results = searchSettingsCatalog(catalog, "order confirmation");

    // Assert
    expect(results.some(entry => entry.id === "orders.automatically-confirm")).toBe(true);
  });

  it("finds refund settings by title", () => {
    // Arrange
    const user = createUser([PermissionEnum.MANAGE_SETTINGS]);
    const catalog = resolveSettingsCatalog(settingsCatalogEntries, intl, user);

    // Act
    const results = searchSettingsCatalog(catalog, "refund reasons");

    // Assert
    expect(results.some(entry => entry.id === "refunds.refund-reasons")).toBe(true);
  });

  it("returns the full catalog when the query is empty", () => {
    // Arrange
    const user = createUser([PermissionEnum.MANAGE_SETTINGS]);
    const catalog = resolveSettingsCatalog(settingsCatalogEntries, intl, user);

    // Act
    const results = searchSettingsCatalog(catalog, "  ");

    // Assert
    expect(results).toEqual(catalog);
  });
});
