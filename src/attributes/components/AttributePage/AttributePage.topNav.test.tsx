import { attribute } from "@dashboard/attributes/fixtures";
import { UserContext } from "@dashboard/auth/useUser";
import { type AttributeDetailsQuery, PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import AttributePage from "./AttributePage";

const staffUser: UserFragment = {
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
        user: staffUser,
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </UserContext.Provider>
  </MemoryRouter>
);

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/searches/useProductTypeSearch", () => ({
  __esModule: true,
  default: () => ({
    search: jest.fn(),
    loadMore: jest.fn(),
    result: { data: undefined, loading: false },
  }),
}));
jest.mock("@dashboard/searches/usePageTypeSearch", () => ({
  __esModule: true,
  default: () => ({
    search: jest.fn(),
    loadMore: jest.fn(),
    result: { data: undefined, loading: false },
  }),
}));
jest.mock("@dashboard/components/Metadata/Metadata", () => ({
  Metadata: () => <div data-test-id="metadata-mock" />,
}));
jest.mock("../AttributeOrganization", () => ({
  __esModule: true,
  default: () => <div data-test-id="attribute-organization-mock" />,
}));
jest.mock("../AttributeDetails", () => ({
  __esModule: true,
  default: () => <div data-test-id="attribute-details-mock" />,
}));
jest.mock("../AttributeProperties", () => ({
  __esModule: true,
  default: () => <div data-test-id="attribute-properties-mock" />,
}));
jest.mock("../AttributeValues/AttributeValues", () => ({
  AttributeValues: () => <div data-test-id="attribute-values-mock" />,
}));

const mockAttribute = attribute as NonNullable<AttributeDetailsQuery["attribute"]>;

const defaultProps = {
  disabled: false,
  errors: [],
  saveButtonBarState: "default" as const,
  onDelete: jest.fn(),
  onSubmit: jest.fn(),
  onValueAdd: jest.fn(),
  onValueDelete: jest.fn(),
  onValueReorder: jest.fn(),
  onValueUpdate: jest.fn(),
  pageInfo: { hasNextPage: false, hasPreviousPage: false },
  onNextPage: jest.fn(),
  onPreviousPage: jest.fn(),
  children: () => null,
};

const renderPage = ({
  attributeProp,
  onShowMetadata = jest.fn(),
}: {
  attributeProp: NonNullable<AttributeDetailsQuery["attribute"]> | null | undefined;
  onShowMetadata?: () => void;
}): ReturnType<typeof render> =>
  render(
    <AttributePage {...defaultProps} attribute={attributeProp} onShowMetadata={onShowMetadata} />,
    { wrapper: Wrapper },
  );

describe("AttributePage top nav", () => {
  it("renders the metadata button on edit view", () => {
    // Arrange & Act
    renderPage({ attributeProp: mockAttribute });

    // Assert
    expect(screen.getByTestId("show-attribute-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ attributeProp: mockAttribute, onShowMetadata });

    // Act
    screen.getByTestId("show-attribute-metadata").click();

    // Assert
    expect(onShowMetadata).toHaveBeenCalled();
  });

  it("disables the metadata button while attribute data is loading", () => {
    // Arrange & Act
    renderPage({ attributeProp: undefined });

    // Assert
    expect(screen.getByTestId("show-attribute-metadata")).toBeDisabled();
  });

  it("does not render the metadata button on create view", () => {
    // Arrange & Act
    renderPage({ attributeProp: null, onShowMetadata: jest.fn() });

    // Assert
    expect(screen.queryByTestId("show-attribute-metadata")).not.toBeInTheDocument();
    expect(screen.getByTestId("metadata-mock")).toBeInTheDocument();
  });
});
