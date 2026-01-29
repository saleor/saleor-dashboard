import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  ProductMediaType,
  ProductVariantFragment,
  WeightUnitsEnum,
} from "@dashboard/graphql";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Wrapper from "../../../../testUtils/wrapper";
import { ProductVariantPage } from "./ProductVariantPage";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("ProductVariantPage - Reference Attribute Caching", () => {
  const mockYellowPlimsollsProduct = {
    id: "UHJvZHVjdDo4Nw==",
    name: "Yellow Plimsolls",
    __typename: "Product" as const,
    thumbnail: { url: "yellow-thumb.jpg", __typename: "Image" as const },
    productType: {
      id: "UHJvZHVjdFR5cGU6MTM=",
      name: "Shoe",
      hasVariants: true,
      __typename: "ProductType" as const,
    },
    channelListings: [
      {
        id: "123",
        __typename: "ProductChannelListing" as const,
        isPublished: true,
        publishedAt: "2023-01-01",
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2023-01-01",
        visibleInListings: true,
        channel: {
          id: "1",
          name: "Default",
          slug: "default",
          currencyCode: "USD",
          __typename: "Channel" as const,
        },
      },
    ],
    variants: null,
    collections: null,
  };

  const mockWhitePlimsollsProduct = {
    id: "UHJvZHVjdDo4OA==",
    name: "White Plimsolls",
    __typename: "Product" as const,
    thumbnail: { url: "white-thumb.jpg", __typename: "Image" as const },
    productType: {
      id: "UHJvZHVjdFR5cGU6MTM=",
      name: "Shoe",
      hasVariants: true,
      __typename: "ProductType" as const,
    },
    channelListings: [
      {
        id: "124",
        __typename: "ProductChannelListing" as const,
        isPublished: true,
        publishedAt: "2023-01-01",
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2023-01-01",
        visibleInListings: true,
        channel: {
          id: "1",
          name: "Default",
          slug: "default",
          currencyCode: "USD",
          __typename: "Channel" as const,
        },
      },
    ],
    variants: null,
    collections: null,
  };

  const mockVariant: ProductVariantFragment = {
    __typename: "ProductVariant",
    id: "UHJvZHVjdFZhcmlhbnQ6MTQzMw==",
    name: "Test Variant",
    sku: "TEST-SKU",
    quantityLimitPerCustomer: null,
    trackInventory: true,
    preorder: null,
    metadata: [],
    privateMetadata: [],
    media: [],
    channelListings: [
      {
        id: "123",
        __typename: "ProductVariantChannelListing" as const,
        channel: {
          __typename: "Channel" as const,
          currencyCode: "USD",
          id: "channel-1",
          name: "Default Channel",
        },
        price: {
          __typename: "Money" as const,
          amount: 10.0,
          currency: "USD",
        },
        costPrice: {
          __typename: "Money" as const,
          amount: 5.0,
          currency: "USD",
        },
        preorderThreshold: null,
      },
    ],
    stocks: [],
    weight: {
      __typename: "Weight" as const,
      unit: WeightUnitsEnum.KG,
      value: 1.0,
    },
    // Key: nonSelectionAttributes with 1 existing reference (Yellow Plimsolls)
    nonSelectionAttributes: [
      {
        __typename: "SelectedAttribute" as const,
        attribute: {
          __typename: "Attribute" as const,
          id: "QXR0cmlidXRlOjY4MQ==",
          name: "Reference",
          slug: "reference",
          inputType: AttributeInputTypeEnum.REFERENCE,
          entityType: AttributeEntityTypeEnum.PRODUCT,
          valueRequired: true,
          unit: null,
          referenceTypes: [
            {
              id: "UHJvZHVjdFR5cGU6MTM=",
              name: "Shoe",
              __typename: "ProductType" as const,
            },
          ],
          choices: {
            __typename: "AttributeValueCountableConnection" as const,
            pageInfo: {
              __typename: "PageInfo" as const,
              endCursor: "end",
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: "start",
            },
            edges: [],
          },
        },
        values: [
          {
            __typename: "AttributeValue" as const,
            id: "QXR0cmlidXRlVmFsdWU6MTUyOA==",
            name: "Yellow Plimsolls",
            slug: "1433_87",
            file: null,
            reference: "UHJvZHVjdDo4Nw==", // Yellow Plimsolls product ID
            boolean: null,
            date: null,
            dateTime: null,
            value: "",
            plainText: null,
            richText: null,
          },
        ],
      },
    ],
    selectionAttributes: [],
    product: {
      __typename: "Product" as const,
      id: "UHJvZHVjdDo5NjU=",
      name: "Test Product",
      defaultVariant: {
        __typename: "ProductVariant" as const,
        id: "default-variant-id",
      },
      variants: [
        {
          __typename: "ProductVariant" as const,
          id: "UHJvZHVjdFZhcmlhbnQ6MTQzMw==",
          name: "Test Variant",
          sku: "TEST-SKU",
          media: [],
        },
      ],
      thumbnail: {
        __typename: "Image" as const,
        url: "test-thumb.jpg",
      },
      productType: {
        __typename: "ProductType" as const,
        id: "product-type-1",
        name: "Default Product Type",
        hasVariants: true,
      },
      channelListings: [
        {
          __typename: "ProductChannelListing" as const,
          id: "listing-1",
          isPublished: true,
          publishedAt: "2023-01-01",
          channel: {
            __typename: "Channel" as const,
            id: "channel-1",
            name: "Default Channel",
            currencyCode: "USD",
          },
        },
      ],
      media: [
        {
          __typename: "ProductMedia" as const,
          id: "media-1",
          alt: "Test image",
          sortOrder: 0,
          url: "test-image.jpg",
          type: ProductMediaType.IMAGE,
          oembedData: "{}",
        },
      ],
    },
  };

  const defaultProps = {
    productId: "UHJvZHVjdDo5NjU=",
    assignReferencesAttributeId: undefined,
    defaultVariantId: "default-variant-id",
    defaultWeightUnit: "kg",
    errors: [],
    hasVariants: true,
    channelErrors: [],
    header: "Edit Variant",
    variant: mockVariant,
    saveButtonBarState: "default" as const,
    channels: [],
    referenceProducts: [mockYellowPlimsollsProduct, mockWhitePlimsollsProduct],
    referencePages: [],
    referenceCategories: [],
    referenceCollections: [],
    attributeValues: [],
    onSubmit: jest.fn(),
    onDelete: jest.fn(),
    onVariantPreorderDeactivate: jest.fn(),
    variantDeactivatePreoderButtonState: "default" as const,
    onVariantReorder: jest.fn(),
    onSetDefaultVariant: jest.fn(),
    onWarehouseConfigure: jest.fn(),
    fetchAttributeValues: jest.fn(),
    onAssignReferencesClick: jest.fn(),
    onCloseDialog: jest.fn(),
    onAttributeSelectBlur: jest.fn(),
    fetchReferenceProducts: jest.fn(),
    fetchReferencePages: jest.fn(),
    fetchReferenceCategories: jest.fn(),
    fetchReferenceCollections: jest.fn(),
    fetchMoreWarehouses: jest.fn(),
    searchWarehousesResult: {
      data: { search: { edges: [], pageInfo: { hasNextPage: false } } },
      loading: false,
      error: undefined,
    } as any,
    searchWarehouses: jest.fn(),
  };

  it("should display reference attributes with correct labels from GraphQL data", async () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <SavebarRefProvider>
          <Wrapper>
            <ProductVariantPage {...defaultProps} />
          </Wrapper>
        </SavebarRefProvider>
      </MemoryRouter>,
    );

    // Assert - Verify initial reference is displayed with label (not ID)
    await waitFor(() => {
      expect(screen.getByText("Yellow Plimsolls")).toBeInTheDocument();
    });

    // Verify no ID fallback occurred for the existing reference
    expect(screen.queryByText("UHJvZHVjdDo4Nw==")).not.toBeInTheDocument();
  });

  it("should maintain reference labels when variant has multiple references", async () => {
    // Arrange - Create variant with 2 existing references
    const variantWith2References: ProductVariantFragment = {
      ...mockVariant,
      nonSelectionAttributes: [
        {
          ...mockVariant.nonSelectionAttributes[0],
          values: [
            {
              __typename: "AttributeValue" as const,
              id: "QXR0cmlidXRlVmFsdWU6MTUyOA==",
              name: "Yellow Plimsolls",
              slug: "1433_87",
              file: null,
              reference: "UHJvZHVjdDo4Nw==",
              boolean: null,
              date: null,
              dateTime: null,
              value: "",
              plainText: null,
              richText: null,
            },
            {
              __typename: "AttributeValue" as const,
              id: "QXR0cmlidXRlVmFsdWU6MTUyNw==",
              name: "White Plimsolls",
              slug: "1433_88",
              file: null,
              reference: "UHJvZHVjdDo4OA==",
              boolean: null,
              date: null,
              dateTime: null,
              value: "",
              plainText: null,
              richText: null,
            },
          ],
        },
      ],
    };

    // Act
    render(
      <MemoryRouter>
        <SavebarRefProvider>
          <Wrapper>
            <ProductVariantPage {...defaultProps} variant={variantWith2References} />
          </Wrapper>
        </SavebarRefProvider>
      </MemoryRouter>,
    );

    // Assert - Both references should be displayed with labels
    await waitFor(() => {
      expect(screen.getByText("Yellow Plimsolls")).toBeInTheDocument();
      expect(screen.getByText("White Plimsolls")).toBeInTheDocument();
    });

    // Verify no ID fallback occurred for either reference
    expect(screen.queryByText("UHJvZHVjdDo4Nw==")).not.toBeInTheDocument();
    expect(screen.queryByText("UHJvZHVjdDo4OA==")).not.toBeInTheDocument();
  });
});
