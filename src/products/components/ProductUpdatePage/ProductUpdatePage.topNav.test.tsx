import { type ProductDetailsQuery } from "@dashboard/graphql";
import { product } from "@dashboard/products/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import ProductUpdatePage from "./ProductUpdatePage";

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: () => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({
    PRODUCT_DETAILS_MORE_ACTIONS: [],
    PRODUCT_DETAILS_WIDGETS: [],
  }),
}));
jest.mock("@dashboard/extensions/getExtensionsItems", () => ({
  getExtensionsItemsForProductDetails: () => [],
}));
jest.mock("./form", () => ({
  __esModule: true,
  default: ({ children }: { children: (props: unknown) => ReactNode }) =>
    children({
      change: jest.fn(),
      data: {
        attributes: [],
        name: "Test",
        seoTitle: "",
        seoDescription: "",
        slug: "",
        collections: [],
        channels: { removeChannels: [], updateChannels: [] },
      },
      handlers: {
        changeChannels: jest.fn(),
        changeVariants: jest.fn(),
        selectCategory: jest.fn(),
        selectCollection: jest.fn(),
        selectTaxClass: jest.fn(),
        selectAttribute: jest.fn(),
        selectAttributeMultiple: jest.fn(),
        selectAttributeFile: jest.fn(),
        selectAttributeReference: jest.fn(),
        selectAttributeReferenceAdditionalData: jest.fn(),
        reorderAttributeValue: jest.fn(),
        fetchReferences: jest.fn(),
        fetchMoreReferences: jest.fn(),
        updateChannelList: jest.fn(),
      },
      submit: jest.fn(),
      isSaveDisabled: false,
      formErrors: {},
      attributeRichTextGetters: {},
      richText: { getValue: jest.fn() },
    }),
}));
jest.mock("../ProductDetailsForm", () => ({
  ProductDetailsForm: () => <div data-test-id="product-details-form-mock" />,
}));
jest.mock("../ProductMedia", () => ({
  __esModule: true,
  default: () => <div data-test-id="product-media-mock" />,
}));
jest.mock("../ProductVariants/ProductVariants", () => ({
  ProductVariants: () => <div data-test-id="product-variants-mock" />,
}));
jest.mock("@dashboard/components/SeoForm", () => ({
  SeoForm: () => <div data-test-id="seo-form-mock" />,
}));
jest.mock("../ProductOrganization/ProductOrganization", () => ({
  ProductOrganization: () => <div data-test-id="product-organization-mock" />,
}));
jest.mock("../ProductDoctor/AvailabilityCard", () => ({
  AvailabilityCard: () => <div data-test-id="availability-card-mock" />,
}));
jest.mock("@dashboard/extensions/components/AppWidgets/AppWidgets", () => ({
  AppWidgets: () => <div data-test-id="app-widgets-mock" />,
}));

const placeholderImage = "image.jpg";
const mockProduct = product(placeholderImage) as unknown as NonNullable<
  ProductDetailsQuery["product"]
>;

const renderPage = (onShowMetadata = jest.fn()) =>
  render(
    <Wrapper>
      <MemoryRouter>
        <ProductUpdatePage
          productId={mockProduct.id}
          channels={[]}
          channelsErrors={[]}
          variantListErrors={[]}
          errors={[]}
          categories={[]}
          collections={[]}
          attributeValues={[]}
          disabled={false}
          fetchMoreCategories={{ hasMore: false, loading: false, onFetchMore: jest.fn() }}
          fetchMoreCollections={{ hasMore: false, loading: false, onFetchMore: jest.fn() }}
          limits={null as never}
          variants={[]}
          media={[]}
          product={mockProduct}
          saveButtonBarState="default"
          taxClasses={[]}
          fetchMoreTaxClasses={{ hasMore: false, loading: false, onFetchMore: jest.fn() }}
          isSimpleProduct={false}
          fetchCategories={jest.fn()}
          fetchCollections={jest.fn()}
          fetchAttributeValues={jest.fn()}
          refetch={jest.fn()}
          onSubmit={jest.fn()}
          onDelete={jest.fn()}
          onShowMetadata={onShowMetadata}
          onImageDelete={jest.fn()}
          onImageUpload={jest.fn()}
          onMediaUrlUpload={jest.fn()}
          onVariantShow={jest.fn()}
          onAssignReferencesClick={jest.fn()}
          onCloseDialog={jest.fn()}
          onAttributeSelectBlur={jest.fn()}
          onAttributeValuesSearch={jest.fn()}
        />
      </MemoryRouter>
    </Wrapper>,
  );

describe("ProductUpdatePage top nav", () => {
  it("renders the metadata button in the header", () => {
    // Arrange & Act
    renderPage();

    // Assert
    expect(screen.getByTestId("show-product-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage(onShowMetadata);

    // Act
    screen.getByTestId("show-product-metadata").click();

    // Assert
    expect(onShowMetadata).toHaveBeenCalled();
  });

  it("disables the metadata button when product is not loaded", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <MemoryRouter>
          <ProductUpdatePage
            productId="test-id"
            channels={[]}
            channelsErrors={[]}
            variantListErrors={[]}
            errors={[]}
            categories={[]}
            collections={[]}
            attributeValues={[]}
            disabled={false}
            fetchMoreCategories={{ hasMore: false, loading: false, onFetchMore: jest.fn() }}
            fetchMoreCollections={{ hasMore: false, loading: false, onFetchMore: jest.fn() }}
            limits={null as never}
            variants={[]}
            media={[]}
            product={undefined}
            saveButtonBarState="default"
            taxClasses={[]}
            fetchMoreTaxClasses={{ hasMore: false, loading: false, onFetchMore: jest.fn() }}
            isSimpleProduct={false}
            fetchCategories={jest.fn()}
            fetchCollections={jest.fn()}
            fetchAttributeValues={jest.fn()}
            refetch={jest.fn()}
            onSubmit={jest.fn()}
            onDelete={jest.fn()}
            onShowMetadata={jest.fn()}
            onImageDelete={jest.fn()}
            onImageUpload={jest.fn()}
            onMediaUrlUpload={jest.fn()}
            onVariantShow={jest.fn()}
            onAssignReferencesClick={jest.fn()}
            onCloseDialog={jest.fn()}
            onAttributeSelectBlur={jest.fn()}
            onAttributeValuesSearch={jest.fn()}
          />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("show-product-metadata")).toBeDisabled();
  });
});
