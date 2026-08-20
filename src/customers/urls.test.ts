import { customerListPath, customerListUrlWithCustomerType } from "./urls";

describe("customerListUrlWithCustomerType", () => {
  it("should return customerListPath when customer type is undefined", () => {
    // Arrange & Act
    const result = customerListUrlWithCustomerType(undefined);

    // Assert
    expect(result).toBe(customerListPath);
  });

  it("should return customerListPath when customer type slug is missing", () => {
    // Arrange & Act
    const result = customerListUrlWithCustomerType({
      id: "Q3VzdG9tZXJUeXBlOjE=",
      name: "B2B",
      slug: "",
    });

    // Assert
    expect(result).toBe(customerListPath);
  });

  it("should build URL with conditional filter token for customer type slug", () => {
    // Arrange
    const customerType = {
      id: "Q3VzdG9tZXJUeXBlOjE=",
      name: "B2B",
      slug: "b2b",
    };

    // Act
    const result = customerListUrlWithCustomerType(customerType);

    // Assert
    expect(result).toContain("/customers?");
    expect(result).toContain("customerType");
    expect(result).toContain("b2b");
  });
});
