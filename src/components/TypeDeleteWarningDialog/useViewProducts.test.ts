import { renderHook } from "@testing-library/react-hooks";

import { useFlag } from "../../featureFlags/useFlag";
import { useViewProducts } from "./useViewProducts";

jest.mock("../../featureFlags/useFlag", () => ({
  useFlag: jest.fn(),
}));

describe("useViewProducts", () => {
  const defaultNavigationLink = "defaultLink";
  const productTypeBaseData = [
    {
      id: "123",
      name: "Audiobooks",
      slug: "audiobooks",
    },
  ];

  it("should return the legacy URL when productFiltersFlag is false", () => {
    // Arrange
    (useFlag as jest.Mock).mockImplementation(() => ({
      enabled: false,
      payload: "default",
    }));

    // Act
    const { result } = renderHook(() =>
      useViewProducts({ defaultNavigationLink, productTypeBaseData }),
    );

    // Assert
    expect(result.current).toBe(defaultNavigationLink);
  });

  it("should return the new URL when productFiltersFlag is true", () => {
    // Arrange
    (useFlag as jest.Mock).mockImplementation(() => ({
      enabled: true,
      payload: "default",
    }));

    // Act
    const { result } = renderHook(() =>
      useViewProducts({ defaultNavigationLink, productTypeBaseData }),
    );

    // Assert
    const expectedQuery = "0[s0.productType][0]=audiobooks";
    const receivedQuery = decodeURIComponent(result.current.split("?")[1]);

    expect(receivedQuery).toBe(expectedQuery);
  });

  it("should return correct url when multiple product types are selected", () => {
    // Arrange
    (useFlag as jest.Mock).mockImplementation(() => ({
      enabled: true,
      payload: "default",
    }));

    const multipleProductTypeBaseData = [
      ...productTypeBaseData,
      {
        id: "456",
        name: "Shirts",
        slug: "shirts",
      },
    ];

    // Act
    const { result } = renderHook(() =>
      useViewProducts({ defaultNavigationLink, productTypeBaseData: multipleProductTypeBaseData }),
    );

    // Assert
    const expectedQuery = "0[s2.productType][0]=audiobooks&0[s2.productType][1]=shirts";

    const receivedQuery = decodeURIComponent(result.current.split("?")[1]);

    expect(receivedQuery).toBe(expectedQuery);
  });
});
