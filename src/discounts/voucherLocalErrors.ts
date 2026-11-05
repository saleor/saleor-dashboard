import { type ChannelVoucherData } from "@dashboard/channels/utils";
import {
  END_SCHEDULE_DATE_FIELDS,
  type ScheduleDateField,
} from "@dashboard/discounts/components/DiscountDates/incompleteScheduleFields";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import {
  type VoucherSectionId,
  voucherSectionIds,
} from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import { DiscountErrorCode, type DiscountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { type IntlShape } from "react-intl";

import { DiscountTypeEnum, RequirementsPicker } from "./types";
import { voucherFeedbackMessages } from "./voucherFeedbackMessages";
import {
  type DiscountValueIssue,
  getDiscountValueIssue,
  getDiscountValueIssueMessage,
  getMinSpentIssue,
  getMinSpentIssueMessage,
  getWholeNumberIssue,
  getWholeNumberIssueMessage,
  type MinSpentIssue,
} from "./voucherValueValidation";

interface ChannelListingValidationResult {
  valid: boolean;
  /** Channels with an invalid discount amount / percentage. */
  invalidDiscountValueChannels: string[];
  /** What is wrong with each channel's discount amount / percentage, keyed by channel id. */
  discountValueIssues: Record<string, DiscountValueIssue>;
  /** Channels with an invalid order minimum spend. */
  invalidMinSpentChannels: string[];
  /** What is wrong with each channel's minimum order value, keyed by channel id. */
  minSpentIssues: Record<string, MinSpentIssue>;
  /** Union of both field lists (legacy callers / tests). */
  invalidChannels: string[];
}

const collectChannelIssues = <Issue>(
  channelListings: ChannelVoucherData[],
  getIssue: (channel: ChannelVoucherData) => Issue | null,
): Record<string, Issue> => {
  const issues: Record<string, Issue> = {};

  channelListings.forEach(channel => {
    const issue = getIssue(channel);

    if (issue) {
      issues[channel.id] = issue;
    }
  });

  return issues;
};

export const validateChannelListing = (
  channelListings: ChannelVoucherData[],
  discountType: DiscountTypeEnum,
  requirementsPicker: RequirementsPicker,
): ChannelListingValidationResult => {
  // With no channels assigned there is nothing to check yet, so unrelated saves (e.g. renaming)
  // are not blocked. Shipping has no discount amount per channel, but can have a minimum order.
  const hasChannels = channelListings.length > 0;
  const hasChannelAmounts = discountType !== DiscountTypeEnum.SHIPPING && hasChannels;
  const discountValueIssues = hasChannelAmounts
    ? collectChannelIssues(channelListings, channel =>
        getDiscountValueIssue(
          discountType === DiscountTypeEnum.VALUE_PERCENTAGE
            ? channel.percentageDiscountValue
            : channel.discountValue,
          discountType,
        ),
      )
    : {};
  const minSpentIssues =
    hasChannels && requirementsPicker === RequirementsPicker.ORDER
      ? collectChannelIssues(channelListings, channel => getMinSpentIssue(channel.minSpent))
      : {};
  const invalidDiscountValueChannels = Object.keys(discountValueIssues);
  const invalidMinSpentChannels = Object.keys(minSpentIssues);
  const invalidChannels = [
    ...new Set([...invalidDiscountValueChannels, ...invalidMinSpentChannels]),
  ];

  return {
    valid: invalidChannels.length === 0,
    invalidDiscountValueChannels,
    discountValueIssues,
    invalidMinSpentChannels,
    minSpentIssues,
    invalidChannels,
  };
};

const toLocalError = ({
  field,
  required,
  message,
  channels = null,
}: {
  field: string;
  required: boolean;
  message: string;
  channels?: string[] | null;
}): DiscountErrorFragment => ({
  __typename: "DiscountError",
  code: required ? DiscountErrorCode.REQUIRED : DiscountErrorCode.INVALID,
  field,
  channels,
  message,
  voucherCodes: null,
});

/** One error per kind of problem, so each channel input shows the message that applies to it. */
const toChannelErrors = <Issue extends string>(
  field: string,
  issues: Record<string, Issue>,
  getMessage: (issue: Issue) => string,
): DiscountErrorFragment[] => {
  const channelsByIssue = new Map<Issue, string[]>();

  Object.entries(issues).forEach(([channelId, issue]) => {
    channelsByIssue.set(issue, [...(channelsByIssue.get(issue) ?? []), channelId]);
  });

  return [...channelsByIssue].map(([issue, channels]) =>
    toLocalError({ field, required: issue === "required", message: getMessage(issue), channels }),
  );
};

const getLimitErrors = (
  data: Pick<
    VoucherDetailsPageFormData,
    "hasUsageLimit" | "usageLimit" | "requirementsPicker" | "minCheckoutItemsQuantity"
  >,
  intl: IntlShape,
): DiscountErrorFragment[] => {
  const errors: DiscountErrorFragment[] = [];
  const usageLimitIssue = data.hasUsageLimit ? getWholeNumberIssue(data.usageLimit) : null;
  const minQuantityIssue =
    data.requirementsPicker === RequirementsPicker.ITEM
      ? getWholeNumberIssue(data.minCheckoutItemsQuantity)
      : null;

  if (usageLimitIssue) {
    errors.push(
      toLocalError({
        field: "usageLimit",
        required: usageLimitIssue === "required",
        message: getWholeNumberIssueMessage(usageLimitIssue, "usageLimit", intl),
      }),
    );
  }

  if (minQuantityIssue) {
    errors.push(
      toLocalError({
        field: "minCheckoutItemsQuantity",
        required: minQuantityIssue === "required",
        message: getWholeNumberIssueMessage(minQuantityIssue, "minCheckoutItemsQuantity", intl),
      }),
    );
  }

  return errors;
};

/**
 * A partly entered date or time reports an empty value, which would save as no end date, the
 * current time or midnight. An empty end date with "Set end date" on would remove the end date.
 */
const getScheduleErrors = (
  data: Pick<
    VoucherDetailsPageFormData,
    ScheduleDateField | "hasEndDate" | "incompleteScheduleFields"
  >,
  intl: IntlShape,
): DiscountErrorFragment[] => {
  // A partly filled input always reports an empty value, so a field the form has since given a
  // value is complete. End fields don't count while the end date is off.
  const incompleteFields = (data.incompleteScheduleFields ?? []).filter(
    field => !data[field] && (data.hasEndDate || !END_SCHEDULE_DATE_FIELDS.includes(field)),
  );
  const errors = incompleteFields.map(field =>
    toLocalError({
      field,
      required: false,
      message: intl.formatMessage(
        field === "startDate" || field === "endDate"
          ? voucherFeedbackMessages.incompleteDate
          : voucherFeedbackMessages.incompleteTime,
      ),
    }),
  );

  if (data.hasEndDate && !data.endDate && !incompleteFields.includes("endDate")) {
    errors.push(
      toLocalError({
        field: "endDate",
        required: true,
        message: intl.formatMessage(commonMessages.requiredField),
      }),
    );
  }

  return errors;
};

/**
 * Values the API would reject after a partial save, or silently change (rounding, truncation,
 * partly entered dates), as field errors. Checked before any mutation runs, on both Create voucher
 * and a saved voucher.
 * With `includeRequired: false` empty fields are left out, for showing errors live while the
 * merchant types before their first save attempt.
 */
export const getVoucherLocalErrors = (
  data: VoucherDetailsPageFormData,
  intl: IntlShape,
  { includeRequired = true }: { includeRequired?: boolean } = {},
): DiscountErrorFragment[] => {
  const validation = validateChannelListing(
    data.channelListings,
    data.discountType,
    data.requirementsPicker,
  );
  const errors = [
    ...toChannelErrors("discountValue", validation.discountValueIssues, issue =>
      getDiscountValueIssueMessage(issue, intl),
    ),
    ...toChannelErrors("minSpent", validation.minSpentIssues, issue =>
      getMinSpentIssueMessage(issue, intl),
    ),
    ...getLimitErrors(data, intl),
    ...getScheduleErrors(data, intl),
  ];

  return includeRequired
    ? errors
    : errors.filter(error => error.code !== DiscountErrorCode.REQUIRED);
};

const SECTION_ORDER: ReadonlyArray<{ fields: readonly string[]; section: VoucherSectionId }> = [
  { fields: ["discountValue"], section: voucherSectionIds.discount },
  { fields: ["minSpent", "minCheckoutItemsQuantity"], section: voucherSectionIds.requirements },
  { fields: ["usageLimit"], section: voucherSectionIds.limits },
];

/** The highest section on the voucher page that holds one of these errors. */
export const getFirstVoucherSectionWithError = (
  errors: DiscountErrorFragment[],
): VoucherSectionId | null =>
  SECTION_ORDER.find(({ fields }) =>
    errors.some(error => error.field !== null && fields.includes(error.field)),
  )?.section ?? null;
