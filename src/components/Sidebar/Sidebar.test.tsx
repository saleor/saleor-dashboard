import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { useNavigatorSearchContext } from "@dashboard/components/NavigatorSearch/useNavigatorSearchContext";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

import { Sidebar } from "./Sidebar";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <>{defaultMessage}</>
  ),
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

jest.mock(
  "@dashboard/components/NavigatorSearch/useNavigatorSearchContext",
  () => ({
    useNavigatorSearchContext: jest.fn(() => ({
      isNavigatorVisible: false,
      setNavigatorVisibility: jest.fn(),
    })),
  }),
);

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <LegacyThemeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LegacyThemeProvider>
  );
};

describe("Sidebar", () => {
  it('shouldd render "Go to Saleor Cloud" link when is cloud instance', () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isAuthenticatedViaCloud: true,
    }));

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText("Go to Saleor Cloud")).toBeInTheDocument();
  });

  it('shouldd not render "Go to Saleor Cloud" link when is not cloud instance', () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isAuthenticatedViaCloud: false,
    }));

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.queryByText("Go to Saleor Cloud")).not.toBeInTheDocument();
  });

  it("should render keyboard shortcuts", () => {
    // Arrange & Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText("Search")).toBeInTheDocument();
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
    await userEvent.click(screen.getByText("Search"));

    // Assert
    expect(actionCallback).toHaveBeenCalledWith(true);
  });
});
