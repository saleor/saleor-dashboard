import { render, screen } from "@testing-library/react";
import { useContext } from "react";

import { type SaleorClient } from "../../core/types";
import { SaleorContext, SaleorProvider } from "./SaleorProvider";

const createMockClient = (overrides?: Partial<SaleorClient>): SaleorClient => ({
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
  ...overrides,
});

const ContextConsumer = (): JSX.Element => {
  const client = useContext(SaleorContext);

  return <div data-test-id="context-value">{client ? "has-client" : "no-client"}</div>;
};

const ContextChannelReader = (): JSX.Element => {
  const client = useContext(SaleorContext);

  return <div data-test-id="channel">{client?.config.channel ?? "none"}</div>;
};

describe("SaleorProvider", () => {
  it("renders children when client is provided", () => {
    // Arrange
    const mockClient = createMockClient();

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <div data-test-id="child">Child content</div>
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("provides client through context", () => {
    // Arrange
    const mockClient = createMockClient();

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <ContextConsumer />
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("context-value")).toHaveTextContent("has-client");
  });

  it("provides the correct client instance through context", () => {
    // Arrange
    const mockClient = createMockClient({
      config: { channel: "test-channel", autologin: false, setChannel: jest.fn() },
    });

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <ContextChannelReader />
      </SaleorProvider>,
    );

    // Assert
    expect(screen.getByTestId("channel")).toHaveTextContent("test-channel");
  });

  it("updates context when client prop changes", () => {
    // Arrange
    const firstClient = createMockClient({
      config: { channel: "first", autologin: true, setChannel: jest.fn() },
    });
    const secondClient = createMockClient({
      config: { channel: "second", autologin: true, setChannel: jest.fn() },
    });

    // Act
    const { rerender } = render(
      <SaleorProvider client={firstClient}>
        <ContextChannelReader />
      </SaleorProvider>,
    );

    // Assert - first client
    expect(screen.getByTestId("channel")).toHaveTextContent("first");

    // Act - rerender with new client
    rerender(
      <SaleorProvider client={secondClient}>
        <ContextChannelReader />
      </SaleorProvider>,
    );

    // Assert - second client
    expect(screen.getByTestId("channel")).toHaveTextContent("second");
  });

  it("always renders when a truthy client is provided (initial state is the client prop)", () => {
    // Arrange
    const mockClient = createMockClient();

    // Act
    render(
      <SaleorProvider client={mockClient}>
        <div data-test-id="rendered">Rendered</div>
      </SaleorProvider>,
    );

    // Assert
    // Since the initial state is set to the client prop, context is always truthy
    // and children should always render on the first pass
    expect(screen.getByTestId("rendered")).toBeInTheDocument();
  });

  it("does not provide context value outside of provider", () => {
    // Arrange & Act
    render(<ContextConsumer />);

    // Assert
    expect(screen.getByTestId("context-value")).toHaveTextContent("no-client");
  });
});
