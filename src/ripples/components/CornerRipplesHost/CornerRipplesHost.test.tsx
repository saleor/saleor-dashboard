import { type Ripple } from "@dashboard/ripples/types";
import { render, screen } from "@testing-library/react";

import { CornerRipplesHost } from "./CornerRipplesHost";

const mockGetShouldShow = jest.fn();

jest.mock("@dashboard/ripples/hooks/useRipplesStorage", () => ({
  useRippleStorage: () => ({
    getShouldShow: mockGetShouldShow,
    setFirstSeenFlag: jest.fn(),
    setManuallyHidden: jest.fn(),
    hideAllRipples: jest.fn(),
  }),
}));

jest.mock("@dashboard/ripples/cornerRipples/allCornerRipples", () => {
  const olderModel: Ripple = {
    type: "feature",
    ID: "corner-older",
    TTL_seconds: 3600,
    dateAdded: new Date(2026, 0, 1),
    content: {
      oneLiner: "Older",
      contextual: "Older contextual",
      global: "Older global",
    },
  };

  const newerModel: Ripple = {
    type: "feature",
    ID: "corner-newer",
    TTL_seconds: 3600,
    dateAdded: new Date(2026, 6, 1),
    content: {
      oneLiner: "Newer",
      contextual: "Newer contextual",
      global: "Newer global",
    },
  };

  return {
    allCornerRipples: [
      {
        model: olderModel,
        Component: ({ model }: { model: Ripple }) => (
          <div data-test-id={model.ID}>{model.content.oneLiner}</div>
        ),
      },
      {
        model: newerModel,
        Component: ({ model }: { model: Ripple }) => (
          <div data-test-id={model.ID}>{model.content.oneLiner}</div>
        ),
      },
    ],
  };
});

describe("CornerRipplesHost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when no corner ripples are eligible", () => {
    // Arrange
    mockGetShouldShow.mockReturnValue(false);

    // Act
    const { container } = render(<CornerRipplesHost />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only the newest eligible corner ripple", () => {
    // Arrange
    mockGetShouldShow.mockReturnValue(true);

    // Act
    render(<CornerRipplesHost />);

    // Assert
    expect(screen.getByTestId("corner-newer")).toBeInTheDocument();
    expect(screen.queryByTestId("corner-older")).toBeNull();
  });

  it("falls through to the next eligible ripple when the newest is hidden", () => {
    // Arrange
    mockGetShouldShow.mockImplementation((ripple: Ripple) => ripple.ID === "corner-older");

    // Act
    render(<CornerRipplesHost />);

    // Assert
    expect(screen.getByTestId("corner-older")).toBeInTheDocument();
    expect(screen.queryByTestId("corner-newer")).toBeNull();
  });
});
