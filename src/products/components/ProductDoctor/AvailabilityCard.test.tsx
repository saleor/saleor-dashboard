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

/**
 * Test factory for `AvailabilityIssue`. `category` must be passed explicitly
 * — we deliberately avoid inferring it from `id` in the test layer because
 * that duplicates the production category mapping (which lives in
 * `runAvailabilityChecks`) and would silently miscategorize new issue types.
 */
const makeIssue = (
  overrides: Partial<AvailabilityIssue> & Pick<AvailabilityIssue, "category">,
): AvailabilityIssue => ({
  id: "test-issue",
  severity: "info",
  channelId: "channel-1",
  channelName: "Default Channel",
  message: "Issue message",
  description: "Issue description",
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
      issues: [makeIssue({ category: "shipping", severity: "info" })],
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
      issues: [
        makeIssue({
          category: "purchasability",
          id: "no-stock",
          severity: "warning",
          message: "No stock",
        }),
      ],
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
        makeIssue({
          category: "purchasability",
          id: "no-stock",
          severity: "warning",
          message: "No stock",
        }),
        makeIssue({
          category: "purchasability",
          id: "no-warehouses",
          severity: "warning",
          message: "No warehouses",
        }),
        makeIssue({
          category: "shipping",
          id: "no-shipping-zones",
          severity: "info",
          message: "No shipping zones",
        }),
        makeIssue({
          category: "purchasability",
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
        makeIssue({
          category: "purchasability",
          id: "no-variants",
          severity: "error",
          message: "No variants",
        }),
        makeIssue({
          category: "purchasability",
          id: "no-stock",
          severity: "warning",
          message: "No stock",
        }),
        makeIssue({
          category: "shipping",
          id: "no-shipping-zones",
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

  it("does not downgrade the badge in direct mode even when there are no shipping zones", () => {
    // Arrange — direct mode does not gate on shipping zones, so a missing
    // shipping zone is only an info advisory, not a blocker.
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

    // Assert — direct-mode reassurance is preserved.
    const reassurance = screen.getByTestId("verification-reassurance");

    expect(reassurance).toHaveAttribute("data-test-reassurance", "purchasable-direct");
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

describe("AvailabilityChannelItem issue category sections", () => {
  const renderExpandedChannel = (issues: AvailabilityIssue[]) => {
    const diagnostics = baseDiagnostics({
      issues,
      hasErrors: issues.some(i => i.severity === "error"),
      hasWarnings: issues.some(i => i.severity === "warning"),
    });

    render(<AvailabilityCard diagnostics={diagnostics} totalChannelsCount={1} />, {
      wrapper: Wrapper,
    });

    fireEvent.click(screen.getByText("Default Channel"));
  };

  it("renders both category sections when issues span both purchasability and shipping", () => {
    renderExpandedChannel([
      makeIssue({
        category: "purchasability",
        id: "no-stock",
        severity: "warning",
        message: "No stock",
      }),
      makeIssue({
        category: "shipping",
        id: "no-shipping-zones",
        severity: "info",
        message: "No shipping zones",
      }),
    ]);

    const sections = screen.getAllByTestId("issue-category-section");

    expect(sections).toHaveLength(2);
    expect(sections.map(s => s.getAttribute("data-test-category"))).toEqual([
      "purchasability",
      "shipping",
    ]);
  });

  it("renders only the purchasability section when no shipping issues exist", () => {
    renderExpandedChannel([
      makeIssue({
        category: "purchasability",
        id: "no-variants",
        severity: "error",
        message: "No variants",
      }),
      makeIssue({
        category: "purchasability",
        id: "no-stock",
        severity: "warning",
        message: "No stock",
      }),
    ]);

    const sections = screen.getAllByTestId("issue-category-section");

    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveAttribute("data-test-category", "purchasability");
  });

  it("renders only the shipping section when no purchasability issues exist", () => {
    renderExpandedChannel([
      makeIssue({
        category: "shipping",
        id: "no-shipping-zones",
        severity: "info",
        message: "No shipping zones",
      }),
    ]);

    const sections = screen.getAllByTestId("issue-category-section");

    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveAttribute("data-test-category", "shipping");
  });

  it("groups multiple issues of the same category under one section", () => {
    renderExpandedChannel([
      makeIssue({
        category: "purchasability",
        id: "no-stock",
        severity: "warning",
        message: "No stock",
      }),
      makeIssue({
        category: "purchasability",
        id: "stock-outside-channel-warehouses",
        severity: "info",
        message: "Stranded stock",
      }),
      makeIssue({
        category: "purchasability",
        id: "no-warehouses",
        severity: "warning",
        message: "No warehouses",
      }),
    ]);

    const sections = screen.getAllByTestId("issue-category-section");

    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveAttribute("data-test-category", "purchasability");
    // All three callouts should be inside the single purchasability section.
    expect(screen.getAllByTestId("availability-issue-callout")).toHaveLength(3);
  });
});
