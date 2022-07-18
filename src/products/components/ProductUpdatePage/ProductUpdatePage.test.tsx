import placeholderImage from "@assets/images/placeholder255x255.png";
import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import { collections } from "@saleor/collections/fixtures";
import { fetchMoreProps, limits, listActionsProps } from "@saleor/fixtures";
import { product as productFixture } from "@saleor/products/fixtures";
import { taxTypes } from "@saleor/storybook/stories/taxes/fixtures";
import { warehouseList } from "@saleor/warehouses/fixtures";
import Wrapper from "@test/wrapper";
import { configure, mount } from "enzyme";
import React from "react";

import ProductUpdatePage, { ProductUpdatePageProps } from "./ProductUpdatePage";

const product = productFixture(placeholderImage);
const channels = createChannelsData(channelsList);

import * as _useNavigator from "@saleor/hooks/useNavigator";
import Adapter from "enzyme-adapter-react-16";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

configure({ adapter: new Adapter() });

const onSubmit = jest.fn();
const useNavigator = jest.spyOn(_useNavigator, "default");
jest.mock("@saleor/components/RichTextEditor/RichTextEditor");
jest.mock("@saleor/utils/richText/useRichText");

(global as any).document.createRange = () => ({
  // eslint-disable-next-line
  setStart: () => {},
  // eslint-disable-next-line
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: "BODY",
    ownerDocument: document,
  },
});

const props: ProductUpdatePageProps = {
  ...listActionsProps,
  productId: "123",
  allChannelsCount: 5,
  categories: [product.category],
  channelsData: [],
  channelsWithVariantsData: {},
  isSimpleProduct: false,
  setChannelsData: () => undefined,
  channelsErrors: [],
  collections,
  currentChannels: channels,
  defaultWeightUnit: "kg",
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
  onAssignReferencesClick: () => undefined,
  onChannelsChange: () => undefined,
  onCloseDialog: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onMediaUrlUpload: () => undefined,
  onSetDefaultVariant: () => undefined,
  onSubmit,
  onVariantReorder: () => undefined,
  onVariantEndPreorderDialogOpen: () => undefined,
  onWarehouseConfigure: () => undefined,
  openChannelsModal: () => undefined,
  placeholderImage,
  product,
  referencePages: [],
  referenceProducts: [],
  saveButtonBarState: "default",
  selectedChannelId: "123",
  taxTypes,
  variants: product.variants,
  warehouses: warehouseList,
  attributeValues: [],
};

const selectors = {
  dropdown: `[data-test-id="autocomplete-dropdown"]`,
  empty: `[data-test-type="empty"]`,
  input: `[data-test-id="attribute-value"] input`,
};

describe("Product details page", () => {
  useNavigator.mockImplementation();
  it("can select empty option on attribute", async () => {
    const component = mount(
      <MemoryRouter>
        <Wrapper>
          <ProductUpdatePage {...props} />
        </Wrapper>
      </MemoryRouter>,
    );
    expect(component.find(selectors.dropdown).exists()).toBeFalsy();

    component
      .find(selectors.input)
      .first()
      .simulate("click");

    expect(component.find(selectors.dropdown).exists()).toBeTruthy();

    expect(component.find(selectors.empty).exists());

    component
      .find(selectors.empty)
      .first()
      .simulate("click");

    expect(
      component
        .find(selectors.input)
        .first()
        .prop("value"),
    ).toEqual("");

    await act(async () => {
      component
        .find("form")
        .first()
        .simulate("submit");
      // wait for async function to complete
      await new Promise(process.nextTick);
    });
    expect(onSubmit.mock.calls[0][0].attributes[0].value.length).toEqual(0);
  });
});
