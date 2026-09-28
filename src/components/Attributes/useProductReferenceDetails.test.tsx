import { MockedProvider } from "@apollo/client/testing";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";
import { type ReactNode } from "react";

import {
  mapProductReferenceDetails,
  mapVariantReferenceDetails,
  mergeReferenceDetails,
  useProductReferenceDetails,
} from "./useProductReferenceDetails";

const wrapper = ({ children }: { children: ReactNode }) => (
  <MockedProvider addTypename={false} mocks={[]}>
    {children}
  </MockedProvider>
);

describe("mapProductReferenceDetails", () => {
  it("maps product thumbnails by id", () => {
    // Arrange / Act
    const details = mapProductReferenceDetails({
      products: {
        edges: [
          {
            node: {
              id: "p1",
              thumbnail: { url: "https://example.com/cubes.jpg" },
              category: { name: "Furniture" },
              productType: { name: "Table" },
            },
          },
        ],
      },
    });

    // Assert
    expect(details.get("p1")).toEqual({
      id: "p1",
      categoryName: "Furniture",
      productTypeName: "Table",
      thumbnailUrl: "https://example.com/cubes.jpg",
    });
  });
});

describe("mapVariantReferenceDetails", () => {
  it("maps variant names, parent product, and thumbnail by id", () => {
    // Arrange / Act
    const details = mapVariantReferenceDetails({
      productVariants: {
        edges: [
          {
            node: {
              id: "v1",
              name: "44 / White",
              product: {
                name: "White Plimsolls",
                thumbnail: { url: "https://example.com/shoe.jpg" },
              },
            },
          },
        ],
      },
    });

    // Assert
    expect(details.get("v1")).toEqual({
      id: "v1",
      variantName: "44 / White",
      productName: "White Plimsolls",
      thumbnailUrl: "https://example.com/shoe.jpg",
    });
  });
});

describe("mergeReferenceDetails", () => {
  it("fills variant names and thumbs from fetched details", () => {
    // Arrange
    const details = new Map([
      [
        "v1",
        {
          id: "v1",
          variantName: "44 / White",
          productName: "White Plimsolls",
          thumbnailUrl: "https://example.com/shoe.jpg",
        },
      ],
    ]);

    // Act
    const values = mergeReferenceDetails(
      [{ label: "White Plimsolls: 44 / White", value: "v1" }],
      details,
    );

    // Assert
    expect(values[0]).toEqual({
      label: "44 / White",
      value: "v1",
      caption: "White Plimsolls",
      thumbnailUrl: "https://example.com/shoe.jpg",
    });
  });
});

describe("useProductReferenceDetails", () => {
  it("skips the query for non-product references", () => {
    // Arrange / Act
    const { result } = renderHook(
      () =>
        useProductReferenceDetails({
          ids: ["p1"],
          entityType: AttributeEntityTypeEnum.COLLECTION,
        }),
      { wrapper },
    );

    // Assert
    expect(result.current.size).toBe(0);
  });
});
