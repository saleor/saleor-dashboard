import { renderLineMatrixStatusIconSvg } from "./renderLineMatrixStatusIconSvg";

const colors = {
  base: "#E8F4FD",
  border: "#B8DAF7",
  text: "#0569B9",
};

describe("renderLineMatrixStatusIconSvg", () => {
  it("uses RefundedIcon paths and 16/19 scale for refund statuses", () => {
    // Arrange
    const refundedSvg = renderLineMatrixStatusIconSvg("refunded", colors, false, "#000");
    const refundDraftSvg = renderLineMatrixStatusIconSvg("refundDraft", colors, false, "#000");

    // Assert
    expect(refundedSvg).toContain('d="M15.0417 12.6666L12.6667 15.0416L15.0417 17.4166"');
    expect(refundedSvg).toContain("scale(0.8421052631578947)");
    expect(refundDraftSvg).toContain('d="M15.0417 12.6666L12.6667 15.0416L15.0417 17.4166"');
    expect(refundedSvg).not.toContain('d="M17.4166 10.2917H14.25"');
  });

  it("uses the same 1px border width when expanded", () => {
    // Arrange
    const collapsedSvg = renderLineMatrixStatusIconSvg("toFulfill", colors, false, "#111");
    const expandedSvg = renderLineMatrixStatusIconSvg("toFulfill", colors, true, "#111");

    // Assert
    expect(collapsedSvg).toContain('stroke-width="1"');
    expect(expandedSvg).toContain('stroke-width="1"');
    expect(expandedSvg).not.toContain('stroke-width="2"');
    expect(expandedSvg).toContain('stroke="#111"');
  });
});
