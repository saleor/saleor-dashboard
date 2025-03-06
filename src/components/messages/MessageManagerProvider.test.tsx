import { renderHook } from "@testing-library/react-hooks";
import React, { useContext } from "react";

import { MessageContext } from ".";
import MessageManagerProvider from "./MessageManagerProvider";

// Mock MessageDisplay component since we're not testing its functionality
jest.mock("./MessageDisplay", () => ({
  MessageDisplay: () => <div data-test-id="message-display">Message Display</div>,
}));

describe("MessageManagerProvider", () => {
  test("should provide MessageContext to children", () => {
    // Arrange
    const { result } = renderHook(() => useContext(MessageContext), {
      wrapper: ({ children }) => <MessageManagerProvider>{children}</MessageManagerProvider>,
    });

    // Assert: context exists
    expect(result.current).toBeTruthy();
    expect(typeof result.current?.show).toBe("function");
    expect(typeof result.current?.remove).toBe("function");
    expect(typeof result.current?.clearErrorNotifications).toBe("function");
  });
});
