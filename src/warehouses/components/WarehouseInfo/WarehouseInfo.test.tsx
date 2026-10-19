import { WarehouseErrorCode, type WarehouseErrorFragment } from "@dashboard/graphql";
import { warehouse } from "@dashboard/warehouses/fixtures";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { WarehouseInfo } from "./WarehouseInfo";

const mockOnChange = jest.fn();

const invalidNameError: WarehouseErrorFragment[] = [
  {
    __typename: "WarehouseError",
    code: WarehouseErrorCode.INVALID,
    field: "name",
    message: "Name is required",
  },
];

const invalidEmailError: WarehouseErrorFragment[] = [
  {
    __typename: "WarehouseError",
    code: WarehouseErrorCode.INVALID,
    field: "email",
    message: "Invalid email format",
  },
];

const renderInfo = (errors: WarehouseErrorFragment[]): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <WarehouseInfo data={warehouse} disabled={false} errors={errors} onChange={mockOnChange} />
    </Wrapper>,
  );

describe("WarehouseInfo", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders warehouse name and email fields", () => {
    // Arrange
    const errors: WarehouseErrorFragment[] = [];

    // Act
    renderInfo(errors);

    // Assert
    const nameInput = screen.getByTestId("warehouse-name-input");
    const emailInput = screen.getByTestId("company-email-input");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toHaveValue(warehouse.name);
    expect(emailInput).toHaveValue(warehouse.email);
  });

  it("calls onChange when warehouse name is modified", () => {
    // Arrange
    renderInfo([]);

    const nameInput = screen.getByTestId("warehouse-name-input");

    // Act
    fireEvent.change(nameInput, { target: { value: "Updated Warehouse" } });

    // Assert
    expect(nameInput).toBeInstanceOf(HTMLInputElement);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onChange when email is modified", () => {
    // Arrange
    renderInfo([]);

    const emailInput = screen.getByTestId("company-email-input");

    // Act
    fireEvent.change(emailInput, {
      target: { value: "updated@warehouse.com" },
    });

    // Assert
    expect(emailInput).toBeInstanceOf(HTMLInputElement);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("displays error message for name field when error exists", () => {
    // Arrange
    const errors = invalidNameError;

    // Act
    renderInfo(errors);

    // Assert
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-name-input")).toHaveAttribute("aria-invalid", "true");
  });

  it("displays error message for email field when error exists", () => {
    // Arrange
    const errors = invalidEmailError;

    // Act
    renderInfo(errors);

    // Assert
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    expect(screen.getByTestId("company-email-input")).toHaveAttribute("aria-invalid", "true");
  });
});
