import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, within } from "@testing-library/react";

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
  isShippingRequired: true,
  ...overrides,
});

describe("AvailabilityCard / DiagnosticSummaryBanner", () => {
  it("shows the plain 'all configured correctly' message when no issues exist", () => {
    // Arrange
    const diagnostics = baseDiagnostics({ issues: [], hasErrors: false, hasWarnings: false });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert — exact "all healthy" copy, no advisory suffix.
    const banner = screen.getByTestId("diagnostic-summary-banner");

    expect(banner).toHaveTextContent(/^All channels configured correctly$/);
  });

  it("appends an advisory count to the success banner when only info-level issues exist", () => {
    // Arrange — one genuinely info-level advisory (stranded stock: stock
    // exists but in a warehouse not assigned to the channel; doesn't break
    // checkout, just a configuration recommendation).
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: false,
      issues: [
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Stranded stock",
        }),
      ],
      hasErrors: false,
      hasWarnings: false,
    });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert — success banner is suffixed with the advisory count so users
    // notice unresolved info-level issues even though the channel header
    // doesn't promote them.
    const banner = screen.getByTestId("diagnostic-summary-banner");

    expect(banner).toHaveTextContent(/All channels configured correctly · 1 advisory/);
  });

  it("uses the plural advisory wording when more than one info issue exists", () => {
    // Arrange — two info advisories on the same channel. Both are genuine
    // info-level issues that don't break checkout but recommend cleanup.
    const diagnostics = baseDiagnostics({
      issues: [
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Stranded stock — warehouse A",
        }),
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Stranded stock — warehouse B",
        }),
      ],
      hasErrors: false,
      hasWarnings: false,
    });

    // Act
    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    // Assert — the plural-template message is selected. The repo-wide
    // react-intl mock returns defaultMessage verbatim without substituting
    // placeholders, so we assert on the raw "{count} advisories" template
    // — matching the convention already used for other interpolated
    // messages in this suite (e.g. publicApiVariantsInStock).
    const banner = screen.getByTestId("diagnostic-summary-banner");

    expect(banner).toHaveTextContent(/All channels configured correctly · \{count\} advisories/);
    // The singular-only copy must NOT be selected for count > 1.
    expect(banner).not.toHaveTextContent(/1 advisory$/);
  });

  it("does not append the advisory suffix when warnings are present (warnings own the banner)", () => {
    // Arrange — one warning + one info advisory. The warning takes over the
    // banner with the standard issuesSummary, so the advisory suffix path
    // must not run.
    const diagnostics = baseDiagnostics({
      useLegacyShippingZoneStockAvailability: true,
      issues: [
        makeIssue({ id: "no-stock", severity: "warning", message: "No stock" }),
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

    // Assert — the success banner is not rendered; advisory suffix copy
    // must not appear anywhere on the screen.
    expect(screen.queryByTestId("diagnostic-summary-banner")).toBeNull();
    expect(screen.queryByText(/advisory|advisories/i)).toBeNull();
  });
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

// Synthetic issue factory for UI tests. Defaults to a genuine info-level
// advisory (stranded stock — the only check that emits info severity) so
// callers using `makeIssue({ severity: "info" })` get an unambiguously
// realistic fixture. Tests that need warnings/errors override the id +
// severity explicitly.
const makeIssue = (overrides: Partial<AvailabilityIssue> = {}): AvailabilityIssue => ({
  id: "stock-outside-channel-warehouses",
  severity: "info",
  channelId: "channel-1",
  channelName: "Default Channel",
  message: "Stranded stock",
  description: "Stock is in warehouses not assigned to this channel.",
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
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Stranded stock A",
        }),
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Stranded stock B",
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
        makeIssue({
          id: "stock-outside-channel-warehouses",
          severity: "info",
          message: "Info only",
        }),
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

  it("overrides the purchasable verdict when in legacy mode and the channel has no shipping zones", () => {
    // Arrange — API reports stock + isAvailable, but the channel's
    // shippingZoneCount is 0. In legacy mode this means no customer is
    // reachable, so the green "Purchasable" badge would be misleading.
    const result = makeVerification({ isAvailable: true, variantsWithStock: 2 });

    // Act
    render(
      <PublicApiVerificationBadge
        result={result}
        useLegacyShippingZoneStockAvailability={true}
        shippingZoneCount={0}
      />,
      { wrapper: Wrapper },
    );

    // Assert — the badge is downgraded to a coverage-aware warning.
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "not-reachable-legacy");
    expect(reassurance).toHaveTextContent(/no shipping zones/i);
    expect(reassurance).toHaveTextContent(/checkout cannot complete/i);
    // The "Purchasable" headline must NOT be shown — that's the whole point
    // of the override.
    expect(screen.queryByText(/^Purchasable$/i)).toBeNull();
    expect(screen.getByText(/reports stock, but no coverage/i)).toBeInTheDocument();
  });

  it("keeps the standard purchasable badge when the channel has shipping zones in legacy mode", () => {
    // Arrange — same API result, but channel has at least one shipping zone.
    const result = makeVerification({ isAvailable: true, variantsWithStock: 2 });

    // Act
    render(
      <PublicApiVerificationBadge
        result={result}
        useLegacyShippingZoneStockAvailability={true}
        shippingZoneCount={1}
      />,
      { wrapper: Wrapper },
    );

    // Assert — standard "Purchasable" reassurance is shown.
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-legacy");
  });

  it("downgrades the badge in direct mode when the channel has no shipping zones", () => {
    // Arrange — direct mode decouples stock visibility from shipping zones,
    // so the API correctly reports stock — but with zero shipping zones no
    // customer can complete checkout. The badge must say so explicitly.
    const result = makeVerification({ isAvailable: true, variantsWithStock: 2 });

    // Act
    render(
      <PublicApiVerificationBadge
        result={result}
        useLegacyShippingZoneStockAvailability={false}
        shippingZoneCount={0}
      />,
      { wrapper: Wrapper },
    );

    // Assert — coverage-aware "browseable, can't ship" override is shown.
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "not-deliverable-direct");
    // Copy must reference the underlying cause (no shipping zones) and the
    // observable consequence (cannot complete checkout) so the user
    // understands the gap between "in stock" and "buyable".
    expect(reassurance).toHaveTextContent(/no shipping zones/i);
    expect(reassurance).toHaveTextContent(/cannot complete checkout/i);
    expect(screen.queryByText(/^Purchasable$/i)).toBeNull();
    expect(screen.getByText(/browseable, can't ship/i)).toBeInTheDocument();
  });

  it("keeps the standard purchasable badge when the channel has shipping zones in direct mode", () => {
    // Arrange — same API result, but channel has at least one shipping zone.
    const result = makeVerification({ isAvailable: true, variantsWithStock: 2 });

    // Act
    render(
      <PublicApiVerificationBadge
        result={result}
        useLegacyShippingZoneStockAvailability={false}
        shippingZoneCount={1}
      />,
      { wrapper: Wrapper },
    );

    // Assert — standard direct-mode reassurance is shown.
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-direct");
  });

  it("does not downgrade the badge for non-shippable products in legacy mode (digital goods don't need shipping zones)", () => {
    // Arrange — non-shippable product (e.g. a digital license key) in a
    // channel with zero shipping zones. The customer can complete checkout
    // because no shipping is needed, so the API's "Purchasable" verdict is
    // genuinely correct and must not be overridden.
    const result = makeVerification({ isAvailable: true, variantsWithStock: 1 });

    // Act
    render(
      <PublicApiVerificationBadge
        result={result}
        useLegacyShippingZoneStockAvailability={true}
        shippingZoneCount={0}
        isShippingRequired={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert — standard legacy purchasable reassurance is shown, NOT the
    // "no coverage" override.
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-legacy");
    expect(screen.queryByText(/reports stock, but no coverage/i)).toBeNull();
  });

  it("does not downgrade the badge for non-shippable products in direct mode either", () => {
    // Arrange — same as above but in direct mode.
    const result = makeVerification({ isAvailable: true, variantsWithStock: 1 });

    // Act
    render(
      <PublicApiVerificationBadge
        result={result}
        useLegacyShippingZoneStockAvailability={false}
        shippingZoneCount={0}
        isShippingRequired={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert — standard direct-mode purchasable reassurance is shown, NOT
    // the "browseable, can't ship" override (the product doesn't need to
    // ship at all).
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-direct");
    expect(screen.queryByText(/browseable, can't ship/i)).toBeNull();
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
