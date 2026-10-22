import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { useNavigatorSearchContext } from "@dashboard/components/NavigatorSearch/useNavigatorSearchContext";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "./SidebarContext";

const mockFeedbackSurvey = jest.fn(() => ({ isAvailable: true }));
const renderEnvironmentSwitcherStub = (): ReactElement => (
  <div data-test-id="cloud-environment-switcher" />
);
const mockEnvironmentSwitcher = jest.fn(renderEnvironmentSwitcherStub);
const mockCaptureException = jest.fn();

jest.mock("@dashboard/cloud", () => ({
  EnvironmentSwitcher: () => mockEnvironmentSwitcher(),
}));
jest.mock("@dashboard/services/errorTracking", () => ({
  errorTracker: { captureException: (error: Error) => mockCaptureException(error) },
}));

jest.mock("./user/useFeedbackSurvey", () => ({
  useFeedbackSurvey: () => mockFeedbackSurvey(),
}));

jest.mock("./menu/hooks/useMenuStructure", () => ({
  useMenuStructure: jest.fn(() => []),
}));
jest.mock("@dashboard/featureFlags/useFlagsInfo", () => ({
  useFlagsInfo: jest.fn(() => []),
}));
jest.mock("@dashboard/auth/hooks/useCloud", () => ({
  useCloud: jest.fn(() => ({
    isAuthenticatedViaCloud: false,
  })),
}));
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: jest.fn(() => ({
    variables: "",
    setVariables: jest.fn(),
    isDevModeVisible: false,
    setDevModeVisibility: jest.fn(),
    devModeContent: "",
    setDevModeContent: jest.fn(),
  })),
}));
jest.mock("@dashboard/components/NavigatorSearch/useNavigatorSearchContext", () => ({
  useNavigatorSearchContext: jest.fn(() => ({
    isNavigatorVisible: false,
    setNavigatorVisibility: jest.fn(),
  })),
}));
jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: jest.fn(() => ({
    initialize: jest.fn(),
    trackEvent: jest.fn(),
  })),
}));
jest.mock("@dashboard/components/ProductAnalytics/config", () => ({
  isProductAnalyticsEnabled: () => true,
}));
jest.mock("@dashboard/ripples/state", () => ({
  useAllRipplesModalState: jest.fn(() => ({
    isModalOpen: false,
    setModalState: jest.fn(),
  })),
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MemoryRouter>
      {/* @ts-expect-error - legacy types */}
      <LegacyThemeProvider>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </LegacyThemeProvider>
    </MemoryRouter>
  );
};

describe("Sidebar", () => {
  beforeEach(() => {
    mockEnvironmentSwitcher.mockImplementation(renderEnvironmentSwitcherStub).mockClear();
    mockCaptureException.mockClear();
  });

  it("renders the global feedback trigger", () => {
    // Arrange
    mockFeedbackSurvey.mockReturnValue({ isAvailable: true });

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole("button", { name: "Send feedback" })).toHaveAttribute(
      "data-posthog-feedback-trigger",
      "true",
    );
  });

  it("hides feedback when its survey is unavailable", () => {
    // Arrange
    mockFeedbackSurvey.mockReturnValue({ isAvailable: false });

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.queryByRole("button", { name: "Send feedback" })).not.toBeInTheDocument();
    expect(screen.getByTestId("feedback-button")).not.toBeVisible();
    expect(screen.getByTestId("feedback-button")).toHaveAttribute(
      "data-posthog-feedback-trigger",
      "true",
    );
  });

  it("should render the Saleor Cloud environment switcher when signed in via Saleor Cloud", async () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isCloudInstance: true,
      isAuthenticatedViaCloud: true,
    }));
    // Act
    render(<Sidebar />, { wrapper: Wrapper });
    // Assert
    expect(await screen.findByTestId("cloud-environment-switcher")).toBeInTheDocument();
  });
  it("should not load the Saleor Cloud environment switcher when not signed in via Saleor Cloud", async () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isCloudInstance: true,
      isAuthenticatedViaCloud: false,
    }));
    // Act
    render(<Sidebar />, { wrapper: Wrapper });
    await act(() => import("@dashboard/cloud"));
    // Assert
    expect(screen.queryByTestId("cloud-environment-switcher")).not.toBeInTheDocument();
    expect(mockEnvironmentSwitcher).not.toHaveBeenCalled();
  });
  it("should keep the sidebar and report the error when the environment switcher fails", async () => {
    // Arrange
    const error = new Error("cloud extension crashed");

    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    mockEnvironmentSwitcher.mockImplementation(() => {
      throw error;
    });
    (useCloud as jest.Mock).mockImplementation(() => ({
      isCloudInstance: true,
      isAuthenticatedViaCloud: true,
    }));
    // Act
    render(<Sidebar />, { wrapper: Wrapper });
    // Assert
    await screen.findByText("Saleor Dashboard");
    await act(() => import("@dashboard/cloud"));
    expect(mockCaptureException).toHaveBeenCalledWith(error);
    expect(screen.getByText("Saleor Dashboard")).toBeInTheDocument();
    consoleError.mockRestore();
  });
  it("should render keyboard shortcuts", () => {
    // Arrange & Act
    render(<Sidebar />, { wrapper: Wrapper });
    // Assert
    expect(screen.getByText("Command menu")).toBeInTheDocument();
    expect(screen.getByText("Playground")).toBeInTheDocument();
  });
  it("should call callback when click on playground shortcut", async () => {
    // Arrange
    const actionCallback = jest.fn();

    (useDevModeContext as jest.Mock).mockImplementationOnce(() => ({
      variables: "",
      setVariables: jest.fn(),
      isDevModeVisible: false,
      setDevModeVisibility: actionCallback,
      devModeContent: "",
      setDevModeContent: jest.fn(),
    }));
    render(<Sidebar />, { wrapper: Wrapper });
    // Act
    await userEvent.click(screen.getByText("Playground"));
    // Assert
    expect(actionCallback).toHaveBeenCalledWith(true);
  });
  it("should call callback when click on search shortcut", async () => {
    // Arrange
    const actionCallback = jest.fn();

    (useNavigatorSearchContext as jest.Mock).mockImplementationOnce(() => ({
      isNavigatorVisible: false,
      setNavigatorVisibility: actionCallback,
    }));
    render(<Sidebar />, { wrapper: Wrapper });
    // Act
    await userEvent.click(screen.getByText("Command menu"));
    // Assert
    expect(actionCallback).toHaveBeenCalledWith(true);
  });
});
