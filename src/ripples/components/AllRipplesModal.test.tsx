import { type Ripple } from "@dashboard/ripples/types";
import { Text, ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { defineMessage } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { getRipplesSortedAndGroupedByMonths, RippleGlobalDescription } from "./AllRipplesModal";

const mockNavigate = jest.fn();
const mockOnChange = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: jest.fn(() => mockNavigate),
}));

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: jest.fn(() => ({
    trackEvent: jest.fn(),
  })),
}));

jest.mock("@dashboard/ripples/hooks/useRipplesStorage", () => ({
  useRippleStorage: jest.fn(() => ({
    hideAllRipples: jest.fn(),
    setManuallyHidden: jest.fn(),
  })),
}));

jest.mock("@dashboard/home/usePulsePromotionLink", () => ({
  usePulsePromotionLink: jest.fn(() => ({
    kind: "internal",
    to: "/extensions/app/install?manifestUrl=https%3A%2F%2Fpulse.saleor.app%2Fapi%2Fmanifest",
    intent: "install",
    loading: false,
  })),
}));

jest.mock("@dashboard/ripples/allRipples", () => ({
  allRipples: [
    {
      type: "newApp",
      ID: "saleor-pulse",
      dateAdded: new Date(2026, 6, 31),
      content: {
        oneLiner: "Saleor Pulse",
        global: "Analytics on your homepage.",
        contextual: "See real-time store analytics.",
      },
      TTL_seconds: 3600,
      actions: [
        {
          label: {
            defaultMessage: "Install Pulse",
            id: "testInstallPulse",
          },
          href: "/extensions/app/install?manifestUrl=https%3A%2F%2Fpulse.saleor.app%2Fapi%2Fmanifest",
        },
      ],
    },
  ],
}));

const { AllRipplesModal } = jest.requireActual(
  "./AllRipplesModal",
) as typeof import("./AllRipplesModal");

const Wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>
    <ThemeProvider>{children}</ThemeProvider>
  </MemoryRouter>
);

const createMockRipple = (id: string, dateAdded: Date, overrides?: Partial<Ripple>): Ripple => ({
  type: "feature",
  ID: id,
  dateAdded,
  content: {
    oneLiner: `One liner for ${id}`,
    global: `Global content for ${id}`,
    contextual: `Contextual content for ${id}`,
  },
  TTL_seconds: 30,
  ...overrides,
});

describe("getRipplesSortedAndGroupedByMonths", () => {
  it("should return empty object for empty array", () => {
    // Arrange
    const ripples: Ripple[] = [];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(result).toEqual({});
  });

  it("should group ripples by month and year", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 0, 15)), // January 2024
      createMockRipple("ripple2", new Date(2024, 1, 20)), // February 2024
      createMockRipple("ripple3", new Date(2024, 0, 10)), // January 2024
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024 January"]).toHaveLength(2);
    expect(result["2024 February"]).toHaveLength(1);
  });

  it("should sort ripples by date in descending order (newest first)", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 0, 10)), // January 10, 2024
      createMockRipple("ripple2", new Date(2024, 0, 20)), // January 20, 2024
      createMockRipple("ripple3", new Date(2024, 0, 15)), // January 15, 2024
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    const januaryRipples = result["2024 January"];

    expect(januaryRipples[0].ripple.ID).toBe("ripple2"); // January 20 (newest)
    expect(januaryRipples[1].ripple.ID).toBe("ripple3"); // January 15
    expect(januaryRipples[2].ripple.ID).toBe("ripple1"); // January 10 (oldest)
  });

  it("should create correct month keys and date displays", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 0, 15)), // January 2024
      createMockRipple("ripple2", new Date(2023, 11, 20)), // December 2023
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(result["2024 January"]).toBeDefined();
    expect(result["2023 December"]).toBeDefined();

    expect(result["2024 January"][0].dateDisplay).toBe("Jan 2024");
    expect(result["2023 December"][0].dateDisplay).toBe("Dec 2023");
  });

  it("should handle ripples from different years correctly", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 5, 15)), // June 2024
      createMockRipple("ripple2", new Date(2023, 5, 20)), // June 2023
      createMockRipple("ripple3", new Date(2025, 5, 10)), // June 2025
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(3);
    expect(result["2024 June"]).toHaveLength(1);
    expect(result["2023 June"]).toHaveLength(1);
    expect(result["2025 June"]).toHaveLength(1);
  });

  it("should preserve original ripple data in the result", () => {
    // Arrange
    const originalRipple = createMockRipple("test-ripple", new Date(2024, 0, 15));
    const ripples: Ripple[] = [originalRipple];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    const groupedRipple = result["2024 January"][0];

    expect(groupedRipple.ripple).toEqual(originalRipple);
    expect(groupedRipple.ripple.ID).toBe("test-ripple");
    expect(groupedRipple.ripple.content.oneLiner).toBe("One liner for test-ripple");
  });

  it("should handle single ripple correctly", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("single-ripple", new Date(2024, 3, 10)), // April 2024
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(1);
    expect(result["2024 April"]).toHaveLength(1);
    expect(result["2024 April"][0].ripple.ID).toBe("single-ripple");
    expect(result["2024 April"][0].dateDisplay).toBe("Apr 2024");
  });

  it("should handle ripples with same date correctly", () => {
    // Arrange
    const sameDate = new Date(2024, 2, 15); // March 15, 2024
    const ripples: Ripple[] = [
      createMockRipple("ripple1", sameDate),
      createMockRipple("ripple2", sameDate),
      createMockRipple("ripple3", sameDate),
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(1);
    expect(result["2024 March"]).toHaveLength(3);
    result["2024 March"].forEach(item => {
      expect(item.dateDisplay).toBe("Mar 2024");
    });
  });
});

describe("RippleGlobalDescription", () => {
  it("renders string content", () => {
    // Arrange
    render(<RippleGlobalDescription content="Plain description text" />);

    // Assert
    expect(screen.getByText("Plain description text")).toBeInTheDocument();
  });

  it("renders nested Text content", () => {
    // Arrange
    render(
      <RippleGlobalDescription content={<Text>Rich description with nested formatting</Text>} />,
    );

    // Assert
    expect(screen.getByText("Rich description with nested formatting")).toBeInTheDocument();
  });
});

describe("Ripple actions", () => {
  const mockLabel = defineMessage({
    defaultMessage: "Test Action",
    id: "MH1qA1",
  });

  it("should support actions with href for external links", () => {
    // Arrange
    const ripple = createMockRipple("ripple-with-href", new Date(2024, 0, 15), {
      actions: [
        {
          label: mockLabel,
          href: "https://example.com/docs",
        },
      ],
    });

    // Assert
    expect(ripple.actions).toHaveLength(1);
    expect(ripple.actions![0].href).toBe("https://example.com/docs");
    expect(ripple.actions![0].onClick).toBeUndefined();
  });

  it("should support actions with onClick for in-app actions", () => {
    // Arrange
    const mockOnClick = jest.fn();
    const ripple = createMockRipple("ripple-with-onclick", new Date(2024, 0, 15), {
      actions: [
        {
          label: mockLabel,
          onClick: mockOnClick,
        },
      ],
    });

    // Assert
    expect(ripple.actions).toHaveLength(1);
    expect(ripple.actions![0].onClick).toBe(mockOnClick);
    expect(ripple.actions![0].href).toBeUndefined();
  });

  it("should support hideInModal flag to filter actions in global modal", () => {
    // Arrange
    const ripple = createMockRipple("ripple-with-hidden-action", new Date(2024, 0, 15), {
      actions: [
        {
          label: mockLabel,
          onClick: jest.fn(),
          hideInModal: true,
        },
        {
          label: defineMessage({
            defaultMessage: "Visible Action",
            id: "NJ9ngY",
          }),
          href: "https://example.com",
        },
      ],
    });

    // Act
    const visibleActions = ripple.actions!.filter(action => !action.hideInModal);

    // Assert
    expect(ripple.actions).toHaveLength(2);
    expect(visibleActions).toHaveLength(1);
    expect(visibleActions[0].href).toBe("https://example.com");
  });

  it("should enforce that action has either href or onClick (mutually exclusive)", () => {
    // Arrange
    const rippleWithHref = createMockRipple("with-href", new Date(2024, 0, 15), {
      actions: [{ label: mockLabel, href: "https://example.com" }],
    });
    const rippleWithOnClick = createMockRipple("with-onclick", new Date(2024, 0, 15), {
      actions: [{ label: mockLabel, onClick: jest.fn() }],
    });

    // Assert - each action type has its required property
    expect(rippleWithHref.actions![0]).toHaveProperty("href");
    expect(rippleWithOnClick.actions![0]).toHaveProperty("onClick");

    // Note: TypeScript enforces that actions cannot have both href and onClick,
    // and cannot have neither. This is enforced at compile time via the RippleAction union type.
  });
});

describe("AllRipplesModal", () => {
  const { usePulsePromotionLink } = jest.requireMock("@dashboard/home/usePulsePromotionLink") as {
    usePulsePromotionLink: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usePulsePromotionLink.mockReturnValue({
      kind: "internal",
      to: "/extensions/app/install?manifestUrl=https%3A%2F%2Fpulse.saleor.app%2Fapi%2Fmanifest",
      intent: "install",
      loading: false,
    });
  });

  it("closes the modal and navigates when an internal action link is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<AllRipplesModal open onChange={mockOnChange} />, { wrapper: Wrapper });

    // Act
    await user.click(screen.getByRole("link", { name: "Install Pulse" }));

    // Assert
    expect(mockOnChange).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/extensions/app/install?manifestUrl=https%3A%2F%2Fpulse.saleor.app%2Fapi%2Fmanifest",
    );
  });

  it("opens Pulse directly when it is already installed", async () => {
    // Arrange
    usePulsePromotionLink.mockReturnValue({
      kind: "internal",
      to: "/extensions/app/pulse-app-id",
      intent: "open",
      loading: false,
    });

    const user = userEvent.setup();

    render(<AllRipplesModal open onChange={mockOnChange} />, { wrapper: Wrapper });

    // Act
    await user.click(screen.getByRole("link", { name: "Open Pulse" }));

    // Assert
    expect(mockOnChange).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith("/extensions/app/pulse-app-id");
  });

  it("links to the App Store explore URL on open-source instances", async () => {
    // Arrange
    usePulsePromotionLink.mockReturnValue({
      kind: "external",
      href: "https://apps.saleor.io/apps/pulse",
      intent: "explore",
      loading: false,
    });

    const user = userEvent.setup();

    render(<AllRipplesModal open onChange={mockOnChange} />, { wrapper: Wrapper });

    // Act
    const exploreLink = screen.getByRole("link", { name: "Explore Pulse" });

    await user.click(exploreLink);

    // Assert
    expect(exploreLink).toHaveAttribute("href", "https://apps.saleor.io/apps/pulse");
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });
});
