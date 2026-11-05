import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { initialForm } from "@dashboard/discounts/components/VoucherCreatePage/const";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { voucherSectionIds } from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { createIntl } from "react-intl";

import {
  getFirstVoucherSectionWithError,
  getVoucherLocalErrors,
  validateChannelListing,
} from "./voucherLocalErrors";

describe("validateChannelListing", () => {
  it("should return valid as true when discount type is SHIPPING", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10", percentageDiscountValue: "", minSpent: "10" },
      { id: "2", discountValue: "20", percentageDiscountValue: "", minSpent: "10" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.SHIPPING;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toHaveLength(0);
  });

  it("checks the minimum order value of a shipping voucher", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "", minSpent: "-5" },
      { id: "2", discountValue: "", percentageDiscountValue: "", minSpent: "10" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.SHIPPING,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.invalidDiscountValueChannels).toEqual([]);
    expect(result.minSpentIssues).toEqual({ "1": "negative" });
  });

  it("returns valid as true when there are no invalid channels", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10", percentageDiscountValue: "", minSpent: "10" },
      { id: "2", discountValue: "20", percentageDiscountValue: "", minSpent: "10" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.VALUE_FIXED;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toHaveLength(0);
  });

  it("returns valid as false when there are invalid channels", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10", percentageDiscountValue: "", minSpent: "10" },
      { id: "2", discountValue: "", percentageDiscountValue: "", minSpent: "10" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.VALUE_FIXED;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidChannels).toEqual(["2"]);
  });

  it("validates percentage amounts per channel independently from fixed drafts", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "99", percentageDiscountValue: "", minSpent: "10" },
      { id: "2", discountValue: "", percentageDiscountValue: "15", minSpent: "10" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidDiscountValueChannels).toEqual(["1"]);
  });

  it("does not block percentage validation when no channels are assigned", () => {
    // Arrange / Act
    const result = validateChannelListing(
      [],
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
    );

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toEqual([]);
  });

  it("allows different valid percentages per channel", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "10", minSpent: "50" },
      { id: "2", discountValue: "", percentageDiscountValue: "25", minSpent: "50" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toEqual([]);
  });

  it("still flags missing min-spent on channels when percentage is valid", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "8", minSpent: "50" },
      { id: "2", discountValue: "", percentageDiscountValue: "8", minSpent: "" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidMinSpentChannels).toEqual(["2"]);
    expect(result.invalidDiscountValueChannels).toEqual([]);
    expect(result.invalidChannels).toEqual(["2"]);
  });

  it("splits fixed discount and min-spent failures onto separate fields", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "", minSpent: "10" },
      { id: "2", discountValue: "5", percentageDiscountValue: "", minSpent: "" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_FIXED,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidDiscountValueChannels).toEqual(["1"]);
    expect(result.invalidMinSpentChannels).toEqual(["2"]);
    expect(result.invalidChannels).toEqual(["1", "2"]);
  });
});

describe("getVoucherLocalErrors", () => {
  const intl = createIntl({ locale: "en" });
  const channel = (id: string, percentageDiscountValue: string): ChannelVoucherData => ({
    id,
    name: `Channel ${id}`,
    currency: "USD",
    discountValue: "",
    percentageDiscountValue,
    minSpent: "",
  });
  const validForm: VoucherDetailsPageFormData = {
    ...initialForm,
    discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
    channelListings: [channel("usd", "10")],
  };

  it("returns no errors for valid values", () => {
    // Arrange & Act
    const errors = getVoucherLocalErrors(validForm, intl);

    // Assert
    expect(errors).toEqual([]);
  });

  it("gives each kind of discount problem its own message and channels", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      channelListings: [
        channel("pln", "120"),
        channel("usd", "0.000001"),
        channel("eur", "150"),
        channel("gbp", "10"),
      ],
    };

    // Act
    const errors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({
        field: "discountValue",
        channels: ["pln", "eur"],
        message: "Enter 100 or less.",
      }),
      expect.objectContaining({
        field: "discountValue",
        channels: ["usd"],
        message: "Use up to 3 decimal places.",
      }),
    ]);
  });

  it("rejects a fractional usage limit and minimum quantity", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      hasUsageLimit: true,
      usageLimit: 7.5,
      requirementsPicker: RequirementsPicker.ITEM,
      minCheckoutItemsQuantity: "1.5",
    };

    // Act
    const errors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({ field: "usageLimit", message: "Enter a whole number." }),
      expect.objectContaining({
        field: "minCheckoutItemsQuantity",
        message: "Enter a whole number.",
      }),
    ]);
  });

  it("rejects a usage limit below 1 only while the limit is on", () => {
    // Arrange
    const limitOn: VoucherDetailsPageFormData = {
      ...validForm,
      hasUsageLimit: true,
      usageLimit: 0,
    };
    const limitOff: VoucherDetailsPageFormData = { ...limitOn, hasUsageLimit: false };

    // Act
    const onErrors = getVoucherLocalErrors(limitOn, intl);
    const offErrors = getVoucherLocalErrors(limitOff, intl);

    // Assert
    expect(onErrors).toEqual([
      expect.objectContaining({ field: "usageLimit", message: "Enter a limit of at least 1." }),
    ]);
    expect(offErrors).toEqual([]);
  });

  it("leaves out empty fields before the first save attempt", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      channelListings: [channel("pln", ""), channel("usd", "150")],
    };

    // Act
    const liveErrors = getVoucherLocalErrors(form, intl, { includeRequired: false });
    const submitErrors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(liveErrors).toEqual([
      expect.objectContaining({ channels: ["usd"], message: "Enter 100 or less." }),
    ]);
    expect(submitErrors).toEqual([
      expect.objectContaining({ channels: ["pln"], message: "This field is required" }),
      expect.objectContaining({ channels: ["usd"], message: "Enter 100 or less." }),
    ]);
  });

  it("rejects a negative minimum order value with a translated message", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      requirementsPicker: RequirementsPicker.ORDER,
      channelListings: [{ ...channel("usd", "10"), minSpent: "-5" }],
    };

    // Act
    const errors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({
        field: "minSpent",
        channels: ["usd"],
        message: "Enter 0 or more.",
      }),
    ]);
  });

  it("rejects a usage limit above the largest number the API accepts", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      hasUsageLimit: true,
      usageLimit: 3_000_000_000,
    };

    // Act
    const errors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({
        field: "usageLimit",
        message: expect.stringMatching(/^Enter 2\D?147\D?483\D?647 or less\.$/),
      }),
    ]);
  });
  it("rejects partly entered schedule dates and times", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      hasEndDate: true,
      endDate: "",
      incompleteScheduleFields: ["startTime", "endDate"],
    };

    // Act
    const liveErrors = getVoucherLocalErrors(form, intl, { includeRequired: false });

    // Assert
    expect(liveErrors).toEqual([
      expect.objectContaining({
        field: "startTime",
        code: "INVALID",
        message: "Enter a complete time.",
      }),
      expect.objectContaining({
        field: "endDate",
        code: "INVALID",
        message: "Enter a complete date.",
      }),
    ]);
  });

  it("ignores a partly entered flag on a field that has a value again", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      startDate: "2030-12-31",
      incompleteScheduleFields: ["startDate"],
    };

    // Act
    const errors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(errors).toEqual([]);
  });

  it("ignores partly entered end fields while the end date is off", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      hasEndDate: false,
      endDate: "",
      incompleteScheduleFields: ["endDate", "endTime"],
    };

    // Act
    const errors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(errors).toEqual([]);
  });

  it("requires an end date while the end date is on, after the first save attempt", () => {
    // Arrange
    const form: VoucherDetailsPageFormData = {
      ...validForm,
      hasEndDate: true,
      endDate: "",
      endTime: "10:00",
    };

    // Act
    const liveErrors = getVoucherLocalErrors(form, intl, { includeRequired: false });
    const submitErrors = getVoucherLocalErrors(form, intl);

    // Assert
    expect(liveErrors).toEqual([]);
    expect(submitErrors).toEqual([
      expect.objectContaining({
        field: "endDate",
        code: "REQUIRED",
        message: "This field is required",
      }),
    ]);
  });
});

describe("getFirstVoucherSectionWithError", () => {
  it("picks the highest section on the page", () => {
    // Arrange
    const intl = createIntl({ locale: "en" });
    const form: VoucherDetailsPageFormData = {
      ...initialForm,
      hasUsageLimit: true,
      usageLimit: 0,
      requirementsPicker: RequirementsPicker.ITEM,
      minCheckoutItemsQuantity: "1.5",
    };

    // Act
    const section = getFirstVoucherSectionWithError(getVoucherLocalErrors(form, intl));

    // Assert
    expect(section).toBe(voucherSectionIds.requirements);
  });

  it("returns null without errors", () => {
    // Arrange & Act
    const section = getFirstVoucherSectionWithError([]);

    // Assert
    expect(section).toBeNull();
  });
});
