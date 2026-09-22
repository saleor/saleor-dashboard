import {
  customerAddPath,
  customerAddUrl,
  customerListPath,
  customerListUrl,
  customerListUrlWithCustomerType,
} from "./urls";

describe("customerListUrlWithCustomerType", () => {
  it("should return customerListPath when customer type is undefined", () => {
    // Arrange & Act
    const result = customerListUrlWithCustomerType(undefined);

    // Assert
    expect(result).toBe(customerListPath);
  });

  it("should return customerListPath when customer type id is missing", () => {
    // Arrange & Act
    const result = customerListUrlWithCustomerType({ id: "" });

    // Assert
    expect(result).toBe(customerListPath);
  });

  it("should build URL with the customer type tab query param", () => {
    // Arrange
    const customerType = {
      id: "Q3VzdG9tZXJUeXBlOjE=",
    };

    // Act
    const result = customerListUrlWithCustomerType(customerType);

    // Assert
    expect(result).toBe(customerListUrl({ customerTypes: [customerType.id] }));
    expect(result).toContain("customerTypes");
    expect(result).toContain(encodeURIComponent(customerType.id));
  });
});

describe("customerAddUrl", () => {
  it("should return the create path when no type is selected", () => {
    // Arrange & Act
    const result = customerAddUrl();

    // Assert
    expect(result).toBe(customerAddPath);
  });

  it("should include the selected customer type id", () => {
    // Arrange
    const customerTypeId = "Q3VzdG9tZXJUeXBlOjE=";

    // Act
    const result = customerAddUrl({ "customer-type-id": customerTypeId });

    // Assert
    expect(result).toContain("customer-type-id");
    expect(result).toContain(encodeURIComponent(customerTypeId));
  });
});
