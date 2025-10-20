import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { render, screen } from "@testing-library/react";
import * as React from "react";

import { AppInstallButton } from "./AppInstallButton";

jest.mock("@dashboard/hooks/useHasManagedAppsPermission");

jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn(() => ({ enabled: true })),
}));

jest.mock("@dashboard/components/Link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const ConfigMock = jest.requireMock("@dashboard/config");

jest.mock("@dashboard/config", () => ({
  __esModule: true,
  ...(jest.requireActual("@dashboard/config") as object),
  IS_CLOUD_INSTANCE: true,
}));

describe("Extensions / ExtensionItem / AppInstallButton", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should render disabled install button when has no permissions", () => {
    // Arrange
    ConfigMock.IS_CLOUD_INSTANCE = true;
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({
      hasManagedAppsPermission: false,
    });

    // Act
    render(<AppInstallButton manifestUrl="test-manifest" />);

    // Assert
    expect(screen.getByText("Install")).toBeVisible();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should render disabled install button when no cloud instance", () => {
    // Arrange
    ConfigMock.IS_CLOUD_INSTANCE = false;
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });

    // Act
    render(<AppInstallButton manifestUrl="test-manifest" />);

    // Assert
    expect(screen.getByText("Install")).toBeVisible();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should render install button when has permissions and cloud instance", () => {
    // Arrange
    ConfigMock.IS_CLOUD_INSTANCE = true;
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });

    // Act
    render(<AppInstallButton manifestUrl="test-manifest" />);

    // Assert
    expect(screen.getByText("Install")).toBeVisible();
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
