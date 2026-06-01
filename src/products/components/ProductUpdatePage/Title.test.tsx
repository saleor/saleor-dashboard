import { UserContext } from "@dashboard/auth/useUser";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { ProductDetailsTitle } from "./Title";

const product = {
  id: "product-id",
  name: "Summer T-Shirt",
  productType: {
    id: "type-id",
    name: "Apparel",
    slug: "apparel",
    hasVariants: true,
  },
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
      code: PermissionEnum.MANAGE_PRODUCTS,
      name: "Manage products",
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

describe("ProductDetailsTitle", () => {
  it("renders skeletons on initial load", () => {
    // Arrange & Act
    renderTitle(<ProductDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("product-details-title-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("product-details-product-type-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<ProductDetailsTitle product={product} loading />);

    // Assert
    expect(screen.getByText("Summer T-Shirt")).toBeInTheDocument();
    expect(screen.queryByTestId("product-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders product name and linked product type when loaded", () => {
    // Arrange & Act
    renderTitle(<ProductDetailsTitle product={product} />);

    // Assert
    expect(screen.getByText("Summer T-Shirt")).toBeInTheDocument();

    const typeLink = screen.getByText("Apparel").closest("a");

    expect(typeLink).toBeInTheDocument();
    expect(typeLink?.getAttribute("href")).toContain("/products?");
    expect(typeLink?.getAttribute("href")).toContain("productType");
    expect(typeLink?.getAttribute("href")).toContain("apparel");
  });

  it("renders product type without catalog link when slug is missing", () => {
    // Arrange & Act
    renderTitle(
      <ProductDetailsTitle
        product={{
          ...product,
          productType: {
            id: "type-id",
            name: "Apparel",
          },
        }}
      />,
    );

    // Assert
    expect(screen.getByText("Apparel")).toBeInTheDocument();
    expect(screen.getByText("Apparel").closest("a")).toBeNull();
  });
});
