import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import { getVoucherSetupReadiness } from "./getVoucherSetupReadiness";

const baseForm = {
  discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
  type: VoucherTypeEnum.ENTIRE_ORDER,
  percentageDiscountValue: "",
  channelListings: [
    {
      id: "ch1",
      name: "Default",
      currency: "USD",
      discountValue: "",
      percentageDiscountValue: "10",
      minSpent: "0",
    },
  ],
  codes: [],
};

describe("getVoucherSetupReadiness", () => {
  it("marks core ready for a percentage entire-order voucher with codes and channels", () => {
    // Arrange & Act
    const readiness = getVoucherSetupReadiness({
      voucher: {
        codesCount: { __typename: "VoucherCodeCountableConnection", totalCount: 2 },
      } as never,
      formData: baseForm as never,
      voucherCodes: [],
      tabItemsCount: {},
    });

    // Assert
    expect(readiness).toMatchObject({
      hasCodes: true,
      hasChannels: true,
      hasDiscountValue: true,
      needsCatalogue: false,
      hasCatalogue: true,
      coreReady: true,
    });
  });

  it("requires catalogue items for specific-product vouchers", () => {
    // Arrange & Act
    const readiness = getVoucherSetupReadiness({
      voucher: {
        codesCount: { __typename: "VoucherCodeCountableConnection", totalCount: 1 },
      } as never,
      formData: {
        ...baseForm,
        type: VoucherTypeEnum.SPECIFIC_PRODUCT,
      } as never,
      voucherCodes: [],
      tabItemsCount: { products: 0 },
    });

    // Assert
    expect(readiness.needsCatalogue).toBe(true);
    expect(readiness.hasCatalogue).toBe(false);
    expect(readiness.coreReady).toBe(false);
  });

  it("treats free shipping as having a discount value without an amount", () => {
    // Arrange & Act
    const readiness = getVoucherSetupReadiness({
      voucher: {
        codesCount: { __typename: "VoucherCodeCountableConnection", totalCount: 1 },
        countries: [{ code: "US", country: "United States" }],
      } as never,
      formData: {
        ...baseForm,
        discountType: DiscountTypeEnum.SHIPPING,
        percentageDiscountValue: "",
        channelListings: [
          {
            id: "ch1",
            name: "Default",
            currency: "USD",
            discountValue: "",
            minSpent: "0",
          },
        ],
      } as never,
      voucherCodes: [],
      tabItemsCount: {},
    });

    // Assert
    expect(readiness.hasDiscountValue).toBe(true);
    expect(readiness.needsCountries).toBe(true);
    expect(readiness.hasCountries).toBe(true);
    expect(readiness.coreReady).toBe(true);
  });

  it("treats free shipping with empty countries as ready (worldwide)", () => {
    // Arrange & Act
    const readiness = getVoucherSetupReadiness({
      voucher: {
        codesCount: { __typename: "VoucherCodeCountableConnection", totalCount: 1 },
        countries: [],
      } as never,
      formData: {
        ...baseForm,
        discountType: DiscountTypeEnum.SHIPPING,
        channelListings: [
          {
            id: "ch1",
            name: "Default",
            currency: "USD",
            discountValue: "",
            minSpent: "0",
          },
        ],
      } as never,
      voucherCodes: [],
      tabItemsCount: {},
      countriesCount: 0,
    });

    // Assert
    expect(readiness.needsCountries).toBe(true);
    expect(readiness.hasCountries).toBe(false);
    expect(readiness.coreReady).toBe(true);
  });

  it("counts draft codes from the form when the saved voucher has none", () => {
    // Arrange & Act
    const readiness = getVoucherSetupReadiness({
      voucher: {
        codesCount: { __typename: "VoucherCodeCountableConnection", totalCount: 0 },
      } as never,
      formData: {
        ...baseForm,
        codes: [{ code: "SAVE10" }],
      } as never,
      voucherCodes: [],
      tabItemsCount: {},
    });

    // Assert
    expect(readiness.hasCodes).toBe(true);
    expect(readiness.codesCount).toBe(1);
  });

  it("requires a percentage value when discount type is percentage", () => {
    // Arrange & Act
    const readiness = getVoucherSetupReadiness({
      voucher: {
        codesCount: { __typename: "VoucherCodeCountableConnection", totalCount: 1 },
      } as never,
      formData: {
        ...baseForm,
        channelListings: baseForm.channelListings.map(channel => ({
          ...channel,
          percentageDiscountValue: "",
        })),
      } as never,
      voucherCodes: [],
      tabItemsCount: {},
    });

    // Assert
    expect(readiness.hasDiscountValue).toBe(false);
    expect(readiness.coreReady).toBe(false);
  });
});
