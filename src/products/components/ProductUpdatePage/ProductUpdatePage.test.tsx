import placeholderImage from "@assets/images/placeholder255x255.png";
import { channelsList } from "@dashboard/channels/fixtures";
import { collections } from "@dashboard/collections/fixtures";
import { fetchMoreProps, limits } from "@dashboard/fixtures";
import * as _useNavigator from "@dashboard/hooks/useNavigator";
import { product as productFixture } from "@dashboard/products/fixtures";
import { taxClasses } from "@dashboard/taxes/fixtures";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import ProductUpdatePage, { ProductUpdatePageProps } from "./ProductUpdatePage";

const product = productFixture(placeholderImage);

const onSubmit = jest.fn();
const useNavigator = jest.spyOn(_useNavigator, "default");
jest.mock("@dashboard/components/RichTextEditor/RichTextEditor");
jest.mock("@dashboard/utils/richText/useRichText");
/**
 * Mocking glide library. We do want to test only if page renders, grid itself has dedicated tests.
 */
jest.mock("@glideapps/glide-data-grid", () => {
  const { forwardRef } = jest.requireActual<typeof import("react")>("react");
  const dataGrid = jest.requireActual<
    typeof import("@glideapps/glide-data-grid")
  >("@glideapps/glide-data-grid");

  return {
    ...dataGrid,
    __esModule: true,
    default: forwardRef((_: any, ref: any) => <div ref={ref} />),
  };
});

const props: ProductUpdatePageProps = {
  channels: channelsList,
  variantListErrors: [],
  productId: "123",
  categories: [product.category],
  isSimpleProduct: false,
  channelsErrors: [],
  collections,
  disabled: false,
  errors: [],
  fetchCategories: () => undefined,
  fetchCollections: () => undefined,
  fetchAttributeValues: () => undefined,
  onAttributeSelectBlur: () => undefined,
  fetchMoreCategories: fetchMoreProps,
  fetchMoreCollections: fetchMoreProps,
  fetchMoreAttributeValues: fetchMoreProps,
  header: product.name,
  media: product.media,
  limits,
  refetch: () => undefined,
  onAttributeValuesSearch: () => Promise.resolve([]),
  onAssignReferencesClick: () => undefined,
  onCloseDialog: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onMediaUrlUpload: () => undefined,
  onSubmit,
  onVariantShow: () => undefined,
  product,
  referencePages: [],
  referenceProducts: [],
  saveButtonBarState: "default",
  taxClasses,
  fetchMoreTaxClasses: undefined,
  variants: product.variants,
  warehouses: warehouseList,
  attributeValues: [],
};

xdescribe("Product details page", () => {
  useNavigator.mockImplementation();

  // Disabled because of failure on intel macbooks.
  // TODO: Rewrite without using Wrapper
  xit("can select empty option on attribute", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Wrapper>
          <ProductUpdatePage {...props} />
        </Wrapper>
      </MemoryRouter>,
    );
    const user = userEvent.setup();
    const attributeInput = screen.getAllByRole("textbox")[1];
    // Assert
    expect(attributeInput).toHaveAttribute(
      "aria-labelledby",
      "downshift-0-label",
    );
    // Act
    await user.click(attributeInput);
    // Assert
    expect(screen.queryByTestId("autocomplete-dropdown")).toBeInTheDocument();
    // Arrange
    const emptyOption = screen.queryAllByTestId(
      "single-autocomplete-select-option",
    )[0];
    // Assert
    expect(emptyOption).toBeInTheDocument();
    // Act
    await user.click(emptyOption);
    // Assert
    expect(attributeInput).toHaveValue("");
    // Act
    await waitFor(() =>
      fireEvent.submit(screen.getByTestId("product-update-form")),
    );
    // Assert
    expect(onSubmit.mock.calls[0][0].attributes[0].value.length).toEqual(0);

    // Act
    const moreButton = screen.queryAllByTestId("show-more-button")[0];
    await user.click(moreButton);
    const graphiQLLink = screen.queryAllByTestId("graphiql-redirect")[0];
    // Assert
    expect(graphiQLLink).toBeInTheDocument();
  });
});
