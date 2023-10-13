// @ts-strict-ignore
import { channelsList } from "@dashboard/channels/fixtures";
import { createChannelsDataWithDiscountPrice } from "@dashboard/channels/utils";
import { listActionsProps, pageListProps } from "@dashboard/fixtures";
import { DiscountErrorCode } from "@dashboard/graphql";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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
  voucherCodes: [],
  addedVoucherCodes: [],
  onVoucherCodesSettingsChange: () => undefined,
  selectedVoucherCodesIds: [],
  voucherCodesLoading: false,
  voucherCodesPagination: {
    loadNextPage: () => undefined,
    loadPreviousPage: () => undefined,
    paginatorType: "click",
    pageInfo: {
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
    },
  },
  voucherCodesSettings: undefined,
  onMultipleVoucheCodesGenerate: () => undefined,
  onCustomVoucherCodeGenerate: () => undefined,
  onSelectVoucherCodesIds: () => undefined,
  onDeleteVoucherCodes: () => undefined,
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

export default {
  title: "Discounts / Voucher details",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <VoucherDetailsPage {...props} />;

export const Loading = () => (
  <VoucherDetailsPage {...props} disabled={true} voucher={undefined} />
);

export const Error = () => (
  <VoucherDetailsPage
    {...props}
    errors={(
      [
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
      ] as Array<keyof VoucherDetailsPageFormData>
    ).map(field => ({
      __typename: "DiscountError",
      channels: [],
      code: DiscountErrorCode.INVALID,
      field,
      message: "Discount invalid",
    }))}
  />
);
