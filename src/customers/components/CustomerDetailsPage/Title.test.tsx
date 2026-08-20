import { UserContext } from "@dashboard/auth/useUser";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { CustomerDetailsTitle } from "./Title";

const customer = {
  id: "customer-id",
  email: "tom.cooper@example.com",
  firstName: "Tom",
  lastName: "Cooper",
  isStaff: false,
  isActive: true,
  isConfirmed: true,
  dateJoined: "2017-05-07T09:37:30.124154+00:00",
  customerType: {
    id: "Q3VzdG9tZXJUeXBlOjE=",
    name: "B2B",
    slug: "b2b",
  },
};

const mockUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isActive: true,
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage users",
    },
  ],
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <UserContext.Provider
      value={{
        login: undefined,
        loginByExternalPlugin: undefined,
        logout: undefined,
        requestLoginByExternalPlugin: undefined,
        authenticating: false,
        isCredentialsLogin: false,
        authenticated: true,
        errors: [],
        refetchUser: undefined,
        user: mockUser,
      }}
    >
      <ThemeWrapper>{children}</ThemeWrapper>
    </UserContext.Provider>
  </MemoryRouter>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("CustomerDetailsTitle", () => {
  it("renders skeletons on initial load", () => {
    // Arrange & Act
    renderTitle(<CustomerDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("customer-details-title-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("customer-details-status-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("customer-details-customer-type-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<CustomerDetailsTitle customer={customer} loading />);

    // Assert
    expect(screen.getByText("Tom Cooper")).toBeInTheDocument();
    expect(screen.queryByTestId("customer-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders customer name and linked customer type when loaded", () => {
    // Arrange & Act
    renderTitle(<CustomerDetailsTitle customer={customer} />);

    // Assert
    expect(screen.getByText("Tom Cooper")).toBeInTheDocument();

    const typeLink = screen.getByText("B2B").closest("a");

    expect(typeLink).toBeInTheDocument();
    expect(typeLink?.getAttribute("href")).toContain("/customers?");
    expect(typeLink?.getAttribute("href")).toContain("customerType");
    expect(typeLink?.getAttribute("href")).toContain("b2b");
    expect(screen.getByTestId("account-status-active")).toBeInTheDocument();
    expect(screen.queryByTestId("account-status-email-unverified")).not.toBeInTheDocument();
  });

  it("renders Inactive and Unverified pills for a deactivated unconfirmed customer", () => {
    // Arrange & Act
    renderTitle(
      <CustomerDetailsTitle
        customer={{
          ...customer,
          isActive: false,
          isConfirmed: false,
        }}
      />,
    );

    // Assert
    expect(screen.getByTestId("account-status-inactive")).toBeInTheDocument();
    expect(screen.getByTestId("account-status-email-unverified")).toBeInTheDocument();
    expect(screen.queryByTestId("account-status-active")).not.toBeInTheDocument();
  });

  it("renders customer type without list link when slug is missing", () => {
    // Arrange & Act
    renderTitle(
      <CustomerDetailsTitle
        customer={{
          ...customer,
          customerType: {
            id: "Q3VzdG9tZXJUeXBlOjE=",
            name: "B2B",
          },
        }}
      />,
    );

    // Assert
    expect(screen.getByText("B2B")).toBeInTheDocument();
    expect(screen.getByText("B2B").closest("a")).toBeNull();
  });
});
