import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { AttributeValueRequiredCell } from "./AttributeValueRequiredCell";

describe("AttributeValueRequiredCell", () => {
  it("renders Required when the value is required", () => {
    // Arrange & Act
    render(<AttributeValueRequiredCell valueRequired />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("value-required")).toHaveTextContent("Required");
  });

  it("renders Optional when the value is not required", () => {
    // Arrange & Act
    render(<AttributeValueRequiredCell valueRequired={false} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("value-required")).toHaveTextContent("Optional");
  });
});
