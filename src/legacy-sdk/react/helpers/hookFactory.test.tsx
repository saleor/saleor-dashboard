import { render, screen } from "@testing-library/react";

import { type SaleorClient } from "../../core/types";
import { SaleorProvider } from "../components/SaleorProvider";
import { hookFactory } from "./hookFactory";

const createMockClient = (): SaleorClient => ({
  auth: {
    changePassword: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    setPassword: jest.fn(),
    verifyToken: jest.fn(),
    getExternalAuthUrl: jest.fn(),
    getExternalAccessToken: jest.fn(),
    refreshExternalToken: jest.fn(),
    verifyExternalToken: jest.fn(),
    checkIfSignedIn: jest.fn(),
  } as unknown as SaleorClient["auth"],
  user: {
    accountDelete: jest.fn(),
    accountRequestDeletion: jest.fn(),
    updateAccount: jest.fn(),
  } as unknown as SaleorClient["user"],
  config: { channel: "default", autologin: true, setChannel: jest.fn() },
  _internal: { apolloClient: {} as any },
  getState: jest.fn(),
});

interface HookResultRendererProps<T extends keyof SaleorClient> {
  useHook: () => SaleorClient[T];
  renderValue: (value: any) => string;
}

const HookResultRenderer = <T extends keyof SaleorClient>({
  useHook,
  renderValue,
}: HookResultRendererProps<T>): JSX.Element => {
  const value = useHook();

  return <div data-test-id="hook-result">{renderValue(value)}</div>;
};

describe("hookFactory", () => {
  it("returns the correct property from SaleorClient for 'config' key", () => {
    // Arrange
    const mockClient = createMockClient();
    const useConfig = hookFactory("config");

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <HookResultRenderer useHook={useConfig} renderValue={config => config.channel} />
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("hook-result")).toHaveTextContent("default");
  });

  it("returns the auth object from SaleorClient", () => {
    // Arrange
    const mockClient = createMockClient();
    const useAuth = hookFactory("auth");

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <HookResultRenderer
          useHook={useAuth}
          renderValue={auth => (typeof auth.login === "function" ? "has-login" : "no-login")}
        />
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("hook-result")).toHaveTextContent("has-login");
  });

  it("returns the user object from SaleorClient", () => {
    // Arrange
    const mockClient = createMockClient();
    const useUser = hookFactory("user");

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <HookResultRenderer
          useHook={useUser}
          renderValue={user =>
            typeof user.accountDelete === "function" ? "has-accountDelete" : "no-accountDelete"
          }
        />
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("hook-result")).toHaveTextContent("has-accountDelete");
  });

  it("returns the exact client property values", () => {
    // Arrange
    const mockClient = createMockClient();

    mockClient.config = { channel: "exact-channel", autologin: true, setChannel: jest.fn() };

    const useConfig = hookFactory("config");

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <HookResultRenderer
          useHook={useConfig}
          renderValue={config =>
            `${config.channel}|${String(config.autologin)}|${typeof config.setChannel}`
          }
        />
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("hook-result")).toHaveTextContent("exact-channel|true|function");
  });

  it("throws error when used outside SaleorProvider", () => {
    // Arrange
    const useConfig = hookFactory("config");
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const BrokenComponent = (): JSX.Element => {
      const config = useConfig();

      return <div>{config.channel}</div>;
    };

    // Act & Assert
    expect(() => render(<BrokenComponent />)).toThrow(
      "Could not find saleor's apollo client in the context",
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns updated values when provider client changes", () => {
    // Arrange
    const firstClient = createMockClient();

    firstClient.config = { channel: "channel-1", autologin: true, setChannel: jest.fn() };

    const secondClient = createMockClient();

    secondClient.config = { channel: "channel-2", autologin: false, setChannel: jest.fn() };

    const useConfig = hookFactory("config");

    // Act
    const { rerender } = render(
      <SaleorProvider client={firstClient}>
        <HookResultRenderer useHook={useConfig} renderValue={config => config.channel} />
      </SaleorProvider>,
    );

    // Assert - first client
    expect(screen.getByTestId("hook-result")).toHaveTextContent("channel-1");

    // Act - rerender with second client
    rerender(
      <SaleorProvider client={secondClient}>
        <HookResultRenderer useHook={useConfig} renderValue={config => config.channel} />
      </SaleorProvider>,
    );

    // Assert - second client
    expect(screen.getByTestId("hook-result")).toHaveTextContent("channel-2");
  });
});
