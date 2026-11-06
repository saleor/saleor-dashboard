import { type DiscoutFormData } from "@dashboard/discounts/types";
import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { joinDateTime } from "@dashboard/misc";
import { defineMessages, type IntlShape } from "react-intl";
import * as z from "zod";

import {
  getUnfinishedScheduleFields,
  SCHEDULE_DATE_FIELDS,
} from "../DiscountDates/incompleteScheduleFields";

const validationMessages = defineMessages({
  nameRequired: {
    id: "7Hdiw2",
    defaultMessage: "Rule name is required",
  },
  startRequiredWithEnd: {
    id: "5XIqND",
    defaultMessage: "Start date is required when end date is provided",
    description: "promotion schedule error when an end date is set without a start date",
  },
  endNotAfterStart: {
    id: "BbCiTr",
    defaultMessage: "End date must be after the start date.",
    description: "promotion schedule error when the end is at or before the start",
  },
});

const datesSchema = z.object({
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  hasEndDate: z.boolean().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  incompleteFields: z.array(z.enum(SCHEDULE_DATE_FIELDS)).optional(),
});

type ScheduleDates = z.infer<typeof datesSchema>;

/** The saved start and end, unchanged. A save that doesn't touch them shouldn't be blocked. */
const isSavedSchedule = (
  dates: ScheduleDates,
  savedDates: DiscoutFormData["dates"] | undefined,
): boolean =>
  !!savedDates &&
  !!dates.hasEndDate === savedDates.hasEndDate &&
  dates.startDate === savedDates.startDate &&
  dates.startTime === savedDates.startTime &&
  dates.endDate === savedDates.endDate &&
  dates.endTime === savedDates.endTime;

/**
 * Blocks schedules the API would store differently from what the merchant sees: a partly typed
 * date or time (sent as no date or as midnight), a year still being typed, an empty end date
 * while "Set end date" is on (sent as no end date), and an end at or before the start.
 */
const validateSchedule =
  (intl: IntlShape, savedDates: DiscoutFormData["dates"] | undefined) =>
  (dates: ScheduleDates, ctx: z.RefinementCtx): void => {
    const unfinishedFields = getUnfinishedScheduleFields(dates, dates.incompleteFields);

    unfinishedFields.forEach(field => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: intl.formatMessage(
          field === "startDate" || field === "endDate"
            ? voucherFeedbackMessages.incompleteDate
            : voucherFeedbackMessages.incompleteTime,
        ),
      });
    });

    if (
      dates.hasEndDate &&
      dates.endDate &&
      !dates.startDate &&
      !unfinishedFields.includes("startDate")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: intl.formatMessage(validationMessages.startRequiredWithEnd),
      });
    }

    if (dates.hasEndDate && !dates.endDate && !unfinishedFields.includes("endDate")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: intl.formatMessage(commonMessages.requiredField),
      });
    }

    if (
      !dates.hasEndDate ||
      !dates.startDate ||
      !dates.endDate ||
      unfinishedFields.length > 0 ||
      isSavedSchedule(dates, savedDates)
    ) {
      return;
    }

    const start = Date.parse(joinDateTime(dates.startDate, dates.startTime) ?? "");
    const end = Date.parse(joinDateTime(dates.endDate, dates.endTime) ?? "");

    if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: intl.formatMessage(validationMessages.endNotAfterStart),
      });
    }
  };

/**
 * Pass `savedDates` on a saved promotion: a start and end the merchant didn't change are not
 * compared, so a promotion saved through the API with an end equal to its start can still be
 * renamed.
 */
export const getValidationSchema = (
  intl: IntlShape,
  { savedDates }: { savedDates?: DiscoutFormData["dates"] } = {},
) => {
  return z.object({
    type: z.enum([PromotionTypeEnum.CATALOGUE, PromotionTypeEnum.ORDER]),
    name: z.string().min(1, intl.formatMessage(validationMessages.nameRequired)),
    description: z.string().optional(),
    dates: datesSchema.superRefine(validateSchedule(intl, savedDates)),
    rules: z.array(z.any()).optional(),
  });
};
