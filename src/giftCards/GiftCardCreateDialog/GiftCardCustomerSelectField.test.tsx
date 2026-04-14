import { isValidEmailPattern } from "./GiftCardCustomerSelectField";

describe("isValidEmailPattern", () => {
  it.each([
    "test@example.com",
    "user.name@example.com",
    "user+tag@example.co.uk",
    "user-name@example.com",
    "user_name@example.com",
    "a@b.co",
    "123@example.com",
    "user!#$%&'*+/=?^_`{|}~-@example.com",
    "first.last@sub.domain.example.com",
    "USER@EXAMPLE.COM",
  ])("returns true for valid email %s", email => {
    // Act
    const result = isValidEmailPattern(email);

    // Assert
    expect(result).toBe(true);
  });

  it.each([
    "",
    "plainaddress",
    "@example.com",
    "user@",
    "user@@example.com",
    "user@.com",
    "user @example.com",
    "user@exam ple.com",
    "user@-example.com",
    "user@example-.com",
    "user@example..com",
  ])("returns false for invalid email %s", email => {
    // Act
    const result = isValidEmailPattern(email);

    // Assert
    expect(result).toBe(false);
  });
});
