import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
import { SessionEndedError, SessionExpiredError } from "@dashboard/auth/errors";
import { LoginDocument } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";
import type * as ReactIntl from "react-intl";
import { type IntlShape } from "react-intl";

import { useMutation } from "./makeMutation";

interface CapturedOptions {
  onError?: (error: ApolloError) => void;
}

const mockNotify = jest.fn();
let captured: CapturedOptions = {};

jest.mock("@apollo/client", () => ({
  ...jest.requireActual<typeof ApolloClientModule>("@apollo/client"),
  useMutation: (_document: unknown, options: CapturedOptions): [jest.Mock, object] => {
    captured = options;

    return [jest.fn(), { called: false, loading: false }];
  },
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => mockNotify,
}));
jest.mock("@dashboard/auth/useUser", () => ({
  useUser: (): { logout: jest.Mock } => ({ logout: jest.fn() }),
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

describe("useMutation error notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() => useMutation(LoginDocument, {}));
  });

  it("stays silent about a request dropped because its session ended", () => {
    // Arrange
    const dropped = new ApolloError({ networkError: new SessionEndedError() });

    // Act
    captured.onError?.(dropped);

    // Assert
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("says the session expired when the refresh it waited for was refused", () => {
    // Arrange
    const expired = new ApolloError({ networkError: new SessionExpiredError() });

    // Act
    captured.onError?.(expired);

    // Assert
    expect(mockNotify).toHaveBeenCalledTimes(1);
    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        text: "Your session has expired. Please log in again to continue.",
      }),
    );
  });

  it("reports an action that got no answer once, without the network text or a claim it failed", () => {
    // Arrange
    const failed = new ApolloError({ networkError: new TypeError("Failed to fetch") });

    // Act
    captured.onError?.(failed);

    // Assert
    expect(mockNotify).toHaveBeenCalledTimes(1);
    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        title: "No answer from Saleor",
        text: "Check whether the change went through before trying again.",
      }),
    );
    expect(JSON.stringify(mockNotify.mock.calls)).not.toContain("Failed to fetch");
  });

  const checkFirst = "Check whether the change went through before trying again.";

  it.each([
    ["a 500", serverError(500), "Saleor ran into a problem (error 500)", checkFirst],
    [
      "Saleor's HTML crash page",
      htmlAnswer(500),
      "Saleor ran into a problem (error 500)",
      checkFirst,
    ],
    ["a captive portal's page", htmlAnswer(200), "Unexpected answer from the server", checkFirst],
    [
      "a proxy refusing a large upload",
      htmlAnswer(413),
      "The server refused the request (error 413)",
      "The change wasn't saved.",
    ],
  ])(
    "reports %s in plain words, without the raw error text",
    (_case, networkError, title, text) => {
      // Act
      captured.onError?.(new ApolloError({ networkError }));

      // Assert
      expect(mockNotify).toHaveBeenCalledTimes(1);
      expect(mockNotify).toHaveBeenCalledWith({ status: "error", title, text });
    },
  );

  it("still passes on the message of an error Saleor answered with", () => {
    // Arrange
    const networkError = Object.assign(serverError(400), {
      result: { errors: [{ message: 'Variable "$id" of required type "ID!" was not provided.' }] },
    });

    // Act
    captured.onError?.(new ApolloError({ networkError }));

    // Assert
    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        apiMessage: 'Variable "$id" of required type "ID!" was not provided.',
      }),
    );
  });
});
