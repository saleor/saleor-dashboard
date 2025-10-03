import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { AddCustomExtension } from "./AddCustomExtension";
import { useHandleCreateAppSubmit } from "./hooks/useHandleCreateAppSubmit";
import { usePermissions } from "./hooks/usePermissions";
import { useUserAppCreationPermissions } from "./hooks/useUserAppCreationPermissions";
import { useUserPermissionSet } from "./hooks/useUserPermissionMap";

// Mock ResizeObserver used by Radix checkbox
class ResizeObserverMock {
  observe() {
    // noop
  }

  unobserve() {
    // noop
  }

  disconnect() {
    // noop
  }
}

global.ResizeObserver = ResizeObserverMock;

jest.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@dashboard/components/Savebar");

jest.mock("./hooks/usePermissions");
jest.mock("./hooks/useHandleCreateAppSubmit");
jest.mock("./hooks/useUserAppCreationPermissions");
jest.mock("./hooks/useUserPermissionMap");

describe("AddCustomExtension", () => {
  const appName = "Test app";
  const mockPermissions = [
    { code: "MANAGE_ORDERS", name: "Manage Orders" },
    { code: "MANAGE_PRODUCTS", name: "Manage Products" },
  ];

  const mockSubmit = jest.fn();
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (usePermissions as jest.Mock).mockReturnValue(mockPermissions);
    (useHandleCreateAppSubmit as jest.Mock).mockReturnValue(mockSubmit);
    (useUserAppCreationPermissions as jest.Mock).mockReturnValue(false);
    (useUserPermissionSet as jest.Mock).mockReturnValue(new Set(mockPermissions.map(p => p.code)));
  });

  it("renders the component with all required elements", () => {
    // Arrange
    render(<AddCustomExtension setToken={mockSetToken} />);

    // Assert
    expect(screen.getByPlaceholderText("Extension Name")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.getByText("Grant this extension full access to the store")).toBeInTheDocument();
    expect(screen.getByText("Manage Orders")).toBeInTheDocument();
    expect(screen.getByText("Manage Products")).toBeInTheDocument();
  });

  it("displays validation error when submitting empty form", async () => {
    // Arrange
    render(<AddCustomExtension setToken={mockSetToken} />);

    // Act
    await userEvent.click(screen.getByText("save"));

    // Assert
    expect(screen.getByText("Extension name is required")).toBeInTheDocument();
  });

  it("creates app without permissions", async () => {
    // Arrange
    render(<AddCustomExtension setToken={mockSetToken} />);

    const appNameInput = screen.getByPlaceholderText("Extension Name");

    // Act
    await userEvent.type(appNameInput, "Test App");
    await userEvent.click(screen.getByText("save"));

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        appName: "Test App",
        permissions: {
          MANAGE_ORDERS: false,
          MANAGE_PRODUCTS: false,
        },
      }),
      expect.anything(),
    );
  });

  it("creates app with some permissions when checked by user", async () => {
    // Arrange
    render(<AddCustomExtension setToken={mockSetToken} />);

    const appNameInput = screen.getByPlaceholderText("Extension Name");
    const ordersCheckbox = screen.getByLabelText(/Manage Orders/i);
    const productsCheckbox = screen.getByLabelText(/Manage Products/i);

    // Act
    await userEvent.type(appNameInput, appName);
    await userEvent.click(ordersCheckbox);
    await userEvent.click(screen.getByText("save"));

    // Assert
    expect(ordersCheckbox).toBeChecked();
    expect(productsCheckbox).not.toBeChecked();
    expect(mockSubmit).toHaveBeenCalledWith(
      {
        appName,
        permissions: {
          MANAGE_ORDERS: true,
          MANAGE_PRODUCTS: false,
        },
      },
      expect.anything(), // Submit event
    );
  });

  it("creates app with all permissions when toggled 'Grant full access'", async () => {
    // Arrange
    render(<AddCustomExtension setToken={mockSetToken} />);

    const appNameInput = screen.getByPlaceholderText("Extension Name");
    const fullAccessCheckbox = screen.getByRole("checkbox", {
      name: /Grant this extension full access/i,
    });
    const ordersCheckbox = screen.getByLabelText(/Manage Orders/i);
    const productsCheckbox = screen.getByLabelText(/Manage Products/i);

    // Act
    await userEvent.type(appNameInput, appName);
    await userEvent.click(fullAccessCheckbox);
    await userEvent.click(screen.getByText("save"));

    // Assert
    expect(ordersCheckbox).toBeChecked();
    expect(productsCheckbox).toBeChecked();
    expect(mockSubmit).toHaveBeenCalledWith(
      {
        appName,
        permissions: {
          MANAGE_ORDERS: true,
          MANAGE_PRODUCTS: true,
        },
      },
      expect.anything(), // Submit event
    );
  });

  it("creates app with no permissions when toggling between 'Grant full access'", async () => {
    // Arrange
    render(<AddCustomExtension setToken={mockSetToken} />);

    const appNameInput = screen.getByPlaceholderText("Extension Name");
    const fullAccessCheckbox = screen.getByRole("checkbox", {
      name: /Grant this extension full access/i,
    });
    const ordersCheckbox = screen.getByLabelText(/Manage Orders/i);
    const productsCheckbox = screen.getByLabelText(/Manage Products/i);

    // Act - First check all permissions
    await userEvent.type(appNameInput, appName);
    await userEvent.click(fullAccessCheckbox);

    // Assert
    expect(ordersCheckbox).toBeChecked();
    expect(productsCheckbox).toBeChecked();

    // Act - Then uncheck full access
    await userEvent.click(fullAccessCheckbox);

    // Assert
    expect(ordersCheckbox).not.toBeChecked();
    expect(productsCheckbox).not.toBeChecked();

    // Act - submit form
    await userEvent.click(screen.getByText("save"));

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(
      {
        appName,
        permissions: {
          MANAGE_ORDERS: false,
          MANAGE_PRODUCTS: false,
        },
      },
      expect.anything(), // Submit event
    );
  });

  it("displays warning when permissions are exceeded", () => {
    // Arrange
    (useUserAppCreationPermissions as jest.Mock).mockReturnValue(true);

    // Act
    render(<AddCustomExtension setToken={mockSetToken} />);

    // Assert
    expect(screen.getByText(/warning/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Grant this extension full access to the store/i),
    ).not.toBeInTheDocument();
  });

  it("allows toggling available permissions and prevents toggling unavailable ones", async () => {
    // Arrange
    const availablePermissions = new Set(["MANAGE_ORDERS"]);

    (useUserPermissionSet as jest.Mock).mockReturnValue(availablePermissions);
    render(<AddCustomExtension setToken={mockSetToken} />);

    const appNameInput = screen.getByPlaceholderText("Extension Name");
    const ordersCheckbox = screen.getByLabelText(/Manage Orders/i);
    const productsCheckbox = screen.getByLabelText(/Manage Products/i);

    // Assert initial state
    expect(ordersCheckbox).not.toBeDisabled();
    expect(productsCheckbox).toBeDisabled();

    // Act
    await userEvent.type(appNameInput, appName);
    await userEvent.click(ordersCheckbox);
    await userEvent.click(productsCheckbox);

    // Assert
    expect(ordersCheckbox).toBeChecked();
    expect(productsCheckbox).not.toBeChecked();

    // Act - submit form
    await userEvent.click(screen.getByText("save"));

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(
      {
        appName,
        permissions: {
          MANAGE_ORDERS: true,
          MANAGE_PRODUCTS: false,
        },
      },
      expect.anything(), // Submit event
    );
  });
});
