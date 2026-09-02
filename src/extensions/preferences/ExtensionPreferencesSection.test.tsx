import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ExtensionPreferencesSection } from "./ExtensionPreferencesSection";

const useExtensionsWithLoadingStateMock = jest.fn();

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensionsWithLoadingState: (...args: unknown[]): unknown =>
    useExtensionsWithLoadingStateMock(...args),
}));

jest.mock("./useExtensionPreferences", () => ({
  useExtensionPreferences: (): {
    getState: () => string;
    setState: jest.Mock;
    isSaving: boolean;
  } => ({
    getState: (): string => "default",
    setState: jest.fn(),
    isSaving: false,
  }),
}));

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: (): (() => void) => jest.fn(),
}));

describe("ExtensionPreferencesSection", () => {
  beforeEach(() => {
    useExtensionsWithLoadingStateMock.mockReset();
  });

  it("shows a skeleton while extensions load, not the empty state", () => {
    // Arrange
    useExtensionsWithLoadingStateMock.mockReturnValue({
      extensions: {},
      loading: true,
    });

    // Act
    render(
      <Wrapper>
        <ExtensionPreferencesSection />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("extension-preferences-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("extension-preferences-empty")).not.toBeInTheDocument();
  });

  it("shows the dashed empty state after load when there are no widgets", () => {
    // Arrange
    useExtensionsWithLoadingStateMock.mockReturnValue({
      extensions: {},
      loading: false,
    });

    // Act
    render(
      <Wrapper>
        <ExtensionPreferencesSection />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("extension-preferences-empty")).toBeInTheDocument();
    expect(screen.getByText("No extension widgets")).toBeInTheDocument();
    expect(screen.getByTestId("extension-preferences-explore")).toBeInTheDocument();
  });
});
