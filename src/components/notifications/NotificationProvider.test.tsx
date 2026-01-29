import { ThemeProvider } from "@saleor/macaw-ui-next";
import { renderHook } from "@testing-library/react-hooks";
import { PropsWithChildren, useContext } from "react";

import { NotificationContext } from ".";
import { NotificationProvider } from "./NotificationProvider";

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    custom: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}));

describe("NotificationProvider", () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeProvider>
  );

  test("should provide NotificationContext to children", () => {
    // Arrange & Act
    const { result } = renderHook(() => useContext(NotificationContext), { wrapper });

    // Assert
    expect(result.current).toBeTruthy();
    expect(typeof result.current?.remove).toBe("function");
    expect(typeof result.current?.clearErrorNotifications).toBe("function");
  });
});
