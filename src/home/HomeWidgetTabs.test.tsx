import { type Extension } from "@dashboard/extensions/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeWidgetTabs } from "./HomeWidgetTabs";

const mockNavigate = jest.fn();
const mockTrackEvent = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);
jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));
jest.mock("@dashboard/extensions/preferences/InlineExtensionPreferenceControls", () => ({
  InlineExtensionPreferenceControls: ({ surface }: { surface: string }) => (
    <div data-test-id="preference-controls">{surface}</div>
  ),
}));

const buildExtension = ({
  id,
  isSaleorOfficial,
}: {
  id: string;
  isSaleorOfficial: boolean;
}): Extension => ({
  id,
  app: {
    __typename: "App",
    id: `app-${id}`,
    identifier: null,
    appUrl: "https://app.example.com",
    name: `${id} app`,
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label: `${id} widget`,
  identifier: null,
  mountName: "HOMEPAGE_WIDGETS",
  url: `https://app.example.com/${id}`,
  open: jest.fn(),
  targetName: "WIDGET",
  settings: null,
  isSaleorOfficial,
  fromCache: false,
});

describe("HomeWidgetTabs", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockTrackEvent.mockClear();
  });

  it("tracks fullscreen and grid widget tabs before navigating", async () => {
    // Arrange
    const user = userEvent.setup();
    const officialExtension = buildExtension({ id: "official", isSaleorOfficial: true });
    const thirdPartyExtension = buildExtension({ id: "third-party", isSaleorOfficial: false });

    render(
      <HomeWidgetTabs
        fullscreenExtensions={[officialExtension, thirdPartyExtension]}
        showWidgetsTab
        activeTab={{ kind: "extension", id: officialExtension.id }}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByTestId("home-widget-tab-official"));
    await user.click(screen.getByTestId("home-widget-tab-third-party"));
    await user.click(screen.getByTestId("home-widgets-tab"));

    // Assert
    expect(mockTrackEvent).toHaveBeenNthCalledWith(1, "home_widget_opened", {
      extension_origin: "saleor",
      source: "home_tab",
      widget_kind: "fullscreen",
    });
    expect(mockTrackEvent).toHaveBeenNthCalledWith(2, "home_widget_opened", {
      extension_origin: "third_party",
      source: "home_tab",
      widget_kind: "fullscreen",
    });
    expect(mockTrackEvent).toHaveBeenNthCalledWith(3, "home_widget_opened", {
      source: "home_tab",
      widget_kind: "grid",
    });
    expect(mockNavigate).toHaveBeenNthCalledWith(1, "/home/widget/official");
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/home/widget/third-party");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "/home/widgets");
    expect(screen.getByTestId("preference-controls")).toHaveTextContent("home");
  });
});
