import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { useInstalledExtensionsFilter } from "./hooks/useInstalledExtensionsFilter";
import { usePendingInstallation } from "./hooks/usePendingInstallation";
import { InstalledExtensions, InstalledExtensionsProps } from "./InstalledExtensions";

const mockMarkOnboardingStepAsCompleted = jest.fn();
const mockHandleRemoveInProgress = jest.fn();
const mockCloseModal = jest.fn();
const mockOpenModal = jest.fn();

const mockInstalledExtensions = [
  { id: "app1", name: "Test App 1", version: "1.0.0", manifestUrl: "url1" },
  { id: "app2", name: "Test App 2", version: "1.0.0", manifestUrl: "url2" },
  { id: "app3", name: "Another Extension", version: "1.0.0", manifestUrl: "url3" },
];

const mockPendingInstallations = [
  { id: "pending1", name: "Pending App 1", manifestUrl: "pendingUrl1" },
];

jest.mock("@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext", () => ({
  useOnboarding: () => ({
    markOnboardingStepAsCompleted: mockMarkOnboardingStepAsCompleted,
    onboardingState: { stepsCompleted: [] },
  }),
}));

jest.mock("@dashboard/utils/handlers/dialogActionHandlers", () => ({
  __esModule: true,
  default: () => [mockOpenModal, mockCloseModal],
}));

jest.mock("./hooks/useInstalledExtensions", () => ({
  useInstalledExtensions: () => ({
    installedExtensions: mockInstalledExtensions,
    installedAppsLoading: false,
    refetchInstalledApps: jest.fn(),
  }),
}));

jest.mock("./hooks/usePendingInstallation");
jest.mock("./hooks/useInstalledExtensionsFilter");
jest.mock("@dashboard/hooks/useHasManagedAppsPermission");
jest.mock("@dashboard/hooks/useNavigator", () => jest.fn(() => jest.fn()));
jest.mock("@dashboard/components/AppLayout/ContextualLinks/useContextualLink", () => ({
  useContextualLink: () => "Extensions",
}));

jest.mock("@dashboard/featureFlags", () => ({
  useFlag: () => true,
  useFlags: () => ({}),
}));

const mockUsePendingInstallation = usePendingInstallation as jest.Mock;
const mockUseInstalledExtensionsFilter = useInstalledExtensionsFilter as jest.Mock;

const mockUseHasManagedAppsPermission = useHasManagedAppsPermission as jest.Mock;

const defaultProps: InstalledExtensionsProps = {
  params: {},
};

describe("InstalledExtensions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHasManagedAppsPermission.mockImplementation(() => ({ hasManagedAppsPermission: true }));
    mockUsePendingInstallation.mockImplementation(() => ({
      pendingInstallations: mockPendingInstallations,
      deleteInProgressAppStatus: "default",
      pendingInstallationsLoading: false,
      handleRemoveInProgress: mockHandleRemoveInProgress,
    }));
    mockUseInstalledExtensionsFilter.mockImplementation(installedExtensions => ({
      query: "",
      handleQueryChange: jest.fn(),
      filteredInstalledExtensions: installedExtensions,
    }));
  });

  it("marks onboarding step as completed on mount", () => {
    // Arrange & Act
    render(<InstalledExtensions {...defaultProps} />);

    // Assert
    expect(mockMarkOnboardingStepAsCompleted).toHaveBeenCalledWith("view-extensions");
  });

  it("displays installed and pending extensions in the list initially", () => {
    // Arrange & Act
    render(<InstalledExtensions {...defaultProps} />);

    // Assert
    expect(screen.getByText("Test App 1")).toBeInTheDocument();
    expect(screen.getByText("Test App 2")).toBeInTheDocument();
    expect(screen.getByText("Another Extension")).toBeInTheDocument();
    expect(screen.getByText("Pending App 1")).toBeInTheDocument();
  });

  it("filters extensions based on search query", () => {
    // Arrange
    const mockHandleQueryChange = jest.fn();
    // Initial render with all extensions
    const { rerender } = render(<InstalledExtensions {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText("Search Extensions...");

    // Act: Simulate typing search query
    fireEvent.change(searchInput, { target: { value: "Test App" } });

    // Simulate the hook updating and providing filtered data by re-rendering
    const filteredMock = mockInstalledExtensions.filter(app => app.name.includes("Test App"));

    mockUseInstalledExtensionsFilter.mockImplementation(() => ({
      query: "Test App",
      handleQueryChange: mockHandleQueryChange, // Keep the mock fn
      filteredInstalledExtensions: filteredMock,
    }));

    // Re-render the component - the hook mock will now provide filtered data
    rerender(<InstalledExtensions {...defaultProps} />);

    // Assert: Check based on the expected filtered list
    expect(screen.getByText("Test App 1")).toBeInTheDocument();
    expect(screen.getByText("Test App 2")).toBeInTheDocument();
    expect(screen.queryByText("Another Extension")).not.toBeInTheDocument();
    // Pending apps are always visible
    expect(screen.getByText("Pending App 1")).toBeInTheDocument();

    act(() => {
      fireEvent.change(searchInput, { target: { value: "" } });
    });

    // Act: Simulate the hook updating for the cleared state by re-rendering
    mockUseInstalledExtensionsFilter.mockImplementation(() => ({
      query: "",
      handleQueryChange: mockHandleQueryChange,
      filteredInstalledExtensions: mockInstalledExtensions, // Back to all extensions
    }));

    // Re-render the component - the hook mock provides all data again
    rerender(<InstalledExtensions {...defaultProps} />);

    // Assert
    expect(screen.getByText("Test App 1")).toBeInTheDocument();
    expect(screen.getByText("Test App 2")).toBeInTheDocument();
    expect(screen.getByText("Another Extension")).toBeInTheDocument();
    expect(screen.getByText("Pending App 1")).toBeInTheDocument();
  });

  it("shows dialog when action is app-installation-remove", () => {
    // Arrange
    const testParams = { action: "app-installation-remove" as const, id: "pending1" };

    // Act
    render(<InstalledExtensions params={testParams} />);

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-content")).toHaveTextContent(
      "Are you sure you want to delete {name} failed installation?",
    );
  });

  it("calls handleRemoveInProgress when dialog is confirmed", () => {
    // Arrange
    render(<InstalledExtensions params={{ action: "app-installation-remove", id: "pending1" }} />);

    // Act
    fireEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(mockHandleRemoveInProgress).toHaveBeenCalledWith("pending1");
  });

  it("calls closeModal when dialog is cancelled", () => {
    // Arrange
    render(<InstalledExtensions params={{ action: "app-installation-remove", id: "pending1" }} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("shows Add Extension button when user has permission", () => {
    // Arrange
    mockUseHasManagedAppsPermission.mockImplementation(() => ({ hasManagedAppsPermission: true }));

    // Act
    render(<InstalledExtensions {...defaultProps} />);

    // Assert
    expect(screen.getByText("Add Extension")).toBeInTheDocument();
  });

  it("does not show Add Extension button when user lacks permission", () => {
    // Arrange
    mockUseHasManagedAppsPermission.mockImplementation(() => ({ hasManagedAppsPermission: false }));

    // Act
    render(<InstalledExtensions {...defaultProps} />);

    // Assert
    expect(screen.queryByText("Add Extension")).not.toBeInTheDocument();
  });
});
