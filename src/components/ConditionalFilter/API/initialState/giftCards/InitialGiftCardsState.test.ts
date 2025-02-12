import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialGiftCardsStateResponse } from "./InitialGiftCardsState";

describe("ConditionalFilter / API / Page / InitialGiftCardsState", () => {
  it("should filter by currency", () => {
    // Arrange
    const initialPageState = InitialGiftCardsStateResponse.empty();

    initialPageState.currency = [
      {
        label: "USD",
        value: "usd",
        slug: "usd",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.currency", "usd"));
    const expectedOutput = [
      {
        label: "USD",
        value: "usd",
        slug: "usd",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by tags", () => {
    // Arrange
    const initialPageState = InitialGiftCardsStateResponse.empty();

    initialPageState.tags = [
      {
        label: "Tag 1",
        value: "tag-1",
        slug: "tag-1",
      },
      {
        label: "Tag 2",
        value: "tag-2",
        slug: "tag-2",
      },
      {
        label: "Tag 3",
        value: "tag-3",
        slug: "tag-3",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s2.tags", ["tag-1", "tag-3"]));
    const expectedOutput = [
      {
        label: "Tag 1",
        value: "tag-1",
        slug: "tag-1",
      },
      {
        label: "Tag 3",
        value: "tag-3",
        slug: "tag-3",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by products", () => {
    // Arrange
    const initialPageState = InitialGiftCardsStateResponse.empty();

    initialPageState.products = [
      {
        label: "Product 1",
        value: "product-1",
        slug: "product-1",
      },
      {
        label: "Product 2",
        value: "product-2",
        slug: "product-2",
      },
      {
        label: "Product 3",
        value: "product-3",
        slug: "product-3",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s2.products", ["product-1", "product-3"]));
    const expectedOutput = [
      {
        label: "Product 1",
        value: "product-1",
        slug: "product-1",
      },
      {
        label: "Product 3",
        value: "product-3",
        slug: "product-3",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by used by", () => {
    // Arrange
    const initialPageState = InitialGiftCardsStateResponse.empty();

    initialPageState.usedBy = [
      {
        label: "Customer 1",
        value: "customer-1",
        slug: "customer-1",
      },
      {
        label: "Customer 2",
        value: "customer-2",
        slug: "customer-2",
      },
      {
        label: "Customer 3",
        value: "customer-3",
        slug: "customer-3",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s2.usedBy", ["customer-1", "customer-3"]));
    const expectedOutput = [
      {
        label: "Customer 1",
        value: "customer-1",
        slug: "customer-1",
      },
      {
        label: "Customer 3",
        value: "customer-3",
        slug: "customer-3",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by is active", () => {
    // Arrange
    const initialPageState = InitialGiftCardsStateResponse.empty();

    initialPageState.isActive = [
      {
        label: "Yes",
        value: "yes",
        slug: "yes",
      },
      {
        label: "No",
        value: "no",
        slug: "no",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s2.isActive", "yes"));
    const expectedOutput = [
      {
        label: "Yes",
        value: "yes",
        slug: "yes",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
