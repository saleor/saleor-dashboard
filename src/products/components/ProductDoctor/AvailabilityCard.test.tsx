import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { AvailabilityCard } from "./AvailabilityCard";
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
  it("renders the legacy mode label when shop uses shipping-zone stock availability", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ useLegacyShippingZoneStockAvailability: true });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert — mode is communicated to the user via visible copy.
    expect(screen.getByText(/uses shipping zones \(legacy\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/direct warehouse-channel/i)).toBeNull();
  });

  it("renders the direct mode label when shop uses the direct warehouse-channel link", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ useLegacyShippingZoneStockAvailability: false });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText(/direct warehouse-channel/i)).toBeInTheDocument();
    expect(screen.queryByText(/uses shipping zones \(legacy\)/i)).toBeNull();
  });

  it("does not render the indicator while diagnostics are loading", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ isLoading: true, channelSummaries: [] });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert — neither label is rendered (indicator shows only with the channels list).
    expect(screen.queryByText(/uses shipping zones \(legacy\)/i)).toBeNull();
    expect(screen.queryByText(/direct warehouse-channel/i)).toBeNull();
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

/**
 * Channel header severity gating — these tests assert what the user actually
 * sees: which icon is rendered (queried by accessible name), whether a count
 * number is visible, and whether the badge appears at all.
 *
 * The pure selection/escalation logic that drives the props is unit-tested
 * separately in `utils/issueBadge.test.ts`; here we only verify the
 * UI consequences.
 */
describe("AvailabilityCard channel header severity gating", () => {
  it("does not render the issue badge for info-only advisories", () => {
    // Arrange — direct mode, single info advisory.
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

    // Assert — no IssueBadge in the header.
    expect(screen.queryByTestId("channel-issue-badge")).toBeNull();

    // Expand the channel accordion and verify the info-style icon is rendered
    // for the issue callout (this is what the user perceives — Info icon
    // rather than warning/error iconography).
    fireEvent.click(screen.getByText("Default Channel"));

    expect(screen.getByTestId("product-doctor-issue-callout-icon-info")).toBeInTheDocument();
    expect(screen.getByLabelText("Information")).toBeInTheDocument();
  });

  it("surfaces a single warning via the channel issue badge with no visible count", () => {
    // Arrange — legacy mode, one warning-level issue.
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

    // Assert — the warning icon is shown inside the badge…
    const badge = screen.getByTestId("channel-issue-badge");

    expect(
      within(badge).getByTestId("product-doctor-issue-badge-icon-warning"),
    ).toBeInTheDocument();
    // …no error icon is shown…
    expect(within(badge).queryByTestId("product-doctor-issue-badge-icon-error")).toBeNull();
    // …and there is no visible count number (count text only renders for >1).
    expect(within(badge).queryByTestId("product-doctor-issue-badge-count")).toBeNull();
  });

  it("renders a visible count and the warning icon when multiple header-worthy issues exist alongside info advisories", () => {
    // Arrange — two warnings + two info advisories on the same channel.
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: false,
      issues: [
        makeIssue({ id: "no-stock", severity: "warning", message: "No stock" }),
        makeIssue({ id: "no-warehouses", severity: "warning", message: "No warehouses" }),
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

    // Assert — visible count reflects the two header-worthy issues only.
    const badge = screen.getByTestId("channel-issue-badge");

    expect(within(badge).getByTestId("product-doctor-issue-badge-count")).toHaveTextContent("2");
    expect(
      within(badge).getByTestId("product-doctor-issue-badge-icon-warning"),
    ).toBeInTheDocument();
  });

  it("renders the error icon when at least one header issue is an error", () => {
    // Arrange — error + warning + info.
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

    // Assert — error icon appears, warning icon does not.
    const badge = screen.getByTestId("channel-issue-badge");

    expect(within(badge).getByTestId("product-doctor-issue-badge-icon-error")).toBeInTheDocument();
    expect(within(badge).queryByTestId("product-doctor-issue-badge-icon-warning")).toBeNull();
    // Visible count covers the two header-worthy issues (the info advisory is excluded).
    expect(within(badge).getByTestId("product-doctor-issue-badge-count")).toHaveTextContent("2");
  });
});
