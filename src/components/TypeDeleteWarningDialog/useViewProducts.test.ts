import { renderHook } from "@testing-library/react-hooks";

import { useFlag } from "../../featureFlags/useFlag";
import { useViewProducts } from "./useViewProducts";

jest.mock("../../featureFlags/useFlag", () => ({
  useFlag: jest.fn(),
}));

describe("useViewProducts", () => {
  const defaultNavigationLink = "defaultLink";
  const productTypeBaseData = {
    id: "123",
    name: "ProductTypeName",
    slug: "product-type-slug",
  };

  it("should return the legacy URL when productFiltersFlag is false", () => {
    // Arrange & Act
    (useFlag as jest.Mock).mockImplementation(() => ({
      enabled: false,
      payload: "default",
    }));

    const { result } = renderHook(() =>
      useViewProducts({ defaultNavigationLink, productTypeBaseData }),
    );

    // Assert
    expect(result.current.getViewProductsURL()).toBe(defaultNavigationLink);
  });

  it("should return the new URL when productFiltersFlag is true", () => {
    // Arrange & Act
    (useFlag as jest.Mock).mockImplementation(() => ({
      enabled: true,
      payload: "default",
    }));

    const { result } = renderHook(() =>
      useViewProducts({ defaultNavigationLink, productTypeBaseData }),
    );

    // Assert
    expect(result.current.getViewProductsURL()).toBe(
      "/products?0%5Bs0.productType%5D=product-type-slug",
    );
  });
});
