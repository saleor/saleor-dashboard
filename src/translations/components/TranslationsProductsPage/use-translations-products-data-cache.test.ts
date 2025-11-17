import { renderHook } from "@testing-library/react-hooks";

import { useTranslationsProductsDataCache } from "./use-translations-products-data-cache";

describe("useTranslationsProductsDataCache", () => {
  it("should initialize all cached values as null", () => {
    // Arrange & Act
    const { result } = renderHook(() => useTranslationsProductsDataCache());

    // Assert
    expect(result.current.cachedProductName).toBeNull();
    expect(result.current.cachedProductDescription).toBeNull();
    expect(result.current.cachedProductSeoName).toBeNull();
    expect(result.current.cachedProductSeoDescription).toBeNull();
  });

  it("should cache product name", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    // Act
    result.current.setCachedFormField("productName", "Test Product");
    rerender();

    // Assert
    expect(result.current.cachedProductName).toBe("Test Product");
  });

  it("should cache product description", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    // Act
    result.current.setCachedFormField("productDescription", "Test Description");
    rerender();

    // Assert
    expect(result.current.cachedProductDescription).toBe("Test Description");
  });

  it("should cache SEO name", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    // Act
    result.current.setCachedFormField("seoName", "test-seo");
    rerender();

    // Assert
    expect(result.current.cachedProductSeoName).toBe("test-seo");
  });

  it("should cache SEO description", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    // Act
    result.current.setCachedFormField("seoDescription", "SEO description");
    rerender();

    // Assert
    expect(result.current.cachedProductSeoDescription).toBe("SEO description");
  });

  it("should cache multiple fields independently", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    // Act
    result.current.setCachedFormField("productName", "Product A");
    result.current.setCachedFormField("seoName", "product-a");
    result.current.setCachedFormField("productDescription", "Description A");
    rerender();

    // Assert
    expect(result.current.cachedProductName).toBe("Product A");
    expect(result.current.cachedProductSeoName).toBe("product-a");
    expect(result.current.cachedProductDescription).toBe("Description A");
    expect(result.current.cachedProductSeoDescription).toBeNull();
  });

  it("should overwrite existing cached value", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    result.current.setCachedFormField("productName", "First Value");

    // Act
    result.current.setCachedFormField("productName", "Second Value");
    rerender();

    // Assert
    expect(result.current.cachedProductName).toBe("Second Value");
  });

  it("should reset all cached values to null", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    result.current.setCachedFormField("productName", "Test Product");
    result.current.setCachedFormField("productDescription", "Test Description");
    result.current.setCachedFormField("seoName", "test-seo");
    result.current.setCachedFormField("seoDescription", "SEO description");

    // Act
    result.current.resetCache();
    rerender();

    // Assert
    expect(result.current.cachedProductName).toBeNull();
    expect(result.current.cachedProductDescription).toBeNull();
    expect(result.current.cachedProductSeoName).toBeNull();
    expect(result.current.cachedProductSeoDescription).toBeNull();
  });

  it("should allow setting values after reset", () => {
    // Arrange
    const { result, rerender } = renderHook(() => useTranslationsProductsDataCache());

    result.current.setCachedFormField("productName", "Initial");
    result.current.resetCache();

    // Act
    result.current.setCachedFormField("productName", "After Reset");
    rerender();

    // Assert
    expect(result.current.cachedProductName).toBe("After Reset");
  });
});
