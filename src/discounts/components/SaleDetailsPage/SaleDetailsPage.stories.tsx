// @ts-strict-ignore
import { channelsList } from "@dashboard/channels/fixtures";
import { createSaleChannels } from "@dashboard/channels/utils";
import { sale } from "@dashboard/discounts/fixtures";
import { listActionsProps } from "@dashboard/fixtures";
import { DiscountErrorCode } from "@dashboard/graphql";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import SaleDetailsPage, {
  SaleDetailsPageProps,
  SaleDetailsPageTab,
} from "./SaleDetailsPage";

const channels = createSaleChannels(channelsList);

const props: SaleDetailsPageProps = {
  activeTab: SaleDetailsPageTab.categories,
  tabItemsCount: {
    [SaleDetailsPageTab.categories]: sale.categoriesCount.totalCount,
    [SaleDetailsPageTab.collections]: sale.collectionsCount.totalCount,
    [SaleDetailsPageTab.products]: sale.productsCount.totalCount,
    [SaleDetailsPageTab.variants]: sale.variantsCount.totalCount,
  },
  allChannelsCount: channels.length,
  categoryListToolbar: null,
  channelListings: channels,
  collectionListToolbar: null,
  disabled: false,
  errors: [],
  onCategoryAssign: () => undefined,
  onCategoryUnassign: () => undefined,
  onChannelsChange: () => undefined,
  onCollectionAssign: () => undefined,
  onCollectionUnassign: () => undefined,
  onProductAssign: () => undefined,
  onProductUnassign: () => undefined,
  onVariantAssign: () => undefined,
  onVariantUnassign: () => undefined,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  onTabClick: () => undefined,
  openChannelsModal: () => undefined,
  productListToolbar: null,
  variantListToolbar: null,
  sale,
  saveButtonBarState: "default",
  selectedChannelId: "123",
  ...listActionsProps,
};

export default {
  title: " Discounts / Sale details",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <SaleDetailsPage {...props} />;

export const Loading = () => (
  <SaleDetailsPage {...props} sale={undefined} disabled={true} />
);

export const FormErrors = () => (
  <SaleDetailsPage
    {...props}
    errors={["name", "startDate", "endDate", "value"].map(field => ({
      __typename: "DiscountError",
      channels: [],
      code: DiscountErrorCode.INVALID,
      field,
      message: "Discount invalid",
    }))}
  />
);

export const Collections = () => (
  <SaleDetailsPage {...props} activeTab={SaleDetailsPageTab.collections} />
);

export const Products = () => (
  <SaleDetailsPage {...props} activeTab={SaleDetailsPageTab.products} />
);
