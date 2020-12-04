import placeholderImage from "@assets/images/placeholder255x255.png";
import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsData } from "@saleor/channels/utils";
import { collections } from "@saleor/collections/fixtures";
import { fetchMoreProps, listActionsProps } from "@saleor/fixtures";
import { product as productFixture } from "@saleor/products/fixtures";
import { taxTypes } from "@saleor/storybook/stories/taxes/fixtures";
import { warehouseList } from "@saleor/warehouses/fixtures";
import Wrapper from "@test/wrapper";
import { configure, mount } from "enzyme";
import React from "react";

import ProductUpdatePage, { ProductUpdatePageProps } from "./ProductUpdatePage";

const product = productFixture(placeholderImage);
const channels = createChannelsData(channelsList);
const channelChoices = product.channelListings.map(listing => ({
  label: listing.channel.name,
  value: listing.channel.id
}));

import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

const onSubmit = jest.fn();

const props: ProductUpdatePageProps = {
  ...listActionsProps,
  allChannelsCount: 5,
  categories: [product.category],
  channelChoices,
  channelsErrors: [],
  collections,
  currentChannels: channels,
  defaultWeightUnit: "kg",
  disabled: false,
  errors: [],
  fetchCategories: () => undefined,
  fetchCollections: () => undefined,
  fetchMoreCategories: fetchMoreProps,
  fetchMoreCollections: fetchMoreProps,
  hasChannelChanged: false,
  header: product.name,
  images: product.images,
  onBack: () => undefined,
  onChannelsChange: () => undefined,
  onDelete: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onSetDefaultVariant: () => undefined,
  onSubmit,
  onVariantAdd: () => undefined,
  onVariantReorder: () => undefined,
  onVariantShow: () => undefined,
  onVariantsAdd: () => undefined,
  onWarehouseConfigure: () => undefined,
  openChannelsModal: () => undefined,
  placeholderImage,
  product,
  saveButtonBarState: "default",
  selectedChannelId: "123",
  taxTypes,
  variants: product.variants,
  warehouses: warehouseList
};

const selectors = {
  dropdown: `[data-test="autocomplete-dropdown"]`,
  empty: `[data-test-type="empty"]`,
  input: `[data-test="attribute-value"] input`
};

describe("Product details page", () => {
  it("can select empty option on attribute", () => {
    const component = mount(
      <Wrapper>
        <ProductUpdatePage {...props} />
      </Wrapper>
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
        .prop("value")
    ).toEqual("");
    component
      .find("form")
      .first()
      .simulate("submit");
    expect(onSubmit.mock.calls[0][0].attributes[0].value.length).toEqual(0);
  });
});
