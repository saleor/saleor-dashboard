import { CONST_TYPEFORM_URL } from "@dashboard/extensions/components/RequestExtensionsButton";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ExploreExtensionsActions } from "./ExploreExtensionsActions";

jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn(),
}));

jest.mock("@dashboard/hooks/useHasManagedAppsPermission", () => ({
  useHasManagedAppsPermission: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNavigator", () => jest.fn());

jest.mock("react-intl", () => ({
  FormattedMessage: ({ id, defaultMessage }: { defaultMessage: string; id: string }) =>
    defaultMessage || id,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  defineMessages: (messages: unknown) => messages,
}));

jest.mock("@dashboard/extensions/components/RequestExtensionsButton", () => ({
  RequestExtensionsButton: () => (
    <a href={CONST_TYPEFORM_URL} target="_blank" rel="noopener noreferrer">
      Request integration
    </a>
  ),
  CONST_TYPEFORM_URL: "https://example.com/typeform",
}));
jest.mock("@dashboard/extensions/messages", () => ({
  buttonLabels: {
    addExtension: {
      defaultMessage: "Add Extension",
      id: "addExtension",
    },
    installFromManifest: {
      defaultMessage: "Install from Manifest",
      id: "installFromManifest",
    },
    installManually: {
      defaultMessage: "Install Manually",
      id: "installManually",
    },
  },
}));

describe("ExploreExtensionsActions", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigator as jest.Mock).mockReturnValue(mockNavigate);
    (useFlag as jest.Mock).mockReturnValue({ enabled: true });
  });

  it("always renders request extensions button", () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: false });

    // Act
    render(<ExploreExtensionsActions />);

    // Assert
    const link = screen.getByRole("link", { name: "Request integration" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", CONST_TYPEFORM_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders add extension dropdown when user has permission and extensions dev is enabled", () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });

    // Act
    render(<ExploreExtensionsActions />);

    // Assert
    expect(screen.getByTestId("add-extension-button")).toBeInTheDocument();
  });

  it("doesn't render add extension dropdown user doesn't have permission", () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: false });

    // Act
    render(<ExploreExtensionsActions />);

    // Assert
    expect(screen.queryByTestId("add-extension-button")).not.toBeInTheDocument();
  });

  it("navigates to install custom extension when selecting from dropdown", async () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });

    // Act
    render(<ExploreExtensionsActions />);
    await userEvent.click(screen.getByTestId("add-extension-button"));
    await userEvent.click(screen.getByTestId("install-custom-extension"));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(ExtensionsUrls.installCustomExtensionUrl());
  });

  it("navigates to add custom extension when selecting from dropdown", async () => {
    // Arrange
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });

    // Act
    render(<ExploreExtensionsActions />);
    await userEvent.click(screen.getByTestId("add-extension-button"));
    await userEvent.click(screen.getByTestId("add-custom-extension"));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(ExtensionsUrls.addCustomExtensionUrl());
  });
});
