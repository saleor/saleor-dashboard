import { type MockedResponse } from "@apollo/client/testing";
import {
  DiscountValueTypeEnum,
  type VoucherCodeFragment,
  VoucherCodesDocument,
  type VoucherCodesQuery,
  type VoucherCodesQueryVariables,
  VoucherTypeEnum,
} from "@dashboard/graphql";

import { type VoucherSearchItem } from "./useVoucherPicker";

export const summerVoucher: VoucherSearchItem = {
  __typename: "Voucher",
  id: "Vm91Y2hlcjox",
  name: "Summer sale",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  singleUse: false,
  discountValueType: DiscountValueTypeEnum.PERCENTAGE,
  discountValue: 10,
  currency: "USD",
};

export const welcomeVoucher: VoucherSearchItem = {
  __typename: "Voucher",
  id: "Vm91Y2hlcjoy",
  name: "Welcome gift for newsletter subscribers who joined during the spring campaign",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  singleUse: true,
  discountValueType: DiscountValueTypeEnum.FIXED,
  discountValue: 5,
  currency: "USD",
};

export const shippingVoucher: VoucherSearchItem = {
  __typename: "Voucher",
  id: "Vm91Y2hlcjoz",
  name: "Free delivery",
  type: VoucherTypeEnum.SHIPPING,
  singleUse: false,
  discountValueType: DiscountValueTypeEnum.PERCENTAGE,
  discountValue: 100,
  currency: "USD",
};

export const voucherCode = (
  code: string,
  { used = 0, isActive = true }: { used?: number; isActive?: boolean } = {},
): VoucherCodeFragment => ({
  __typename: "VoucherCode",
  id: `code-${code}`,
  code,
  used,
  isActive,
});

export const voucherCodesMock = ({
  voucherId,
  codes,
  after = null,
  endCursor = null,
}: {
  voucherId: string;
  codes: VoucherCodeFragment[];
  after?: string | null;
  endCursor?: string | null;
}): MockedResponse<VoucherCodesQuery> => {
  const variables: VoucherCodesQueryVariables = { id: voucherId, first: 100, after };

  return {
    request: {
      query: VoucherCodesDocument,
      variables,
    },
    result: {
      data: {
        __typename: "Query",
        voucher: {
          __typename: "Voucher",
          codes: {
            __typename: "VoucherCodeCountableConnection",
            edges: codes.map(node => ({ __typename: "VoucherCodeCountableEdge", node })),
            pageInfo: {
              __typename: "PageInfo",
              endCursor,
              hasNextPage: !!endCursor,
              hasPreviousPage: false,
              startCursor: null,
            },
          },
        },
      },
    },
  };
};
