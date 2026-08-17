import { getGiftCardStatusPresentation } from "./getGiftCardStatusPresentation";
import { giftCardStatusMessages } from "./messages";

describe("getGiftCardStatusPresentation", () => {
  it("returns expired over inactive when both apply", () => {
    // Arrange // Act
    const status = getGiftCardStatusPresentation({ isActive: false, isExpired: true });

    // Assert
    expect(status).toEqual({
      color: "info",
      label: giftCardStatusMessages.expired,
    });
  });

  it("returns inactive for deactivated cards", () => {
    // Arrange // Act
    const status = getGiftCardStatusPresentation({ isActive: false, isExpired: false });

    // Assert
    expect(status).toEqual({
      color: "neutral",
      label: giftCardStatusMessages.inactive,
    });
  });

  it("returns active for live cards", () => {
    // Arrange // Act
    const status = getGiftCardStatusPresentation({ isActive: true, isExpired: false });

    // Assert
    expect(status).toEqual({
      color: "success",
      label: giftCardStatusMessages.active,
    });
  });
});
