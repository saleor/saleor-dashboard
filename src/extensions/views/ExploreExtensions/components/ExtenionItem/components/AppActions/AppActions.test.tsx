import { render, screen } from "@testing-library/react";
import React from "react";

import { AppActions } from "./AppActions";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@dashboard/components/Link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("../AppInstallButton", () => ({
  AppInstallButton: () => <div>Install</div>,
}));

describe("Extensions / ExtensionItem / AppActions", () => {
  it("should render managed app button when app is installed and disabled", () => {
    // Arrange & Act
    render(<AppActions isInstalled disabled id="test-id" />);

    // Assert
    expect(screen.getByText("Manage extension")).toBeVisible();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/extensions/app/test-id/edit?");
  });

  it("should render link to installed app when app is installed", () => {
    // Arrange & Act
    render(<AppActions isInstalled id="test-id" />);

    // Assert
    expect(screen.getByText("View details")).toBeVisible();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/extensions/app/test-id?");
  });

  it("should render install button and link to repository when app is not installed", () => {
    // Arrange & Act
    render(
      <AppActions
        isInstalled={false}
        manifestUrl="test-manifest"
        repositoryUrl="test-repository"
      />,
    );

    // Assert
    expect(screen.getByText("Install")).toBeVisible();
    expect(screen.getByText("View on GitHub")).toBeVisible();
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
      "href",
      "test-repository",
    );
  });

  it("should render repository link when app is not installed and manifestUrl is not provided", () => {
    // Arrange & Act
    render(<AppActions isInstalled={false} repositoryUrl="test-repository" />);

    // Assert
    expect(screen.queryByText("Install")).toBeNull();
    expect(screen.getByText("View on GitHub")).toBeVisible();
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
      "href",
      "test-repository",
    );
  });
});
