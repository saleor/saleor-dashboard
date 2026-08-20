import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { CustomerTypeCard } from "./CustomerTypeCard";

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/graphql", () => {
  const actual = jest.requireActual("@dashboard/graphql");

  return {
    ...actual,
    useCustomerTypeListQuery: () => ({
      data: {
        customerTypes: {
          edges: [
            {
              node: {
                id: "type-1",
                name: "Default",
              },
            },
            {
              node: {
                id: "type-2",
                name: "Wholesale",
              },
            },
          ],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
        },
      },
      fetchMore: jest.fn(),
      loading: false,
    }),
  };
});
jest.mock("@saleor/macaw-ui-next", () => {
  const actual = jest.requireActual("@saleor/macaw-ui-next");

  return {
    ...actual,
    DynamicCombobox: ({
      "data-test-id": testId,
      disabled,
      onChange,
      onFocus,
      options,
      value,
    }: {
      "data-test-id"?: string;
      disabled?: boolean;
      onChange: (option: { label: string; value: string }) => void;
      onFocus: () => void;
      options: Array<{ label: string; value: string }>;
      value: { label: string; value: string } | null;
    }) => (
      <div data-test-id={testId} data-disabled={String(!!disabled)}>
        <button type="button" data-test-id="customer-type-select-trigger" onClick={onFocus}>
          {value?.label ?? "empty"}
        </button>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            data-test-id={`customer-type-option-${option.value}`}
            onClick={() => onChange(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    ),
  };
});

const mockUseUserPermissions = useUserPermissions as jest.Mock;

const renderCard = ({
  disabled = false,
  onChange = jest.fn(),
  savedTypeId = "type-1",
  selectedType = { id: "type-1", name: "Default" },
}: {
  disabled?: boolean;
  onChange?: jest.Mock;
  savedTypeId?: string | null;
  selectedType?: { id: string; name: string } | null;
} = {}) =>
  render(
    <Wrapper>
      <MemoryRouter>
        <CustomerTypeCard
          savedTypeId={savedTypeId}
          selectedType={selectedType}
          disabled={disabled}
          onChange={onChange}
        />
      </MemoryRouter>
    </Wrapper>,
  );

describe("CustomerTypeCard", () => {
  beforeEach(() => {
    mockUseUserPermissions.mockReturnValue([
      {
        __typename: "UserPermission",
        code: PermissionEnum.MANAGE_USERS,
        name: PermissionEnum.MANAGE_USERS,
      },
    ]);
  });

  it("shows the selected customer type", () => {
    // Arrange / Act
    renderCard();

    // Assert
    expect(screen.getByTestId("customer-type")).toBeInTheDocument();
    expect(screen.getByTestId("customer-type-select")).toBeInTheDocument();
  });

  it("links to the type when the user can manage customer types", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([
      {
        __typename: "UserPermission",
        code: PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES,
        name: PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES,
      },
    ]);

    // Act
    renderCard();

    // Assert
    expect(screen.getByRole("link", { name: /view type/i })).toBeInTheDocument();
  });

  it("hides the type link without customer-type permissions", () => {
    // Arrange / Act
    renderCard();

    // Assert
    expect(screen.queryByRole("link", { name: /view type/i })).not.toBeInTheDocument();
  });

  it("asks for confirmation before applying a type change", async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderCard({ onChange });

    // Act
    await user.click(screen.getByTestId("customer-type-option-type-2"));

    // Assert
    expect(screen.getByTestId("change-customer-type-dialog")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onChange).toHaveBeenCalledWith({ id: "type-2", name: "Wholesale" });
  });

  it("does not change the type when the confirm dialog is canceled", async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderCard({ onChange });
    await user.click(screen.getByTestId("customer-type-option-type-2"));

    // Act
    await user.click(screen.getByTestId("back"));

    // Assert
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId("change-customer-type-dialog")).not.toBeInTheDocument();
  });

  it("applies a revert to the saved type without confirmation", async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderCard({
      onChange,
      savedTypeId: "type-1",
      selectedType: { id: "type-2", name: "Wholesale" },
    });

    // Act
    await user.click(screen.getByTestId("customer-type-option-type-1"));

    // Assert
    expect(screen.queryByTestId("change-customer-type-dialog")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({ id: "type-1", name: "Default" });
  });

  it("warns that the new type shows different attributes", () => {
    // Arrange / Act
    renderCard({
      savedTypeId: "type-1",
      selectedType: { id: "type-2", name: "Wholesale" },
    });

    // Assert
    expect(screen.getByTestId("customer-type-change-warning")).toHaveTextContent(
      "This type uses different attributes",
    );
    expect(screen.getByTestId("customer-type-change-warning")).toHaveTextContent(
      "Values from the previous type stay stored",
    );
  });

  it("hides the pending-change warning when the saved type is selected", () => {
    // Arrange / Act
    renderCard();

    // Assert
    expect(screen.queryByTestId("customer-type-change-warning")).not.toBeInTheDocument();
  });
});
