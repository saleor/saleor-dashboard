import { channelsList } from "@saleor/channels/fixtures";
import { createChannelsDataWithDiscountPrice } from "@saleor/channels/utils";
import { listActionsProps, pageListProps } from "@saleor/fixtures";
import { DiscountErrorCode } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { voucherDetails } from "../../fixtures";
import VoucherDetailsPage, {
  VoucherDetailsPageFormData,
  VoucherDetailsPageProps,
  VoucherDetailsPageTab,
} from "./VoucherDetailsPage";

const channels = createChannelsDataWithDiscountPrice(
  voucherDetails,
  channelsList,
);

const props: VoucherDetailsPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  activeTab: VoucherDetailsPageTab.products,
  tabItemsCount: {
    [VoucherDetailsPageTab.categories]:
      voucherDetails.categoriesCount.totalCount,
    [VoucherDetailsPageTab.collections]:
      voucherDetails.collectionsCount.totalCount,
    [VoucherDetailsPageTab.products]: voucherDetails.productsCount.totalCount,
  },
  allChannelsCount: channels.length,
  categoryListToolbar: null,
  channelListings: channels,
  collectionListToolbar: null,
  errors: [],
  onCategoryAssign: () => undefined,
  onCategoryUnassign: () => undefined,
  onChannelsChange: () => undefined,
  onCollectionAssign: () => undefined,
  onCollectionUnassign: () => undefined,
  onCountryAssign: () => undefined,
  onCountryUnassign: () => undefined,
  onProductAssign: () => undefined,
  onProductUnassign: () => undefined,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  onTabClick: () => undefined,
  openChannelsModal: () => undefined,
  productListToolbar: null,
  saveButtonBarState: "default",
  selectedChannelId: "123",
  voucher: voucherDetails,
};

storiesOf("Discounts / Voucher details", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <VoucherDetailsPage {...props} />)
  .add("loading", () => (
    <VoucherDetailsPage {...props} disabled={true} voucher={undefined} />
  ))
  .add("form errors", () => (
    <VoucherDetailsPage
      {...props}
      errors={([
        "applyOncePerOrder",
        "code",
        "discountType",
        "endDate",
        "minSpent",
        "name",
        "startDate",
        "type",
        "usageLimit",
        "discountValue",
      ] as Array<keyof VoucherDetailsPageFormData>).map(field => ({
        __typename: "DiscountError",
        channels: [],
        code: DiscountErrorCode.INVALID,
        field,
        message: "Discount invalid",
      }))}
    />
  ));
