import { render, screen } from "@testing-library/react";
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
    const TestConsumer = () => {
      // Access the context
      const messageContext = useContext(MessageContext);

      // Assert that context is provided and has expected methods
      return (
        <div>
          {messageContext ? (
            <div data-test-id="context-provided">
              {typeof messageContext.show === "function" &&
              typeof messageContext.remove === "function" &&
              typeof messageContext.clearErrorNotifications === "function"
                ? "Context methods available"
                : "Missing context methods"}
            </div>
          ) : (
            <div data-test-id="context-missing">Context not provided</div>
          )}
        </div>
      );
    };

    // Act
    render(
      <MessageManagerProvider>
        <TestConsumer />
      </MessageManagerProvider>,
    );

    // Assert
    expect(screen.getByTestId("context-provided")).toBeInTheDocument();
    expect(screen.getByTestId("context-provided")).toHaveTextContent("Context methods available");
    expect(screen.getByTestId("message-display")).toBeInTheDocument();
  });
});
