import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
import { SessionEndedError, SessionExpiredError } from "@dashboard/auth/errors";
import { LoginDocument } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";
import type * as ReactIntl from "react-intl";

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
  useIntl: (): { formatMessage: (message: { defaultMessage: string }) => string } => ({
    formatMessage: message => message.defaultMessage,
  }),
}));

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

  it("still reports a request that failed on the network", () => {
    // Arrange
    const failed = new ApolloError({ networkError: new TypeError("Failed to fetch") });

    // Act
    captured.onError?.(failed);

    // Assert
    expect(mockNotify).toHaveBeenCalled();
  });
});
