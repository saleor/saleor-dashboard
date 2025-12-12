import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { KeyboardKey, SendFormKeyboardShortcutHint } from "./SendFormKeyboardShortcutHint";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

describe("KeyboardKey", () => {
  it("renders children in a styled kbd element", () => {
    render(<KeyboardKey>Ctrl</KeyboardKey>);

    const kbd = screen.getByText("Ctrl");

    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toHaveClass("kbd");
  });
});

describe("SendFormKeyboardShortcutHint", () => {
  it("controls visibility via opacity", () => {
    // Arrange
    const { container, rerender } = render(<SendFormKeyboardShortcutHint visible />, {
      wrapper: Wrapper,
    });

    // Assert
    expect((container.firstChild as HTMLElement).style.opacity).toBe("1");

    // Act
    rerender(
      <Wrapper>
        <SendFormKeyboardShortcutHint visible={false} />
      </Wrapper>,
    );

    // Assert
    expect((container.firstChild as HTMLElement).style.opacity).toBe("0");
  });
});
