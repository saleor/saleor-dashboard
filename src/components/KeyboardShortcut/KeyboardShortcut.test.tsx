import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { KeyboardKey, KeyboardShortcutHint } from "./KeyboardShortcut";

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
    expect(kbd).toHaveStyle({ display: "inline-block" });
  });
});

describe("KeyboardShortcutHint", () => {
  it("controls visibility via opacity", () => {
    // Arrange
    const { container, rerender } = render(<KeyboardShortcutHint visible key1="⌘" key2="↵" />, {
      wrapper: Wrapper,
    });

    // Assert
    expect((container.firstChild as HTMLElement).style.opacity).toBe("1");

    // Act
    rerender(
      <Wrapper>
        <KeyboardShortcutHint visible={false} key1="⌘" key2="↵" />
      </Wrapper>,
    );

    // Assert
    expect((container.firstChild as HTMLElement).style.opacity).toBe("0");
  });
});
