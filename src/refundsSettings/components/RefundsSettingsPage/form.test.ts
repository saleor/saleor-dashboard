import {
  getChangedReasonReferenceFields,
  getRefundsSettingsFormData,
  isRefundsSettingsFormPristine,
} from "./formData";

describe("RefundsSettings form helpers", () => {
  const initial = getRefundsSettingsFormData("refund-type", "return-type");

  it("builds form data from server ids", () => {
    // Arrange // Act // Assert
    expect(getRefundsSettingsFormData("", "")).toEqual({
      refundReasonReferenceType: "",
      returnReasonReferenceType: "",
    });
  });

  it("is pristine when values match initial", () => {
    // Arrange // Act // Assert
    expect(isRefundsSettingsFormPristine(initial, initial)).toBe(true);
  });

  it("is dirty when a reason type changes", () => {
    // Arrange
    const current = {
      ...initial,
      refundReasonReferenceType: "other-type",
    };

    // Act // Assert
    expect(isRefundsSettingsFormPristine(current, initial)).toBe(false);
    expect(getChangedReasonReferenceFields(current, initial)).toEqual([
      "refundReasonReferenceType",
    ]);
  });
});
