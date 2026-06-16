import { UserContext } from "@dashboard/auth/useUser";
import { AttributeTypeEnum, PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { AttributeDetailsTitle } from "./Title";

const attribute = {
  name: "Color",
  type: AttributeTypeEnum.PRODUCT_TYPE,
};

const mockUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
      name: "Manage product types and attributes",
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
      <ThemeProvider>{children}</ThemeProvider>
    </UserContext.Provider>
  </MemoryRouter>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("AttributeDetailsTitle", () => {
  it("renders skeletons on initial load", () => {
    // Arrange & Act
    renderTitle(<AttributeDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("attribute-details-title-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("attribute-details-class-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<AttributeDetailsTitle attribute={attribute} loading />);

    // Assert
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.queryByTestId("attribute-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders attribute title and linked attribute class when loaded", () => {
    // Arrange & Act
    renderTitle(<AttributeDetailsTitle attribute={attribute} />);

    // Assert
    expect(screen.getByText("Color")).toBeInTheDocument();

    const classLink = screen.getByText("Product Attribute").closest("a");

    expect(classLink).toBeInTheDocument();
    expect(classLink?.getAttribute("href")).toContain("/attributes");
    expect(classLink?.getAttribute("href")).toContain("attributeType");
    expect(classLink?.getAttribute("href")).toContain("PRODUCT_TYPE");
  });
});
