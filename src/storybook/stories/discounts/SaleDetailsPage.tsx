import { channelsList } from "@saleor/channels/fixtures";
import { createSaleChannels } from "@saleor/channels/utils";
import { DiscountErrorCode } from "@saleor/graphql";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import SaleDetailsPage, {
  SaleDetailsPageProps,
  SaleDetailsPageTab,
} from "../../../discounts/components/SaleDetailsPage";
import { sale } from "../../../discounts/fixtures";
import { listActionsProps } from "../../../fixtures";
import Decorator from "../../Decorator";

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

storiesOf("Views / Discounts / Sale details", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <SaleDetailsPage {...props} />)
  .add("loading", () => (
    <SaleDetailsPage {...props} sale={undefined} disabled={true} />
  ))
  .add("form errors", () => (
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
  ))
  .add("collections", () => (
    <SaleDetailsPage {...props} activeTab={SaleDetailsPageTab.collections} />
  ))
  .add("products", () => (
    <SaleDetailsPage {...props} activeTab={SaleDetailsPageTab.products} />
  ));
