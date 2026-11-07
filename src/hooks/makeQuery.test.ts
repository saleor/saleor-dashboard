import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
import { ShopInfoDocument } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";
import type * as ReactIntl from "react-intl";

import { useQuery } from "./makeQuery";

interface CapturedOptions {
  onError?: (error: ApolloError) => void;
}

const mockNotify = jest.fn();
const mockBanner = { attached: false };
let captured: CapturedOptions = {};

jest.mock("@apollo/client", () => ({
  ...jest.requireActual<typeof ApolloClientModule>("@apollo/client"),
  useQuery: (_document: unknown, options: CapturedOptions): object => {
    captured = options;

    return { data: undefined, loading: false, fetchMore: jest.fn() };
  },
}));
jest.mock("@dashboard/connection/appConnectionMonitor", () => ({
  connectionMonitor: { isBannerAttached: (): boolean => mockBanner.attached },
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => mockNotify,
}));
jest.mock("@dashboard/auth/useUser", () => ({
  useUser: (): { logout: jest.Mock; user: null } => ({ logout: jest.fn(), user: null }),
}));
jest.mock("@dashboard/hooks/useAppState", () => ({
  __esModule: true,
  default: (): [object, jest.Mock] => [{}, jest.fn()],
}));
jest.mock("react-intl", () => ({
  ...jest.requireActual<typeof ReactIntl>("react-intl"),
  useIntl: (): { formatMessage: (message: { defaultMessage: string }) => string } => ({
    formatMessage: message => message.defaultMessage,
  }),
}));

const unreachable = new ApolloError({ networkError: new TypeError("Failed to fetch") });

describe("useQuery error notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBanner.attached = true;
  });

  it("leaves a load that couldn't reach Saleor to the connection banner", () => {
    // Arrange
    renderHook(() => useQuery(ShopInfoDocument, {}));

    // Act
    captured.onError?.(unreachable);

    // Assert
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("reports such a load itself, without the network text, on a screen with no banner", () => {
    // Arrange
    mockBanner.attached = false;
    renderHook(() => useQuery(ShopInfoDocument, {}));

    // Act
    captured.onError?.(unreachable);

    // Assert
    expect(mockNotify).toHaveBeenCalledTimes(1);
    expect(mockNotify).toHaveBeenCalledWith({
      status: "error",
      title: "Couldn't load some data",
      text: "Reload the page to try again.",
    });
  });

  it("still reports a load that Saleor answered with an error", () => {
    // Arrange
    const serverError = Object.assign(
      new Error("Response not successful: Received status code 500"),
      {
        name: "ServerError",
        statusCode: 500,
      },
    );

    renderHook(() => useQuery(ShopInfoDocument, {}));

    // Act
    captured.onError?.(new ApolloError({ networkError: serverError }));

    // Assert
    expect(mockNotify).toHaveBeenCalled();
  });

  it("passes connection failures to a query's own error handler", () => {
    // Arrange
    const handleError = jest.fn();

    renderHook(() => useQuery(ShopInfoDocument, { handleError }));

    // Act
    captured.onError?.(unreachable);

    // Assert
    expect(handleError).toHaveBeenCalledWith(unreachable);
  });
});
