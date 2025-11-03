import { WarehouseErrorCode } from "@dashboard/graphql";
import { warehouse } from "@dashboard/warehouses/fixtures";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import WarehouseInfo from "./WarehouseInfo";

const mockOnChange = jest.fn();

const invalidNameError = [
  {
    __typename: "WarehouseError" as const,
    code: WarehouseErrorCode.INVALID,
    field: "name",
    message: "Name is required",
  },
];

const invalidEmailError = [
  {
    __typename: "WarehouseError" as const,
    code: WarehouseErrorCode.INVALID,
    field: "email",
    message: "Invalid email format",
  },
];

describe("WarehouseInfo", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders warehouse name and email fields", () => {
    render(
      <Wrapper>
        <WarehouseInfo data={warehouse} disabled={false} errors={[]} onChange={mockOnChange} />
      </Wrapper>,
    );

    const nameInput = screen.getByTestId("warehouse-name-input").querySelector("input");
    const emailInput = screen.getByTestId("company-email-input").querySelector("input");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toHaveValue(warehouse.name);
    expect(emailInput).toHaveValue(warehouse.email);
  });

  it("calls onChange when warehouse name is modified", () => {
    render(
      <Wrapper>
        <WarehouseInfo data={warehouse} disabled={false} errors={[]} onChange={mockOnChange} />
      </Wrapper>,
    );

    const nameInput = screen.getByTestId("warehouse-name-input").querySelector("input");

    expect(nameInput).toBeInstanceOf(HTMLInputElement);
    fireEvent.change(nameInput as HTMLInputElement, { target: { value: "Updated Warehouse" } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onChange when email is modified", () => {
    render(
      <Wrapper>
        <WarehouseInfo data={warehouse} disabled={false} errors={[]} onChange={mockOnChange} />
      </Wrapper>,
    );

    const emailInput = screen.getByTestId("company-email-input").querySelector("input");

    expect(emailInput).toBeInstanceOf(HTMLInputElement);
    fireEvent.change(emailInput as HTMLInputElement, {
      target: { value: "updated@warehouse.com" },
    });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("displays error message for name field when error exists", () => {
    render(
      <Wrapper>
        <WarehouseInfo
          data={warehouse}
          disabled={false}
          errors={invalidNameError}
          onChange={mockOnChange}
        />
      </Wrapper>,
    );

    expect(screen.getByText("Invalid value")).toBeInTheDocument();

    const nameInput = screen.getByTestId("warehouse-name-input").querySelector("input");

    expect(nameInput).toHaveAttribute("aria-invalid", "true");
  });

  it("displays error message for email field when error exists", () => {
    render(
      <Wrapper>
        <WarehouseInfo
          data={warehouse}
          disabled={false}
          errors={invalidEmailError}
          onChange={mockOnChange}
        />
      </Wrapper>,
    );

    expect(screen.getByText("Invalid value")).toBeInTheDocument();

    const emailInput = screen.getByTestId("company-email-input").querySelector("input");

    expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });
});
