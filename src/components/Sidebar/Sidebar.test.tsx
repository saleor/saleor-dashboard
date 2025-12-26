import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { useNavigatorSearchContext } from "@dashboard/components/NavigatorSearch/useNavigatorSearchContext";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "./SidebarContext";

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
  it("should render cloud environment link when is cloud instance", () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isAuthenticatedViaCloud: true,
    }));
    // Act
    render(<Sidebar />, { wrapper: Wrapper });
    // Assert
    expect(screen.getByTestId("cloud-environment-link")).toBeInTheDocument();
  });
  it("should not render cloud environment link when is not cloud instance", () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isAuthenticatedViaCloud: false,
    }));
    // Act
    render(<Sidebar />, { wrapper: Wrapper });
    // Assert
    expect(screen.queryByTestId("cloud-environment-link")).not.toBeInTheDocument();
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
