import { type ExtensionListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

import {
  type ExtensionSnapshotNode,
  getExtensionsSnapshotKey,
  readExtensionsSnapshot,
  writeExtensionsSnapshot,
} from "./extensionsSnapshotStorage";

type Node = RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>[number];

const buildNode = (overrides: Partial<Node> = {}): ExtensionSnapshotNode =>
  ({
    __typename: "AppExtension",
    id: "ext1",
    accessToken: "secret-token",
    permissions: [],
    url: "https://example.com/ext1",
    label: "Extension 1",
    mountName: "HOMEPAGE_WIDGETS",
    targetName: "WIDGET",
    settings: {},
    app: {
      __typename: "App",
      id: "app1",
      name: "App 1",
      appUrl: "https://example.com",
      brand: null,
    },
    ...overrides,
  }) as ExtensionSnapshotNode;

describe("extensionsSnapshotStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("derives a stable, order-independent key from the mount list", () => {
    // Arrange & Act
    const keyA = getExtensionsSnapshotKey(["HOMEPAGE_WIDGETS", "PRODUCT_DETAILS_WIDGETS"]);
    const keyB = getExtensionsSnapshotKey(["PRODUCT_DETAILS_WIDGETS", "HOMEPAGE_WIDGETS"]);

    // Assert
    expect(keyA).toBe(keyB);
  });

  it("round-trips nodes for a given key", () => {
    // Arrange
    const key = getExtensionsSnapshotKey(["HOMEPAGE_WIDGETS"]);
    const nodes = [buildNode({ id: "a" }), buildNode({ id: "b" })];

    // Act
    writeExtensionsSnapshot(key, nodes);

    const read = readExtensionsSnapshot(key);

    // Assert
    expect(read?.map(n => n.id)).toEqual(["a", "b"]);
  });

  it("never persists accessToken", () => {
    // Arrange
    const key = getExtensionsSnapshotKey(["HOMEPAGE_WIDGETS"]);

    // Act
    writeExtensionsSnapshot(key, [buildNode({ accessToken: "secret-token" })]);

    const read = readExtensionsSnapshot(key);

    // Assert
    expect(read?.[0].accessToken).toBe("");
    expect(JSON.stringify(read)).not.toContain("secret-token");
  });

  it("returns null for a missing key", () => {
    // Arrange & Act & Assert
    expect(readExtensionsSnapshot(getExtensionsSnapshotKey(["HOMEPAGE_WIDGETS"]))).toBeNull();
  });

  it("returns null and does not throw on corrupt JSON", () => {
    // Arrange
    const key = getExtensionsSnapshotKey(["HOMEPAGE_WIDGETS"]);

    localStorage.setItem(key, "{not-json");

    // Act & Assert
    expect(() => readExtensionsSnapshot(key)).not.toThrow();
    expect(readExtensionsSnapshot(key)).toBeNull();
  });

  it("isolates snapshots per key", () => {
    // Arrange
    const homeKey = getExtensionsSnapshotKey(["HOMEPAGE_WIDGETS"]);
    const productKey = getExtensionsSnapshotKey(["PRODUCT_DETAILS_WIDGETS"]);

    // Act
    writeExtensionsSnapshot(homeKey, [buildNode({ id: "home" })]);
    writeExtensionsSnapshot(productKey, [buildNode({ id: "product" })]);

    // Assert
    expect(readExtensionsSnapshot(homeKey)?.[0].id).toBe("home");
    expect(readExtensionsSnapshot(productKey)?.[0].id).toBe("product");
  });
});
