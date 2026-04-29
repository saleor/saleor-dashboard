import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { AvailabilityCard, PublicApiVerificationBadge } from "./AvailabilityCard";
import { type ChannelVerificationResult } from "./hooks/usePublicApiVerification";
import { type AvailabilityIssue, type DiagnosticsResult } from "./utils/types";

// usePublicApiVerification hits the live API; stub it for isolated UI tests.
jest.mock("./hooks/usePublicApiVerification", () => ({
  usePublicApiVerification: () => ({
    verifyChannel: jest.fn(),
    getChannelResult: () => undefined,
    isVerifying: false,
    results: new Map(),
    lastVerified: null,
  }),
}));

const baseDiagnostics = (overrides: Partial<DiagnosticsResult> = {}): DiagnosticsResult => ({
  issues: [],
  channelSummaries: [
    {
      id: "channel-1",
      name: "Default Channel",
      slug: "default-channel",
      currencyCode: "USD",
      isActive: true,
      isPublished: true,
      publishedAt: "2024-01-01T00:00:00Z",
      isAvailableForPurchase: true,
      availableForPurchaseAt: "2024-01-01T00:00:00Z",
      visibleInListings: true,
      warehouseCount: 1,
      warehouseNames: ["Main Warehouse"],
      shippingZoneCount: 1,
      shippingZoneNames: ["US"],
      countryCount: 1,
    },
  ],
  hasErrors: false,
  hasWarnings: false,
  isLoading: false,
  permissions: {
    canViewChannelWarehouses: true,
    canViewShippingZones: true,
    missingPermissions: [],
  },
  useLegacyShippingZoneStockAvailability: true,
  ...overrides,
});

describe("AvailabilityCard / StockAvailabilityModeIndicator", () => {
  it("renders the legacy mode indicator when shop uses shipping-zone stock availability", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ useLegacyShippingZoneStockAvailability: true });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert
    const indicator = screen.getByTestId("stock-availability-mode-indicator");

    expect(indicator).toHaveAttribute("data-test-mode", "legacy");
    expect(indicator).toHaveTextContent(/legacy/i);
  });

  it("renders the direct mode indicator when shop uses direct warehouse-channel link", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ useLegacyShippingZoneStockAvailability: false });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert
    const indicator = screen.getByTestId("stock-availability-mode-indicator");

    expect(indicator).toHaveAttribute("data-test-mode", "direct");
    expect(indicator).toHaveTextContent(/direct warehouse-channel/i);
  });

  it("does not render the indicator while diagnostics are loading", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ isLoading: true, channelSummaries: [] });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert - indicator only renders when channels list is shown
    expect(screen.queryByTestId("stock-availability-mode-indicator")).toBeNull();
  });
});

const makeIssue = (overrides: Partial<AvailabilityIssue> = {}): AvailabilityIssue => ({
  id: "no-shipping-zones",
  severity: "info",
  channelId: "channel-1",
  channelName: "Default Channel",
  message: "No shipping zones",
  description: "Customers can browse and add this product to cart, but...",
  ...overrides,
});

describe("AvailabilityCard channel header severity gating", () => {
  it("does not promote info-only issues into the channel issue badge", () => {
    // Arrange - direct mode, single info advisory (e.g. no shipping zones)
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: false,
      issues: [makeIssue({ severity: "info" })],
      hasErrors: false,
      hasWarnings: false,
    });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert - no IssueBadge in the header
    expect(screen.queryByTestId("channel-issue-badge")).toBeNull();

    // Expand the channel accordion to inspect the issue callout in the body
    fireEvent.click(screen.getByText("Default Channel"));

    const callout = screen.getByTestId("availability-issue-callout");

    expect(callout).toHaveAttribute("data-test-severity", "info");
  });

  it("still surfaces warnings via the channel issue badge", () => {
    // Arrange - legacy mode, warning-level issue
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: true,
      issues: [makeIssue({ id: "no-stock", severity: "warning", message: "No stock" })],
      hasErrors: false,
      hasWarnings: true,
    });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert
    const badge = screen.getByTestId("channel-issue-badge");

    expect(badge).toHaveAttribute("data-test-type", "warning");
    expect(badge).toHaveAttribute("data-test-count", "1");
  });

  it("counts only blocking issues in the channel issue badge when info issues co-exist", () => {
    // Arrange - one warning, two info advisories on the same channel
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: false,
      issues: [
        makeIssue({ id: "no-stock", severity: "warning", message: "No stock" }),
        makeIssue({ id: "no-shipping-zones", severity: "info", message: "No shipping zones" }),
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Stranded stock",
        }),
      ],
      hasErrors: false,
      hasWarnings: true,
    });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert - badge count reflects the single blocking issue only
    const badge = screen.getByTestId("channel-issue-badge");

    expect(badge).toHaveAttribute("data-test-count", "1");
    expect(badge).toHaveAttribute("data-test-type", "warning");
  });

  it("escalates to error styling when at least one issue is an error", () => {
    // Arrange - mix of error and warning, plus info
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: true,
      issues: [
        makeIssue({ id: "no-variants", severity: "error", message: "No variants" }),
        makeIssue({ id: "no-stock", severity: "warning", message: "No stock" }),
        makeIssue({ id: "no-shipping-zones", severity: "info", message: "Info only" }),
      ],
      hasErrors: true,
      hasWarnings: true,
    });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert - badge type prefers error severity, count is the blocking total
    const badge = screen.getByTestId("channel-issue-badge");

    expect(badge).toHaveAttribute("data-test-type", "error");
    expect(badge).toHaveAttribute("data-test-count", "2");
  });
});

const makeVerification = (
  overrides: Partial<ChannelVerificationResult["result"]> & {
    status?: ChannelVerificationResult["status"];
  } = {},
): ChannelVerificationResult => {
  const { status = "success", ...resultOverrides } = overrides;

  return {
    channelId: "channel-1",
    channelSlug: "default-channel",
    status,
    error: null,
    result:
      status === "success"
        ? {
            productFound: true,
            isAvailable: true,
            isAvailableForPurchase: true,
            availableForPurchaseAt: "2024-01-01T00:00:00Z",
            variantsWithStock: 2,
            totalVariants: 2,
            variants: [],
            ...resultOverrides,
          }
        : null,
  };
};

describe("PublicApiVerificationBadge reassurance", () => {
  it("shows the legacy-mode reassurance when product is purchasable in legacy mode", () => {
    // Arrange
    const result = makeVerification({ isAvailable: true, variantsWithStock: 2 });

    // Act
    render(
      <PublicApiVerificationBadge result={result} useLegacyShippingZoneStockAvailability={true} />,
      { wrapper: Wrapper },
    );

    // Assert
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-legacy");
    // Legacy reassurance must reference shipping zones explicitly so the user
    // understands what was verified.
    expect(reassurance).toHaveTextContent(/shipping zones/i);
    expect(reassurance).toHaveTextContent(/purchasable/i);
  });

  it("shows the direct-mode reassurance when product is purchasable in direct mode", () => {
    // Arrange
    const result = makeVerification({ isAvailable: true, variantsWithStock: 2 });

    // Act
    render(
      <PublicApiVerificationBadge result={result} useLegacyShippingZoneStockAvailability={false} />,
      { wrapper: Wrapper },
    );

    // Assert
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-direct");
    // Direct-mode reassurance must call out the direct warehouse-channel link
    // so the user knows shipping zones don't gate availability in this mode.
    expect(reassurance).toHaveTextContent(/warehouse-channel link/i);
    expect(reassurance).toHaveTextContent(/regardless of shipping zones/i);
  });

  it("points to the issue list when verification reports not purchasable", () => {
    // Arrange
    const result = makeVerification({ isAvailable: false, variantsWithStock: 0 });

    // Act
    render(<PublicApiVerificationBadge result={result} />, { wrapper: Wrapper });

    // Assert
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "not-purchasable");
    expect(reassurance).toHaveTextContent(/review the issues listed above/i);
  });

  it("points to publish/listing config when product is not visible to the API", () => {
    // Arrange
    const result = makeVerification({ productFound: false });

    // Act
    render(<PublicApiVerificationBadge result={result} />, { wrapper: Wrapper });

    // Assert
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "not-visible");
    expect(reassurance).toHaveTextContent(/published and listed/i);
  });

  it("does not render reassurance during loading or after errors", () => {
    // Arrange / Act / Assert - loading state
    const { rerender } = render(
      <PublicApiVerificationBadge result={makeVerification({ status: "loading" })} />,
      { wrapper: Wrapper },
    );

    expect(screen.queryByTestId("verification-reassurance")).toBeNull();

    // Error state
    rerender(<PublicApiVerificationBadge result={makeVerification({ status: "error" })} />);

    expect(screen.queryByTestId("verification-reassurance")).toBeNull();
  });
});
