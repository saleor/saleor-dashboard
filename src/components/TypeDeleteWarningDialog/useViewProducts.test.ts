import { renderHook } from "@testing-library/react-hooks";

import { useViewProducts } from "./useViewProducts";

describe("useViewProducts", () => {
  const productTypeBaseData = [
    {
      id: "123",
      name: "Audiobooks",
      slug: "audiobooks",
    },
  ];

  it("should return URL with product type filtered", () => {
    // Arrange & Act
    const { result } = renderHook(() => useViewProducts({ productTypeBaseData }));

    // Assert
    expect(result.current).not.toBeNull();

    const expectedQuery = "0[s0.productType][0]=audiobooks";
    const receivedQuery = decodeURIComponent(result.current!.split("?")[1]);

    expect(receivedQuery).toBe(expectedQuery);
  });

  it("should return URL with product type filtered when multiple product types are selected", () => {
    // Arrange
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
      useViewProducts({ productTypeBaseData: multipleProductTypeBaseData }),
    );

    // Assert
    expect(result.current).not.toBeNull();

    const expectedQuery = "0[s2.productType][0]=audiobooks&0[s2.productType][1]=shirts";

    const receivedQuery = decodeURIComponent(result.current!.split("?")[1]);

    expect(receivedQuery).toBe(expectedQuery);
  });
});
