import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
import { ShopInfoDocument } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";
import type * as ReactIntl from "react-intl";
import { type IntlShape } from "react-intl";

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
  useIntl: (): IntlShape =>
    jest.requireActual<{ testIntlInstance: IntlShape }>("@test/intl").testIntlInstance,
}));

/** What Apollo's HTTP link rejects with for a status the API answered with. */
const serverError = (statusCode: number): Error =>
  Object.assign(new Error(`Response not successful: Received status code ${statusCode}`), {
    name: "ServerError",
    statusCode,
  });
/** What it rejects with when the body isn't JSON, such as an HTML page. */
const htmlAnswer = (statusCode: number): Error =>
  Object.assign(new SyntaxError(`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`), {
    name: "ServerParseError",
    statusCode,
  });

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

  it.each([
    [
      "a 500",
      serverError(500),
      "Saleor ran into a problem (error 500). Reload the page to try again.",
    ],
    [
      "Saleor's HTML crash page",
      htmlAnswer(500),
      "Saleor ran into a problem (error 500). Reload the page to try again.",
    ],
    [
      "a firewall's page",
      htmlAnswer(403),
      "The server refused the request (error 403). Reload the page to try again.",
    ],
    [
      "a captive portal's page",
      htmlAnswer(200),
      "The server sent an answer the dashboard can't read. Reload the page to try again.",
    ],
  ])("reports a load that got %s in plain words", (_case, networkError, text) => {
    // Arrange
    renderHook(() => useQuery(ShopInfoDocument, {}));

    // Act
    captured.onError?.(new ApolloError({ networkError }));

    // Assert
    expect(mockNotify).toHaveBeenCalledWith({
      status: "error",
      title: "Couldn't load some data",
      text,
    });
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
