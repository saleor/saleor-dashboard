import { piiFilterMapper } from "./cachePersistence";

describe("piiFilterMapper", () => {
  it("removes User entries from cache data", async () => {
    // Arrange
    const cacheData = JSON.stringify({
      ROOT_QUERY: { __typename: "Query" },
      "User:abc123": { __typename: "User", id: "abc123", email: "test@example.com" },
      "Product:1": { __typename: "Product", id: "1", name: "T-Shirt" },
    });

    // Act
    const result = JSON.parse(await piiFilterMapper(cacheData));

    // Assert
    expect(result["User:abc123"]).toBeUndefined();
    expect(result["Product:1"]).toBeDefined();
    expect(result.ROOT_QUERY).toBeDefined();
  });

  it("removes Address entries from cache data", async () => {
    // Arrange
    const cacheData = JSON.stringify({
      ROOT_QUERY: { __typename: "Query" },
      "Address:addr1": {
        __typename: "Address",
        id: "addr1",
        firstName: "John",
        streetAddress1: "123 Main St",
      },
      "Order:1": { __typename: "Order", id: "1" },
    });

    // Act
    const result = JSON.parse(await piiFilterMapper(cacheData));

    // Assert
    expect(result["Address:addr1"]).toBeUndefined();
    expect(result["Order:1"]).toBeDefined();
  });

  it("removes both User and Address entries simultaneously", async () => {
    // Arrange
    const cacheData = JSON.stringify({
      ROOT_QUERY: { __typename: "Query" },
      "User:u1": { __typename: "User", id: "u1", email: "a@b.com" },
      "User:u2": { __typename: "User", id: "u2", email: "c@d.com" },
      "Address:a1": { __typename: "Address", id: "a1", city: "Berlin" },
      "Address:a2": { __typename: "Address", id: "a2", city: "Warsaw" },
      "Product:p1": { __typename: "Product", id: "p1", name: "Hat" },
      "Category:c1": { __typename: "Category", id: "c1", name: "Apparel" },
    });

    // Act
    const result = JSON.parse(await piiFilterMapper(cacheData));

    // Assert
    expect(Object.keys(result)).toEqual(["ROOT_QUERY", "Product:p1", "Category:c1"]);
  });

  it("preserves cache data when no sensitive types are present", async () => {
    // Arrange
    const cacheData = JSON.stringify({
      ROOT_QUERY: { __typename: "Query" },
      "Product:1": { __typename: "Product", id: "1" },
      "Category:2": { __typename: "Category", id: "2" },
    });

    // Act
    const result = JSON.parse(await piiFilterMapper(cacheData));

    // Assert
    expect(Object.keys(result)).toEqual(["ROOT_QUERY", "Product:1", "Category:2"]);
  });

  it("handles empty cache data", async () => {
    // Arrange
    const cacheData = JSON.stringify({});

    // Act
    const result = JSON.parse(await piiFilterMapper(cacheData));

    // Assert
    expect(result).toEqual({});
  });
});
