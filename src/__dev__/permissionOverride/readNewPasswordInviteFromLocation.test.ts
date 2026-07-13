import { readNewPasswordInviteFromLocation } from "./readNewPasswordInviteFromLocation";

describe("readNewPasswordInviteFromLocation", () => {
  it("parses email and token from a new-password URL", () => {
    // Arrange
    const pathname = "/dashboard/new-password/";
    const search =
      "?email=mirek%2Bdashboard%2Bdebugdev-73cadc85%40saleor.io&token=da0wbs-9cfb71899d6a5c2a4bffa0854e9fde76";

    // Act
    const result = readNewPasswordInviteFromLocation(pathname, search);

    // Assert
    expect(result).toEqual({
      email: "mirek+dashboard+debugdev-73cadc85@saleor.io",
      token: "da0wbs-9cfb71899d6a5c2a4bffa0854e9fde76",
    });
  });

  it("returns null for other routes", () => {
    // Arrange // Act
    const result = readNewPasswordInviteFromLocation("/orders/", "?email=a@b.com&token=x");

    // Assert
    expect(result).toBeNull();
  });

  it("returns null when token is missing", () => {
    // Arrange // Act
    const result = readNewPasswordInviteFromLocation("/new-password/", "?email=debug@saleor.io");

    // Assert
    expect(result).toBeNull();
  });
});
