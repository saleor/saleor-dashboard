import { voucherSectionIds } from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";

import { voucherFeedbackMessages } from "./voucherFeedbackMessages";
import { getVoucherSaveFailureFeedback } from "./voucherSaveFailureFeedback";
import { type VoucherSaveError } from "./voucherSaveRequestErrors";

const error = (field: string | null): VoucherSaveError => ({ field, code: "INVALID" });

describe("getVoucherSaveFailureFeedback", () => {
  it("points to the codes first", () => {
    // Arrange & Act
    const feedback = getVoucherSaveFailureFeedback([error("discountValue"), error("codes")]);

    // Assert
    expect(feedback).toEqual({
      section: voucherSectionIds.codes,
      recovery: voucherFeedbackMessages.fixCodesAndTryAgain,
      shownOnPage: true,
    });
  });

  it("scrolls to the section of a rejected channel value", () => {
    // Arrange & Act
    const discount = getVoucherSaveFailureFeedback([error("discountValue")]);
    const requirements = getVoucherSaveFailureFeedback([error("minAmountSpent")]);

    // Assert
    expect(discount).toEqual({
      section: voucherSectionIds.discount,
      recovery: voucherFeedbackMessages.checkHighlightedFields,
      shownOnPage: true,
    });
    expect(requirements.section).toBe(voucherSectionIds.requirements);
  });

  it("asks to try again when the request failed as a whole", () => {
    // Arrange & Act
    const feedback = getVoucherSaveFailureFeedback([error(null)]);

    // Assert
    expect(feedback).toEqual({
      section: null,
      recovery: voucherFeedbackMessages.tryAgain,
      shownOnPage: false,
    });
  });

  it("asks to check first when the save may have gone through anyway", () => {
    // Arrange
    const unanswered: VoucherSaveError = { ...error(null), outcomeUnknown: true };

    // Act
    const feedback = getVoucherSaveFailureFeedback([unanswered]);

    // Assert
    expect(feedback).toEqual({
      section: null,
      recovery: voucherFeedbackMessages.checkSavedBeforeRetrying,
      shownOnPage: false,
    });
  });
});
