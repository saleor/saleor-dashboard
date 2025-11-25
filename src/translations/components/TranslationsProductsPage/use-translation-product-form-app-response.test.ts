import { ProductTranslationFragment } from "@dashboard/graphql";
import { TranslationInputFieldName } from "@dashboard/translations/types";
import { renderHook } from "@testing-library/react-hooks";

import { useTranslationProductFormAppResponse } from "./use-translation-product-form-app-response";

// Mock the app extension hook
jest.mock(
  "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider",
  () => ({
    useActiveAppExtension: jest.fn(),
  }),
);

const { useActiveAppExtension } = jest.requireMock(
  "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider",
);

describe("useTranslationProductFormAppResponse", () => {
  const mockProductData: ProductTranslationFragment["product"] = {
    __typename: "Product",
    id: "product-1",
    name: "Original Product Name",
    description: "Original Description",
    seoDescription: "Original SEO Description",
    seoTitle: "Original SEO Title",
  };

  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {},
    });
  });

  it("should return empty app response fields when no frames exist", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {},
    });

    // Act
    const { result } = renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(result.current.appResponseFields).toEqual({
      productName: undefined,
      productDescription: undefined,
      seoDescription: undefined,
      seoName: undefined,
    });
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("should return app response fields from the last frame", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Translated Name 1" },
              productDescription: { value: "Translated Description 1" },
              seoDescription: { value: "Translated SEO Desc 1" },
              seoName: { value: "Translated SEO Name 1" },
            },
          },
          {
            form: "product-translate",
            fields: {
              productName: { value: "Translated Name 2" },
              productDescription: { value: "Translated Description 2" },
              seoDescription: { value: "Translated SEO Desc 2" },
              seoName: { value: "Translated SEO Name 2" },
            },
          },
        ],
      },
    });

    // Act
    const { result } = renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(result.current.appResponseFields).toEqual({
      productName: "Translated Name 2",
      productDescription: "Translated Description 2",
      seoDescription: "Translated SEO Desc 2",
      seoName: "Translated SEO Name 2",
    });
  });

  it("should call onEdit with dirty fields when app response differs from product data", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Updated Name" },
              productDescription: { value: "Updated Description" },
              seoDescription: { value: "Original SEO Description" },
              seoName: { value: "Original SEO Title" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).toHaveBeenCalledWith([
      TranslationInputFieldName.name,
      TranslationInputFieldName.description,
    ]);
  });

  it("should use cached values over product data when available", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Cached Name" },
              productDescription: { value: "Cached Description" },
              seoDescription: { value: "Cached SEO Description" },
              seoName: { value: "Cached SEO Title" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        cachedProductName: "Cached Name",
        cachedProductDescription: "Cached Description",
        cachedProductSeoDescription: "Cached SEO Description",
        cachedProductSeoName: "Cached SEO Title",
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    // No dirty fields because app response matches cached values
    expect(mockOnEdit).toHaveBeenCalledWith([]);
  });

  it("should detect dirty fields when app response differs from cached values", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Updated Name" },
              productDescription: { value: "Cached Description" },
              seoDescription: { value: "Updated SEO Description" },
              seoName: { value: "Cached SEO Title" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        cachedProductName: "Cached Name",
        cachedProductDescription: "Cached Description",
        cachedProductSeoDescription: "Cached SEO Description",
        cachedProductSeoName: "Cached SEO Title",
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).toHaveBeenCalledWith([
      TranslationInputFieldName.name,
      TranslationInputFieldName.seoDescription,
    ]);
  });

  it("should call onEdit with all dirty field names when all fields differ", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "New Name" },
              productDescription: { value: "New Description" },
              seoDescription: { value: "New SEO Description" },
              seoName: { value: "New SEO Title" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).toHaveBeenCalledWith([
      TranslationInputFieldName.name,
      TranslationInputFieldName.description,
      TranslationInputFieldName.seoDescription,
      TranslationInputFieldName.seoTitle,
    ]);
  });

  it("should call onEdit with empty array when no fields differ", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Original Product Name" },
              productDescription: { value: "Original Description" },
              seoDescription: { value: "Original SEO Description" },
              seoName: { value: "Original SEO Title" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).toHaveBeenCalledWith([]);
  });

  it("should provide a resetKey ref that can be used to track changes", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Name 1" },
              productDescription: { value: "Description 1" },
              seoDescription: { value: "SEO Desc 1" },
              seoName: { value: "SEO Name 1" },
            },
          },
        ],
      },
    });

    // Act
    const { result } = renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(result.current.resetKey).toBeDefined();
    expect(result.current.resetKey.current).toBeGreaterThan(0);
    expect(typeof result.current.resetKey.current).toBe("number");
  });

  it("should not call onEdit when lastFrame is null", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": null,
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("should not call onEdit when productData is null", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Name" },
              productDescription: { value: "Description" },
              seoDescription: { value: "SEO Description" },
              seoName: { value: "SEO Name" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: null as any,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("should handle partial frame fields and mark missing fields as dirty", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Updated Name" },
              // Other fields are missing - will be undefined and differ from product data
            },
          },
        ],
      },
    });

    // Act
    const { result } = renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(result.current.appResponseFields).toEqual({
      productName: "Updated Name",
      productDescription: undefined,
      seoDescription: undefined,
      seoName: undefined,
    });
    // All fields are dirty: productName is updated, others are undefined (different from product data)
    expect(mockOnEdit).toHaveBeenCalledWith([
      TranslationInputFieldName.name,
      TranslationInputFieldName.description,
      TranslationInputFieldName.seoDescription,
      TranslationInputFieldName.seoTitle,
    ]);
  });

  it("should detect seoTitle field changes correctly", () => {
    // Arrange
    useActiveAppExtension.mockReturnValue({
      framesByFormType: {
        "product-translate": [
          {
            form: "product-translate",
            fields: {
              productName: { value: "Original Product Name" },
              productDescription: { value: "Original Description" },
              seoDescription: { value: "Original SEO Description" },
              seoName: { value: "Updated SEO Title" },
            },
          },
        ],
      },
    });

    // Act
    renderHook(() =>
      useTranslationProductFormAppResponse({
        productData: mockProductData,
        onEdit: mockOnEdit,
      }),
    );

    // Assert
    expect(mockOnEdit).toHaveBeenCalledWith([TranslationInputFieldName.seoTitle]);
  });
});
