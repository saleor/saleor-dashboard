import { channelsList } from "@saleor/channels/fixtures";
import { createSaleChannels } from "@saleor/channels/utils";
import { DiscountErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import SaleDetailsPage, {
  SaleDetailsPageProps,
  SaleDetailsPageTab
} from "../../../discounts/components/SaleDetailsPage";
import { sale } from "../../../discounts/fixtures";
import { listActionsProps } from "../../../fixtures";
import Decorator from "../../Decorator";

const channels = createSaleChannels(channelsList);

const props: SaleDetailsPageProps = {
  activeTab: SaleDetailsPageTab.categories,
  allChannelsCount: channels.length,
  categoryListToolbar: null,
  channelListings: channels,
  collectionListToolbar: null,
  disabled: false,
  errors: [],
  hasChannelChanged: false,
  onBack: () => undefined,
  onCategoryAssign: () => undefined,
  onCategoryClick: () => undefined,
  onCategoryUnassign: () => undefined,
  onChannelsChange: () => undefined,
  onCollectionAssign: () => undefined,
  onCollectionClick: () => undefined,
  onCollectionUnassign: () => undefined,
  onNextPage: () => undefined,
  onPreviousPage: () => undefined,
  onProductAssign: () => undefined,
  onProductClick: () => undefined,
  onProductUnassign: () => undefined,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  onTabClick: () => undefined,
  openChannelsModal: () => undefined,
  pageInfo: {
    hasNextPage: true,
    hasPreviousPage: false
  },
  productListToolbar: null,
  sale,
  saveButtonBarState: "default",
  selectedChannelId: "123",
  ...listActionsProps
};

storiesOf("Views / Discounts / Sale details", module)
  .addDecorator(Decorator)
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
        field
      }))}
    />
  ))
  .add("collections", () => (
    <SaleDetailsPage {...props} activeTab={SaleDetailsPageTab.collections} />
  ))
  .add("products", () => (
    <SaleDetailsPage {...props} activeTab={SaleDetailsPageTab.products} />
  ));
