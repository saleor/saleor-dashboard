import { getCustomerEditDataFromOption } from "./getCustomerEditDataFromOption";

describe("getCustomerEditDataFromOption", () => {
  it("maps selected user id to customer edit data", () => {
    // Arrange // Act
    const result = getCustomerEditDataFromOption(
      { label: "user2@example.com", value: "user-2" },
      { id: "user-1", email: "user@example.com" } as any,
      "user@example.com",
    );

    // Assert
    expect(result).toEqual({
      prevUser: "user-1",
      prevUserEmail: "user@example.com",
      user: "user-2",
    });
  });

  it("maps selected email to customer edit data", () => {
    // Arrange // Act
    const result = getCustomerEditDataFromOption(
      { label: "Use email: new@example.com", value: "new@example.com" },
      null,
      null,
    );

    // Assert
    expect(result).toEqual({
      prevUser: undefined,
      prevUserEmail: undefined,
      userEmail: "new@example.com",
    });
  });
});
