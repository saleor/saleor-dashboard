import { UserContext } from "@dashboard/auth/useUser";
import { type PageDetailsFragment, PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { page } from "@dashboard/modeling/fixtures";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import PageDetailsPage from "./PageDetailsPage";

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
      code: PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
      name: "Manage page types",
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
jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({
    PAGE_DETAILS_MORE_ACTIONS: [],
  }),
}));
jest.mock("@dashboard/extensions/getExtensionsItems", () => ({
  getExtensionsItemForPageDetails: () => [],
}));
jest.mock("./form", () => ({
  __esModule: true,
  default: ({ children }: { children: (props: unknown) => ReactNode }) =>
    children({
      change: jest.fn(),
      data: {
        attributes: [],
        title: "Test model",
        seoTitle: "",
        seoDescription: "",
        slug: "",
        isPublished: true,
        publishedAt: "",
        pageType: null,
        metadata: [],
        privateMetadata: [],
      },
      validationErrors: [],
      handlers: {
        changeMetadata: jest.fn(),
        selectPageType: jest.fn(),
        selectAttribute: jest.fn(),
        selectAttributeMulti: jest.fn(),
        selectAttributeFile: jest.fn(),
        selectAttributeReference: jest.fn(),
        reorderAttributeValue: jest.fn(),
        fetchReferences: jest.fn(),
        fetchMoreReferences: jest.fn(),
      },
      submit: jest.fn(),
      attributeRichTextGetters: {},
    }),
}));
jest.mock("../PageInfo", () => ({
  __esModule: true,
  default: () => <div data-test-id="page-info-mock" />,
}));
jest.mock("@dashboard/components/SeoForm", () => ({
  SeoForm: () => <div data-test-id="seo-form-mock" />,
}));
jest.mock("@dashboard/components/Metadata", () => ({
  Metadata: () => <div data-test-id="metadata-mock" />,
}));
jest.mock("../PageOrganizeContent/PageOrganizeContent", () => ({
  PageOrganizeContent: () => <div data-test-id="page-organize-content-mock" />,
}));
jest.mock("@dashboard/components/VisibilityCard", () => ({
  __esModule: true,
  default: () => <div data-test-id="visibility-card-mock" />,
}));

const mockPage: PageDetailsFragment = page;

const defaultProps = {
  loading: false,
  errors: [],
  attributeValues: [],
  saveButtonBarState: "default" as const,
  onRemove: jest.fn(),
  onSubmit: jest.fn(),
  onAssignReferencesClick: jest.fn(),
  onCloseDialog: jest.fn(),
  onAttributeSelectBlur: jest.fn(),
  fetchAttributeValues: jest.fn(),
};

const renderPage = ({
  pageProp,
  onShowMetadata = jest.fn(),
}: {
  pageProp: PageDetailsFragment | null | undefined;
  onShowMetadata?: () => void;
}): ReturnType<typeof render> =>
  render(<PageDetailsPage {...defaultProps} page={pageProp} onShowMetadata={onShowMetadata} />, {
    wrapper: Wrapper,
  });

describe("PageDetailsPage top nav", () => {
  it("renders the metadata button on edit view", () => {
    // Arrange & Act
    renderPage({ pageProp: mockPage });

    // Assert
    expect(screen.getByTestId("show-page-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ pageProp: mockPage, onShowMetadata });

    // Act
    screen.getByTestId("show-page-metadata").click();

    // Assert
    expect(onShowMetadata).toHaveBeenCalled();
  });

  it("disables the metadata button while page data is loading", () => {
    // Arrange & Act
    renderPage({ pageProp: undefined as unknown as PageDetailsFragment });

    // Assert
    expect(screen.getByTestId("show-page-metadata")).toBeDisabled();
  });

  it("does not render the metadata button on create view", () => {
    // Arrange & Act
    renderPage({ pageProp: null, onShowMetadata: jest.fn() });

    // Assert
    expect(screen.queryByTestId("show-page-metadata")).not.toBeInTheDocument();
    expect(screen.getByTestId("metadata-mock")).toBeInTheDocument();
    expect(screen.getByTestId("page-organize-content-mock")).toBeInTheDocument();
  });

  it("renders model type in the header on edit view", () => {
    // Arrange & Act
    renderPage({ pageProp: mockPage });

    // Assert
    expect(screen.getByTestId("model-type-display")).toBeInTheDocument();
    expect(screen.queryByTestId("page-organize-content-mock")).not.toBeInTheDocument();
  });

  it("shows the actions menu when model type settings are available", () => {
    // Arrange & Act
    renderPage({ pageProp: mockPage });

    // Assert
    expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
  });
});
