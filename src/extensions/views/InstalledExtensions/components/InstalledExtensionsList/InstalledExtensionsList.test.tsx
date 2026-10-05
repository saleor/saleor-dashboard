import { type InstalledExtension } from "@dashboard/extensions/types";
import { fireEvent, render, screen } from "@testing-library/react";

import { InstalledExtensionsList } from "./InstalledExtensionsList";

describe("InstalledExtensionsList", () => {
  it("should render loading state when loading is true", () => {
    // Arrange
    render(
      <InstalledExtensionsList installedExtensions={[]} loading={true} clearSearch={jest.fn()} />,
    );

    // Assert
    expect(screen.getByText("Extension Name")).toBeInTheDocument();
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(10);
  });

  it("should render empty state when installed extensions length is 0", () => {
    // Arrange
    const clearSearch = jest.fn();

    render(
      <InstalledExtensionsList
        installedExtensions={[]}
        loading={false}
        clearSearch={clearSearch}
        searchQuery="test"
      />,
    );

    // Act
    fireEvent.click(screen.getByText("Clear search"));

    // Assert
    expect(screen.getByText("No extensions found")).toBeInTheDocument();
    expect(clearSearch).toBeCalledTimes(1);
  });

  it("should render installed extensions list", () => {
    // Arrange
    const installedExtensions = [
      { id: "1", name: "Extension 1" },
      { id: "2", name: "Extension 2" },
    ] as InstalledExtension[];

    render(
      <InstalledExtensionsList
        installedExtensions={installedExtensions}
        loading={false}
        clearSearch={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("Extension 1")).toBeInTheDocument();
    expect(screen.getByText("Extension 2")).toBeInTheDocument();
  });

  it("marks a deprecated extension without hiding it", () => {
    // Arrange
    const installedExtensions = [
      { id: "smtp", name: "SMTP", deprecated: true },
    ] as InstalledExtension[];

    render(
      <InstalledExtensionsList
        installedExtensions={installedExtensions}
        loading={false}
        clearSearch={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("SMTP")).toBeInTheDocument();
    expect(screen.getByTestId("deprecated-extension-badge")).toHaveTextContent("Deprecated");
  });

  it("shows the reason instead of the badge for extensions that declared one", () => {
    // Arrange
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    const installedExtensions: InstalledExtension[] = [
      {
        id: "1",
        name: "SMTP",
        logo: null,
        info: null,
        activeProblemCount: 0,
        criticalProblemCount: 0,
        deprecated: true,
        deprecationReason: "Use Customer Emails instead.",
      },
      {
        id: "2",
        name: "Customer Emails",
        logo: null,
        info: null,
        activeProblemCount: 0,
        criticalProblemCount: 0,
        deprecationReason: null,
      },
    ];

    // Act
    render(
      <InstalledExtensionsList
        installedExtensions={installedExtensions}
        loading={false}
        clearSearch={jest.fn()}
      />,
    );

    // Assert
    expect(screen.queryByTestId("deprecated-extension-badge")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("app-deprecation-reason")).toHaveLength(1);
    expect(screen.getByText("Use Customer Emails instead.")).toBeInTheDocument();
  });
});
