import { UserContext } from "@dashboard/auth/useUser";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { PageDetailsTitle } from "./Title";

const page = {
  id: "page-id",
  title: "Summer lookbook",
  pageType: {
    id: "type-id",
    name: "Blog",
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
      code: PermissionEnum.MANAGE_PAGES,
      name: "Manage pages",
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

describe("PageDetailsTitle", () => {
  it("renders skeletons on initial load", () => {
    // Arrange & Act
    renderTitle(<PageDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("page-details-title-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("page-details-model-type-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<PageDetailsTitle page={page} loading />);

    // Assert
    expect(screen.getByText("Summer lookbook")).toBeInTheDocument();
    expect(screen.queryByTestId("page-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders model title and linked model type when loaded", () => {
    // Arrange & Act
    renderTitle(<PageDetailsTitle page={page} />);

    // Assert
    expect(screen.getByText("Summer lookbook")).toBeInTheDocument();

    const typeLink = screen.getByText("Blog").closest("a");

    expect(typeLink).toBeInTheDocument();
    expect(typeLink?.getAttribute("href")).toContain("/models/");
    expect(typeLink?.getAttribute("href")).toContain("pageTypes");
    expect(typeLink?.getAttribute("href")).toContain("type-id");
  });
});
