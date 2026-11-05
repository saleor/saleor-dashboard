import { isVoucherCatalogueError } from "@dashboard/discounts/components/VoucherCatalogueSection/voucherCatalogueErrors";
import { isVoucherCodesError } from "@dashboard/discounts/components/VoucherCodesCard/voucherCodesErrors";
import { isVoucherCountriesError } from "@dashboard/discounts/components/VoucherCountriesErrors/voucherCountriesErrors";
import {
  type VoucherSectionId,
  voucherSectionIds,
} from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import { type MessageDescriptor } from "react-intl";

import { voucherFeedbackMessages } from "./voucherFeedbackMessages";
import { type VoucherSaveError } from "./voucherSaveRequestErrors";

interface VoucherSaveFailureFeedback {
  /** The section that holds the error, to scroll to. */
  section: VoucherSectionId | null;
  /** The toast's recovery line. */
  recovery: MessageDescriptor;
  /**
   * Whether the page shows the errors next to a field. If not, the toast is the only place the
   * failure is reported, so it stays until dismissed.
   */
  shownOnPage: boolean;
}

const FIELD_SECTIONS: ReadonlyArray<{ fields: readonly string[]; section: VoucherSectionId }> = [
  { fields: ["discountValue"], section: voucherSectionIds.discount },
  // The API reports a rejected minimum order value as `minAmountSpent`.
  {
    fields: ["minSpent", "minAmountSpent", "minCheckoutItemsQuantity"],
    section: voucherSectionIds.requirements,
  },
  { fields: ["usageLimit"], section: voucherSectionIds.limits },
];

/**
 * Where to fix a voucher save the API rejected, for Create voucher and a saved voucher alike.
 * Codes come first, since a taken code blocks the whole save.
 */
export const getVoucherSaveFailureFeedback = (
  errors: ReadonlyArray<Pick<VoucherSaveError, "field">>,
): VoucherSaveFailureFeedback => {
  if (errors.some(isVoucherCodesError)) {
    return {
      section: voucherSectionIds.codes,
      recovery: voucherFeedbackMessages.fixCodesAndTryAgain,
      shownOnPage: true,
    };
  }

  if (errors.some(isVoucherCatalogueError)) {
    return {
      section: voucherSectionIds.catalogue,
      recovery: voucherFeedbackMessages.fixCatalogueAndTryAgain,
      shownOnPage: true,
    };
  }

  if (errors.some(isVoucherCountriesError)) {
    return {
      section: voucherSectionIds.countries,
      recovery: voucherFeedbackMessages.fixCountriesAndTryAgain,
      shownOnPage: true,
    };
  }

  // No error belongs to a field when the request failed as a whole.
  if (errors.every(error => error.field === null)) {
    return { section: null, recovery: voucherFeedbackMessages.tryAgain, shownOnPage: false };
  }

  return {
    section:
      FIELD_SECTIONS.find(({ fields }) =>
        errors.some(error => error.field !== null && fields.includes(error.field)),
      )?.section ?? null,
    recovery: voucherFeedbackMessages.checkHighlightedFields,
    shownOnPage: true,
  };
};
