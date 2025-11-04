import { Locale } from "@dashboard/components/Locale";
import { render, screen } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider as JotaiProvider } from "jotai";
import { IntlProvider } from "react-intl";

import { AppExtensionActiveParams } from "../../app-extension-popup-state";
import { AppExtensionPopupProvider, useActiveAppExtension } from "./AppExtensionContextProvider";

// Create a minimal wrapper without ExternalAppProvider (since we want to test it)
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <JotaiProvider>
    <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
      {children}
    </IntlProvider>
  </JotaiProvider>
);

// Mock the dependencies
jest.mock(
  "@dashboard/extensions/views/ViewManifestExtension/components/AppDialog/AppDialog",
  () => ({
    AppDialog: ({ children, open, title }: any) =>
      open ? (
        <div data-test-id="app-dialog" data-title={title}>
          {children}
        </div>
      ) : null,
  }),
);

jest.mock("@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame", () => ({
  AppFrame: ({ src, appToken, appId, params, dashboardVersion, coreVersion }: any) => (
    <div
      data-test-id="app-frame"
      data-src={src}
      data-app-token={appToken}
      data-app-id={appId}
      data-params={JSON.stringify(params)}
      data-dashboard-version={dashboardVersion}
      data-core-version={coreVersion}
    />
  ),
}));

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock("@dashboard/hooks/useShop", () => ({
  __esModule: true,
  default: jest.fn(() => ({ version: "3.0.0" })),
}));

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => mockNavigate,
}));

describe("ExternalAppContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ExternalAppProvider", () => {
    it("renders children correctly", () => {
      // Arrange & Act
      render(
        <TestWrapper>
          <AppExtensionPopupProvider>
            <div data-test-id="test-child">Test Content</div>
          </AppExtensionPopupProvider>
        </TestWrapper>,
      );

      // Assert
      expect(screen.getByTestId("test-child")).toBeInTheDocument();
    });

    it("does not render AppDialog when closed", () => {
      // Arrange & Act
      render(
        <TestWrapper>
          <AppExtensionPopupProvider>
            <div>Test Content</div>
          </AppExtensionPopupProvider>
        </TestWrapper>,
      );

      // Assert
      expect(screen.queryByTestId("app-dialog")).not.toBeInTheDocument();
    });
  });

  describe("useExternalApp hook", () => {
    const wrapper = ({ children }: any) => (
      <TestWrapper>
        <AppExtensionPopupProvider>{children}</AppExtensionPopupProvider>
      </TestWrapper>
    );

    it("initially returns open as false", () => {
      // Arrange & Act
      const { result } = renderHook(() => useActiveAppExtension(), { wrapper });

      // Assert
      expect(result.current.active).toBe(false);
    });

    it("opens app in popup when target is POPUP", () => {
      // Arrange
      const { result } = renderHook(() => useActiveAppExtension(), { wrapper });
      const appData: AppExtensionActiveParams = {
        id: "test-app-id",
        appToken: "test-token",
        src: "https://example.com",
        label: "Test App",
        targetName: "POPUP",
        params: { productId: "123" },
        formState: {},
      };

      // Act
      act(() => {
        result.current.activate(appData);
      });

      // Assert
      expect(result.current.active).toBe(true);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("navigates when target is APP_PAGE", () => {
      // Arrange
      const { result } = renderHook(() => useActiveAppExtension(), { wrapper });
      const appData: AppExtensionActiveParams = {
        id: "test-app-id",
        appToken: "test-token",
        src: "custom-path",
        label: "Test App",
        targetName: "APP_PAGE",
        params: { productId: "123" },
        formState: {},
      };

      // Act
      act(() => {
        result.current.activate(appData);
      });

      // Assert
      expect(result.current.active).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("test-app-id"),
        expect.objectContaining({ resetScroll: true }),
      );
    });

    it("closes app when deactivate is called", () => {
      // Arrange
      const { result } = renderHook(() => useActiveAppExtension(), { wrapper });
      const appData: AppExtensionActiveParams = {
        id: "test-app-id",
        appToken: "test-token",
        src: "https://example.com",
        label: "Test App",
        targetName: "POPUP",
        formState: {},
      };

      // Act
      act(() => {
        result.current.activate(appData);
      });
      expect(result.current.active).toBe(true);

      act(() => {
        result.current.deactivate();
      });

      // Assert
      expect(result.current.active).toBe(false);
    });
  });

  describe("AppDialog and AppFrame rendering", () => {
    const TestComponent = () => {
      const { activate } = useActiveAppExtension();
      const appData: AppExtensionActiveParams = {
        id: "test-app-id",
        appToken: "test-token",
        src: "https://example.com/app",
        label: "Test App",
        targetName: "POPUP",
        params: { productId: "123" },
        formState: {},
      };

      return (
        <button onClick={() => activate(appData)} data-test-id="open-app-button">
          Open App
        </button>
      );
    };

    it("renders AppDialog with AppFrame when app is opened in popup", () => {
      // Arrange & Act
      render(
        <TestWrapper>
          <AppExtensionPopupProvider>
            <TestComponent />
          </AppExtensionPopupProvider>
        </TestWrapper>,
      );

      // Act
      const button = screen.getByTestId("open-app-button");

      button.click();

      // Assert
      const dialog = screen.getByTestId("app-dialog");

      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("data-title", "Test App");

      const frame = screen.getByTestId("app-frame");

      expect(frame).toBeInTheDocument();
      expect(frame).toHaveAttribute("data-src", "https://example.com/app");
      expect(frame).toHaveAttribute("data-app-token", "test-token");
      expect(frame).toHaveAttribute("data-app-id", "test-app-id");
      expect(frame).toHaveAttribute("data-params", JSON.stringify({ productId: "123" }));
    });

    it("does not render AppFrame when app is not opened", () => {
      // Arrange & Act
      render(
        <TestWrapper>
          <AppExtensionPopupProvider>
            <div>Test Content</div>
          </AppExtensionPopupProvider>
        </TestWrapper>,
      );

      // Assert
      expect(screen.queryByTestId("app-frame")).not.toBeInTheDocument();
    });

    it("passes dashboard and core versions to AppFrame", () => {
      // Arrange
      const TestVersionComponent = () => {
        const { activate } = useActiveAppExtension();
        const appData: AppExtensionActiveParams = {
          id: "test-app-id",
          appToken: "test-token",
          src: "https://example.com/app",
          label: "Test App",
          targetName: "POPUP",
          formState: {},
        };

        return (
          <button onClick={() => activate(appData)} data-test-id="open-version-app-button">
            Open App
          </button>
        );
      };

      // Act
      render(
        <TestWrapper>
          <AppExtensionPopupProvider>
            <TestVersionComponent />
          </AppExtensionPopupProvider>
        </TestWrapper>,
      );

      const button = screen.getByTestId("open-version-app-button");

      button.click();

      // Assert
      const frame = screen.getByTestId("app-frame");

      expect(frame).toHaveAttribute("data-core-version", "3.0.0");
      expect(frame).toHaveAttribute("data-dashboard-version");
    });
  });

  describe("Dialog close handler", () => {
    it("closes dialog and clears app data when dialog onClose is called", () => {
      // Arrange
      const wrapper = ({ children }: any) => (
        <TestWrapper>
          <AppExtensionPopupProvider>{children}</AppExtensionPopupProvider>
        </TestWrapper>
      );

      const { result } = renderHook(() => useActiveAppExtension(), { wrapper });
      const appData: AppExtensionActiveParams = {
        id: "test-app-id",
        appToken: "test-token",
        src: "https://example.com",
        label: "Test App",
        targetName: "POPUP",
        formState: {},
      };

      // Act - Open the app
      act(() => {
        result.current.activate(appData);
      });
      expect(result.current.active).toBe(true);

      // Act - Close via deactivate
      act(() => {
        result.current.deactivate();
      });

      // Assert
      expect(result.current.active).toBe(false);
      expect(screen.queryByTestId("app-frame")).not.toBeInTheDocument();
    });
  });
});
