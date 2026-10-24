import { type InstalledExtension } from "@dashboard/extensions/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { warningAppProblem } from "../AppProblems/fixtures";
import { InstalledExtensionsList } from "./InstalledExtensionsList";

describe("InstalledExtensionsList", () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("keeps app navigation and problem controls separate from the deprecation tooltip", async () => {
    // Arrange
    const extension: InstalledExtension = {
      id: "product-feed",
      name: "Product Feed",
      href: "/extensions/app/product-feed",
      deprecated: true,
      logo: null,
      info: null,
      activeProblemCount: 1,
      criticalProblemCount: 0,
      problems: [warningAppProblem],
    };

    render(
      <MemoryRouter>
        <InstalledExtensionsList
          installedExtensions={[extension]}
          loading={false}
          clearSearch={jest.fn()}
        />
      </MemoryRouter>,
    );

    const appLink = screen.getByRole("link", { name: "Product Feed" });
    const problemControl = screen.getByRole("button", { name: /1 problem/ });

    // Act
    fireEvent.focus(appLink);

    const tooltip = await screen.findByRole("tooltip");

    fireEvent.click(problemControl);

    // Assert
    expect(appLink).toHaveAttribute("href", "/extensions/app/product-feed");
    expect(tooltip).toHaveTextContent("This app is being deprecated");
    expect(problemControl).toHaveAttribute("aria-expanded", "false");
  });

  it.each([true, false])(
    "shows migration guidance on name focus (has reason: %s)",
    async hasReason => {
      // Arrange
      const extension: InstalledExtension = {
        id: "smtp",
        name: "SMTP",
        deprecated: true,
        deprecationReason: hasReason ? "Use Customer Emails instead." : null,
        logo: null,
        info: null,
        activeProblemCount: 0,
        criticalProblemCount: 0,
      };

      render(
        <InstalledExtensionsList
          installedExtensions={[extension]}
          loading={false}
          clearSearch={jest.fn()}
        />,
      );

      // Act
      fireEvent.focus(screen.getByText("SMTP"));

      // Assert
      const tooltip = await screen.findByRole("tooltip");

      expect(tooltip).toHaveTextContent("This app is being deprecated");
      expect(tooltip).toHaveTextContent(
        hasReason
          ? "Use Customer Emails instead."
          : "It still works, but the developer recommends migrating.",
      );
    },
  );

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
    const installedExtensions: InstalledExtension[] = [
      {
        id: "smtp",
        name: "SMTP",
        deprecated: true,
        logo: null,
        info: null,
        activeProblemCount: 0,
        criticalProblemCount: 0,
      },
    ];

    render(
      <InstalledExtensionsList
        installedExtensions={installedExtensions}
        loading={false}
        clearSearch={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("SMTP")).toBeInTheDocument();
    expect(screen.queryByText("Deprecated")).not.toBeInTheDocument();
  });

  it("shows the name and the reason for extensions that declared one", () => {
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
    expect(screen.queryByText("Deprecated")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("app-deprecation-reason")).toHaveLength(1);
    expect(screen.getByText("Use Customer Emails instead.")).toBeInTheDocument();
  });

  it("links the Migrate button to the replacement app install page", () => {
    // Arrange
    const extension: InstalledExtension = {
      id: "1",
      name: "SMTP",
      logo: null,
      info: null,
      activeProblemCount: 0,
      criticalProblemCount: 0,
      deprecated: true,
      migrateUrl: "/extensions/app/install?manifestUrl=replacement",
    };

    // Act
    render(
      <MemoryRouter>
        <InstalledExtensionsList
          installedExtensions={[extension]}
          loading={false}
          clearSearch={jest.fn()}
        />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByTestId("migrate-deprecated-app")).toHaveAttribute(
      "href",
      "/extensions/app/install?manifestUrl=replacement",
    );
    expect(screen.getByRole("button", { name: "Migrate" })).toBeInTheDocument();
  });
});
