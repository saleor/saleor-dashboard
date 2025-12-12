import { ProductErrorCode, ProductErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { ProductShipping } from "./ProductShipping";

const wrapper = ({ children }: { children: React.ReactNode }) => <Wrapper>{children}</Wrapper>;

describe("ProductShipping", () => {
  const defaultProps = {
    data: { weight: "" },
    disabled: false,
    errors: [] as ProductErrorFragment[],
    weightUnit: "kg",
    onChange: jest.fn(),
  };

  const getWeightInput = () => screen.getByRole("input", { name: /weight/i });

  it("should render weight input field", () => {
    // Arrange
    render(<ProductShipping {...defaultProps} />, { wrapper });

    // Assert
    expect(getWeightInput()).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
  });

  it("should display weight unit as end adornment", () => {
    // Arrange
    render(<ProductShipping {...defaultProps} weightUnit="lb" />, { wrapper });

    // Assert
    expect(screen.getByText("lb")).toBeInTheDocument();
  });

  it("should show error message when weight error exists", () => {
    // Arrange
    const errors: ProductErrorFragment[] = [
      {
        __typename: "ProductError",
        code: ProductErrorCode.INVALID,
        field: "weight",
        message: null,
      },
    ];

    render(<ProductShipping {...defaultProps} errors={errors} />, { wrapper });

    // Assert
    // getProductErrorMessage converts the error code to a localized message
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
  });

  it("should disable input when disabled prop is true", () => {
    // Arrange
    render(<ProductShipping {...defaultProps} disabled />, { wrapper });

    // Assert
    expect(getWeightInput()).toBeDisabled();
  });

  it("should call onChange when value changes", () => {
    // Arrange
    const onChange = jest.fn();

    render(<ProductShipping {...defaultProps} onChange={onChange} />, { wrapper });

    // Act
    fireEvent.change(getWeightInput(), { target: { value: "10.5" } });

    // Assert
    expect(onChange).toHaveBeenCalled();
  });

  it("should display current weight value", () => {
    // Arrange
    render(<ProductShipping {...defaultProps} data={{ weight: "5.25" }} />, { wrapper });

    // Assert
    expect(getWeightInput()).toHaveValue(5.25);
  });

  it("should handle empty weight unit", () => {
    // Arrange
    render(<ProductShipping {...defaultProps} weightUnit="" />, { wrapper });

    // Assert
    expect(getWeightInput()).toBeInTheDocument();
    expect(screen.queryByText("kg")).not.toBeInTheDocument();
  });
});
