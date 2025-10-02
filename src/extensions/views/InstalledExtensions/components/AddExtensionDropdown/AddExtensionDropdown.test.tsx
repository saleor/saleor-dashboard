import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddExtensionDropdown } from "./AddExtensionDropdown";

jest.mock("@dashboard/hooks/useHasManagedAppsPermission", () => ({
  useHasManagedAppsPermission: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNavigator", () => jest.fn());

jest.mock("@dashboard/extensions/urls", () => ({
  ExtensionsUrls: {
    resolveExploreExtensionsUrl: jest.fn(() => "/explore-extensions"),
    installCustomExtensionUrl: jest.fn(() => "/install-custom-extension"),
    addCustomExtensionUrl: jest.fn(() => "/add-custom-extension"),
  },
}));

describe("AddExtensionDropdown", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigator as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders the dropdown button when user has MANAGE_APPS permission", () => {
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });
    render(<AddExtensionDropdown />);
    expect(screen.getByTestId("add-extension-button")).toBeInTheDocument();
  });

  it("does not render the dropdown button when user lacks MANAGE_APPS permission", () => {
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: false });
    render(<AddExtensionDropdown />);
    expect(screen.queryByTestId("add-extension-button")).not.toBeInTheDocument();
  });

  it("navigates to explore extensions when selecting from dropdown", async () => {
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });
    render(<AddExtensionDropdown />);
    await userEvent.click(screen.getByTestId("add-extension-button"));
    await userEvent.click(screen.getByTestId("explore-extensions"));
    expect(mockNavigate).toHaveBeenCalledWith("/explore-extensions");
  });

  it("navigates to install custom extension when selecting from dropdown", async () => {
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });
    render(<AddExtensionDropdown />);
    await userEvent.click(screen.getByTestId("add-extension-button"));
    await userEvent.click(screen.getByTestId("install-custom-extension"));
    expect(mockNavigate).toHaveBeenCalledWith("/install-custom-extension");
  });

  it("navigates to add custom extension when selecting from dropdown", async () => {
    (useHasManagedAppsPermission as jest.Mock).mockReturnValue({ hasManagedAppsPermission: true });
    render(<AddExtensionDropdown />);
    await userEvent.click(screen.getByTestId("add-extension-button"));
    await userEvent.click(screen.getByTestId("add-custom-extension"));
    expect(mockNavigate).toHaveBeenCalledWith("/add-custom-extension");
  });
});
