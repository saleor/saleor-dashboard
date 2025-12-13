import { ThemeProvider } from "@saleor/macaw-ui-next";
import { renderHook } from "@testing-library/react-hooks";
import { PropsWithChildren, useContext } from "react";

import { MessageContext } from ".";
import MessageManagerProvider from "./MessageManagerProvider";

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}));

describe("MessageManagerProvider", () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider>
      <MessageManagerProvider>{children}</MessageManagerProvider>
    </ThemeProvider>
  );

  test("should provide MessageContext to children", () => {
    // Arrange & Act
    const { result } = renderHook(() => useContext(MessageContext), { wrapper });

    // Assert
    expect(result.current).toBeTruthy();
    expect(typeof result.current?.show).toBe("function");
    expect(typeof result.current?.remove).toBe("function");
    expect(typeof result.current?.clearErrorNotifications).toBe("function");
  });
});
