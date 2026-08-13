import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import AttributeDetails from "./AttributeDetails";

const formProps = {
  apiErrors: [],
  canChangeType: true,
  clearErrors: jest.fn(),
  data: {
    ...getAttributePageInitialForm(),
    name: "Package weight",
    slug: "package-weight",
  },
  disabled: false,
  errors: {},
  onChange: jest.fn(),
  onUnitChange: jest.fn(),
  setError: jest.fn(),
};

describe("AttributeDetails", () => {
  it("renders general information in the standard settings card", () => {
    // Arrange & Act
    render(<AttributeDetails {...formProps} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("attribute-general-information")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "General Information" })).toBeInTheDocument();
    expect(screen.getByTestId("attribute-default-label-input")).toBeInTheDocument();
    expect(
      screen.getByText("This is used internally. Make sure you don’t use spaces"),
    ).toBeInTheDocument();
  });

  it("skips the settings card when embedded in create", () => {
    // Arrange & Act
    render(<AttributeDetails {...formProps} variant="embedded" />, { wrapper: Wrapper });

    // Assert
    expect(screen.queryByTestId("attribute-general-information")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "General Information" })).not.toBeInTheDocument();
    expect(screen.getByTestId("attribute-default-label-input")).toBeInTheDocument();
  });

  it("locks input type with the fixed-at-creation field on edit", () => {
    // Arrange & Act
    render(<AttributeDetails {...formProps} canChangeType={false} />, { wrapper: Wrapper });

    // Assert
    const inputType = screen.getByTestId("attribute-type-select");

    expect(inputType).toBeDisabled();
    expect(inputType).toHaveValue("Dropdown");
    expect(
      screen.getByText("Fixed at creation. To use a different type, create a new attribute."),
    ).toBeInTheDocument();
  });
});
