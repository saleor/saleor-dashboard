import { productTypeUrl } from "@dashboard/productTypes/urls";
import { getMultipleUrlValues, withAppMountUri, withQuery } from "@dashboard/utils/urls";

describe("withQuery", () => {
  it("omits the query string when there are no params", () => {
    // Arrange / Act / Assert
    expect(withQuery("/product-types/id")).toBe("/product-types/id");
    expect(withQuery("/product-types/id", undefined)).toBe("/product-types/id");
    expect(withQuery("/product-types/id", {})).toBe("/product-types/id");
    expect(withQuery("/product-types/id", { action: undefined })).toBe("/product-types/id");
  });

  it("appends a single query string when params are present", () => {
    // Act
    const url = withQuery("/product-types/id", { action: "assign-attribute", type: "PRODUCT" });

    // Assert
    expect(url).toBe("/product-types/id?action=assign-attribute&type=PRODUCT");
  });
});

describe("productTypeUrl", () => {
  // A trailing "?" used to leak into LocationDescriptor.pathname, so opening a
  // dialog appended a second "?" and the params never parsed.
  it("does not emit a bare question mark without params", () => {
    // Act
    const url = productTypeUrl("UHJvZHVjdFR5cGU6Mg==");

    // Assert
    expect(url).toBe("/product-types/UHJvZHVjdFR5cGU6Mg%3D%3D");
  });

  it("encodes the id and appends dialog params", () => {
    // Act
    const url = productTypeUrl("UHJvZHVjdFR5cGU6Mg==", {
      action: "assign-attribute",
      type: "PRODUCT",
    });

    // Assert
    expect(url).toBe(
      "/product-types/UHJvZHVjdFR5cGU6Mg%3D%3D?action=assign-attribute&type=PRODUCT",
    );
  });
});

describe("getMultipleUrlValues", () => {
  it("Returns empty array if no value in url", () => {
    const params = new URLSearchParams();

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toEqual([]);
  });
  it("Returns single item array if 1 value in url", () => {
    const params = new URLSearchParams([
      ["fieldName", "value1"],
      ["otherField", "otherValue"],
    ]);

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toEqual(["value1"]);
  });
  it("Returns 2 item array if 2 values in url", () => {
    const params = new URLSearchParams([
      ["fieldName", "value1"],
      ["fieldName", "value2"],
      ["otherField", "otherValue"],
    ]);

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toEqual(["value1", "value2"]);
  });

  it("Works with real URL containing multiple values", () => {
    const url = new URL(
      "http://localhost:9000/translations/PL/products/UHJvZHVjdDoxNTc%3D?activeField=name&activeField=description&otherParam=value",
    );

    expect(getMultipleUrlValues(url.search, "activeField")).toEqual(["name", "description"]);
  });
});

describe("withAppMountUri", () => {
  afterEach(() => {
    window.__SALEOR_CONFIG__.APP_MOUNT_URI = "/";
  });

  it("prepends the mount point to router-relative paths", () => {
    // Arrange
    window.__SALEOR_CONFIG__.APP_MOUNT_URI = "/dashboard/";

    // Act / Assert
    expect(withAppMountUri("/products/id?")).toBe("/dashboard/products/id?");
    expect(withAppMountUri("products/id")).toBe("/dashboard/products/id");
  });

  it("leaves the path unchanged when mounted at root", () => {
    // Arrange
    window.__SALEOR_CONFIG__.APP_MOUNT_URI = "/";

    // Act / Assert
    expect(withAppMountUri("/products/id")).toBe("/products/id");
  });
});
