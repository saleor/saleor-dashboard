import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { CustomerListUrlSortField } from "@dashboard/customers/urls";
import { PermissionEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { CustomerListPage } from "./CustomerListPage";

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());
jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({
    CUSTOMER_OVERVIEW_CREATE: [],
    CUSTOMER_OVERVIEW_MORE_ACTIONS: [],
  }),
}));
jest.mock("@dashboard/extensions/getExtensionsItems", () => ({
  getExtensionItemsForOverviewCreate: () => [],
  getExtensionsItemsForCustomerOverviewActions: () => [],
}));
jest.mock("@dashboard/components/AppLayout/ListFilters/components/ExpressionFilters", () => ({
  ExpressionFilters: () => null,
  ExpressionFilterPanel: () => null,
}));
jest.mock("../CustomerListDatagrid/CustomerListDatagrid", () => ({
  CustomerListDatagrid: () => null,
}));
jest.mock("../CustomerTypeTabs/CustomerTypeTabs", () => ({
  CustomerTypeTabs: () => null,
}));

const mockUseUserPermissions = useUserPermissions as jest.Mock;

const permission = (code: PermissionEnum) => ({
  __typename: "UserPermission" as const,
  code,
  name: code,
});

const createProps = (
  overrides: Partial<ComponentProps<typeof CustomerListPage>> = {},
): ComponentProps<typeof CustomerListPage> => ({
  customers: [],
  selectedCustomerIds: [],
  loading: false,
  disabled: false,
  initialSearch: "",
  settings: { rowNumber: 20 },
  sort: { sort: CustomerListUrlSortField.name, asc: true },
  onSearchChange: jest.fn(),
  onSelectCustomerIds: jest.fn(),
  onCustomersDelete: jest.fn(),
  onCreateCustomerType: jest.fn(),
  onSort: jest.fn(),
  onUpdateListSettings: jest.fn(),
  customerTypes: [],
  selectedTypeIds: [],
  activeCustomerTypeName: undefined,
  tabCounts: {},
  onTabChange: jest.fn(),
  ...overrides,
});

const renderPage = (overrides: Partial<ComponentProps<typeof CustomerListPage>> = {}) =>
  render(
    <Wrapper>
      <MemoryRouter>
        <CustomerListPage {...createProps(overrides)} />
      </MemoryRouter>
    </Wrapper>,
  );

describe("CustomerListPage create CTA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a split button with Create customer type when the user can manage types", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCreateCustomerType = jest.fn();

    mockUseUserPermissions.mockReturnValue([
      permission(PermissionEnum.MANAGE_USERS),
      permission(PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES),
    ]);

    renderPage({ onCreateCustomerType });

    // Act
    await user.click(screen.getByTestId("create-customer-dropdown"));
    await user.click(screen.getByTestId("create-customer-type"));

    // Assert
    expect(screen.getByTestId("create-customer")).toBeInTheDocument();
    expect(onCreateCustomerType).toHaveBeenCalled();
  });

  it("shows a simple Create customer button when the user cannot manage types", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_USERS)]);

    // Act
    renderPage();

    // Assert
    expect(screen.getByTestId("create-customer")).toBeInTheDocument();
    expect(screen.queryByTestId("create-customer-dropdown")).not.toBeInTheDocument();
  });

  it("hides the create CTA when the user cannot edit customers", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([
      permission(PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES),
    ]);

    // Act
    renderPage();

    // Assert
    expect(screen.queryByTestId("create-customer")).not.toBeInTheDocument();
  });

  it("labels the create button with the selected customer type", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_USERS)]);

    // Act
    renderPage({
      selectedTypeIds: ["type-1"],
      activeCustomerTypeName: "B2B",
    });

    // Assert
    expect(screen.getByRole("button", { name: /create b2b/i })).toBeInTheDocument();
  });
});
