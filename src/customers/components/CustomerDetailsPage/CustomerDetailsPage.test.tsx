import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { getExtensionsItemsForCustomerDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type CustomerDetailsQuery, PermissionEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { customer } from "../../fixtures";
import CustomerDetailsPage from "./CustomerDetailsPage";

jest.mock("@dashboard/auth/hooks/useUserPermissions");
jest.mock("@dashboard/extensions/hooks/useExtensions");
// The extension menu helper expects fully-shaped App fixtures that aren't
// relevant to permission gating. Stub it and let individual tests override.
jest.mock("@dashboard/extensions/getExtensionsItems", () => ({
  getExtensionsItemsForCustomerDetails: jest.fn(() => []),
}));
// The real Savebar uses a Portal targeted at a ref the AppLayout provides.
// Fall back to the simple `__mocks__/Savebar.tsx` so we can detect the
// presence/absence of save/delete/cancel buttons in the rendered tree.
jest.mock("@dashboard/components/Savebar");
// The "Open in GraphiQL" action reads the Dev Mode context, which is only
// provided at the app root. Stub the hook so the page renders in isolation.
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: () => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));

// Mock heavy/irrelevant children so the test only renders the permission-
// dependent top-nav, form, and savebar surface area we care about.
jest.mock("../CustomerOverview/CustomerOverview", () => ({
  CustomerOverview: () => <div data-test-id="customer-overview-mock" />,
}));
jest.mock("../CustomerOrders/CustomerOrders", () => ({
  CustomerOrders: () => <div data-test-id="customer-orders-mock" />,
}));
jest.mock("../CustomerAddresses", () => ({
  __esModule: true,
  default: () => <div data-test-id="customer-addresses-mock" />,
}));
jest.mock("../ExternalReferenceCard/ExternalReferenceCard", () => ({
  ExternalReferenceCard: () => <div data-test-id="external-reference-mock" />,
}));
jest.mock("@dashboard/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard", () => ({
  CustomerGiftCardsCard: () => <div data-test-id="customer-gift-cards-mock" />,
}));
jest.mock("@dashboard/extensions/components/AppWidgets/AppWidgets", () => ({
  AppWidgets: () => <div data-test-id="app-widgets-mock" />,
}));
jest.mock("../CustomerAttributesCard/CustomerAttributesCard", () => ({
  CustomerAttributesCard: ({ disabled }: { disabled: boolean }) => (
    <div data-test-id="customer-attributes-mock" data-disabled={String(disabled)} />
  ),
}));
jest.mock("@dashboard/customers/hooks/useCustomerDetailsAttributes", () => ({
  useCustomerDetailsAttributes: () => ({
    attributeRichTextGetters: {},
    attributes: [],
    attributeValues: [],
    fetchAttributeValues: jest.fn(),
    fetchMoreAttributeValues: { hasMore: false, loading: false, onFetchMore: jest.fn() },
    getSubmitData: async () => ({ attributes: [], attributesWithNewFileValue: [] }),
    handleTypeChange: jest.fn(),
    isDirty: false,
    handlers: {
      fetchMoreReferences: { hasMore: false, loading: false, onFetchMore: jest.fn() },
      fetchReferences: jest.fn(),
      onAttributeSelectBlur: jest.fn(),
      onChange: jest.fn(),
      onFileChange: jest.fn(),
      onMultiChange: jest.fn(),
      onReferencesReorder: jest.fn(),
      selectAttributeReference: jest.fn(),
      selectAttributeReferenceAdditionalData: jest.fn(),
    },
    typeAttributesLoading: false,
  }),
}));

const mockUseUserPermissions = useUserPermissions as jest.Mock;
const mockUseExtensions = useExtensions as jest.Mock;
const mockGetExtensionsItemsForCustomerDetails = getExtensionsItemsForCustomerDetails as jest.Mock;

// Macaw Input puts data-test-id on the native input.
const getInputByTestId = (testId: string): HTMLInputElement =>
  screen.getByTestId(testId) as HTMLInputElement;

const renderPage = () =>
  render(
    <Wrapper>
      <MemoryRouter>
        <CustomerDetailsPage
          customerId="VXNlcjoy"
          customer={customer as CustomerDetailsQuery["user"]}
          disabled={false}
          errors={[]}
          saveButtonBar="default"
          onSubmit={jest.fn()}
          onDelete={jest.fn()}
          onActivateToggle={jest.fn()}
          onShowMetadata={jest.fn()}
        />
      </MemoryRouter>
    </Wrapper>,
  );

const permission = (code: PermissionEnum) => ({
  __typename: "UserPermission" as const,
  code,
  name: code,
});

describe("CustomerDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExtensions.mockReturnValue({
      CUSTOMER_DETAILS_MORE_ACTIONS: [],
      CUSTOMER_DETAILS_WIDGETS: [],
    });
    mockGetExtensionsItemsForCustomerDetails.mockReturnValue([]);
  });

  describe("with MANAGE_USERS (full edit access)", () => {
    beforeEach(() => {
      mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_USERS)]);
    });

    it("renders the metadata edit button", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(screen.getByTestId("show-customer-metadata")).toBeInTheDocument();
    });

    it("renders the cogs menu with account actions", () => {
      // Arrange / Act
      renderPage();

      // Assert - the cogs menu trigger only renders when builtInMenuItems is non-empty
      expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
    });

    it("renders the savebar (cancel/save buttons)", () => {
      // Arrange / Act
      renderPage();

      // Assert - delete lives in the cogs menu; savebar is cancel + save
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("does not render the read-only label", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(screen.queryByTestId("savebar-read-only")).not.toBeInTheDocument();
    });

    it("leaves customer form fields enabled", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(getInputByTestId("customer-first-name")).not.toBeDisabled();
      expect(getInputByTestId("customer-last-name")).not.toBeDisabled();
      expect(getInputByTestId("customer-email")).not.toBeDisabled();
    });

    it("puts contact and addresses in the sidebar, not a type card", () => {
      // Arrange / Act
      renderPage();

      // Assert
      const contact = screen.getByTestId("customer-details");
      const addresses = screen.getByTestId("customer-addresses-mock");

      expect(screen.getByTestId("customer-attributes-mock")).toHaveAttribute(
        "data-disabled",
        "false",
      );
      expect(
        contact.compareDocumentPosition(addresses) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(screen.queryByTestId("customer-type-card-mock")).not.toBeInTheDocument();
    });
  });

  // Read-only roles: MANAGE_ORDERS and MANAGE_STAFF can both reach the
  // customer detail page (matching `Query.user`'s permission set in Saleor)
  // but neither can mutate. Crucially the metadata button is hidden for both
  // — the customers list is server-filtered to non-staff users, and Saleor's
  // `meta/permissions.py::{public,private}_user_permissions` dispatch by
  // `user.is_staff`, returning `[MANAGE_USERS]` for non-staff users. So a
  // MANAGE_STAFF-only role is denied on metadata read+write here, and we
  // would surface a button that always 403s without this gate.
  describe.each([
    ["MANAGE_ORDERS", PermissionEnum.MANAGE_ORDERS],
    ["MANAGE_STAFF", PermissionEnum.MANAGE_STAFF],
  ])("with only %s (read-only access)", (_label, code) => {
    beforeEach(() => {
      mockUseUserPermissions.mockReturnValue([permission(code)]);
    });

    it("hides the metadata edit button", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(screen.queryByTestId("show-customer-metadata")).not.toBeInTheDocument();
    });

    it("still shows the cogs menu for the built-in Open in GraphiQL action", () => {
      // Arrange / Act
      renderPage();

      // Assert - the "Open in GraphiQL" action is always present, so the menu
      // renders even without account actions or extension items
      expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
    });

    it("hides the savebar action buttons (no delete/cancel/save)", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
    });

    it("shows the read-only label in the savebar slot", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(screen.getByTestId("savebar-read-only")).toBeInTheDocument();
    });

    it("disables customer form fields", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(getInputByTestId("customer-first-name")).toBeDisabled();
      expect(getInputByTestId("customer-last-name")).toBeDisabled();
      expect(getInputByTestId("customer-email")).toBeDisabled();
    });

    it("disables customer type changes on the attributes card", () => {
      // Arrange / Act
      renderPage();

      // Assert
      expect(screen.getByTestId("customer-attributes-mock")).toHaveAttribute(
        "data-disabled",
        "true",
      );
    });
  });

  describe("read-only with extension menu items", () => {
    beforeEach(() => {
      mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_ORDERS)]);
      mockGetExtensionsItemsForCustomerDetails.mockReturnValue([
        {
          label: "Extension action",
          testId: "extension-ext-1",
          onSelect: jest.fn(),
        },
      ]);
    });

    it("still surfaces the cogs menu so extension actions remain reachable", () => {
      // Arrange / Act
      renderPage();

      // Assert - built-in account actions are gone but extensions stay visible
      expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
    });
  });
});
