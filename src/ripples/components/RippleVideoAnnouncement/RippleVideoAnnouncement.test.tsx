import { type Ripple } from "@dashboard/ripples/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createIntl, defineMessage, type useIntl } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { RippleVideoAnnouncement } from "./RippleVideoAnnouncement";

const mockSetFirstSeenFlag = jest.fn();
const mockSetManuallyHidden = jest.fn();
const mockGetShouldShow = jest.fn();
const { useIntl: mockUseIntl } = jest.requireActual<{
  useIntl: jest.MockedFunction<typeof useIntl>;
}>("react-intl");

jest.mock("@dashboard/ripples/hooks/useRipplesStorage", () => ({
  useRippleStorage: () => ({
    getShouldShow: mockGetShouldShow,
    setFirstSeenFlag: mockSetFirstSeenFlag,
    setManuallyHidden: mockSetManuallyHidden,
    hideAllRipples: jest.fn(),
  }),
}));

const model: Ripple = {
  type: "feature",
  ID: "test-video-announcement",
  TTL_seconds: 3600,
  dateAdded: new Date("2026-07-31"),
  content: {
    oneLiner: "Test Announcement",
    contextual: "Try this new feature.",
    global: "Global description.",
  },
};

describe("RippleVideoAnnouncement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when the ripple should not show", () => {
    // Arrange
    mockGetShouldShow.mockReturnValue(false);

    // Act
    render(
      <MemoryRouter>
        <RippleVideoAnnouncement
          model={model}
          videoUrl="https://example.com/video.mp4"
          dismissAriaLabel="Dismiss"
          primaryAction={{ href: "/install", label: "Install" }}
        />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.queryByTestId("ripple-video-announcement-test-video-announcement")).toBeNull();
  });

  it("marks the ripple as seen and dismisses on close", async () => {
    // Arrange
    mockGetShouldShow.mockReturnValue(true);

    const user = userEvent.setup();

    // Act
    render(
      <MemoryRouter>
        <RippleVideoAnnouncement
          model={model}
          videoUrl="https://example.com/video.mp4"
          dismissAriaLabel="Dismiss"
          primaryAction={{ href: "/install", label: "Install" }}
        />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText("Test Announcement")).toBeInTheDocument();
    expect(mockSetFirstSeenFlag).toHaveBeenCalledWith(model);

    await user.click(screen.getByTestId("ripple-video-announcement-dismiss"));
    expect(mockSetManuallyHidden).toHaveBeenCalledWith(model);
  });

  it("localizes the title and video label in the active language", () => {
    // Arrange
    const { createIntl: createRealIntl } = jest.requireActual<{
      createIntl: typeof createIntl;
    }>("../../../../node_modules/react-intl");
    const title = defineMessage({ defaultMessage: "Full description translations", id: "ira4iG" });
    const translatedTitle = "Übersetzungen vollständiger Beschreibungen";
    const localizedModel: Ripple = { ...model, content: { ...model.content, oneLiner: title } };

    mockGetShouldShow.mockReturnValue(true);
    mockUseIntl.mockReturnValue(
      createRealIntl({ locale: "de", messages: { [title.id]: translatedTitle } }),
    );

    try {
      // Act
      render(
        <MemoryRouter>
          <RippleVideoAnnouncement
            model={localizedModel}
            videoUrl="https://example.com/video.mp4"
            dismissAriaLabel="Dismiss"
            primaryAction={{ href: "/install", label: "Install" }}
          />
        </MemoryRouter>,
      );

      // Assert
      expect(screen.getByText(translatedTitle)).toBeInTheDocument();
      expect(screen.getByLabelText(translatedTitle).tagName).toBe("VIDEO");
    } finally {
      mockUseIntl.mockReturnValue(createIntl({ locale: "en", messages: {} }));
    }
  });
});
