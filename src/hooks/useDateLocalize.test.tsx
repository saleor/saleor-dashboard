import { Locale, LocaleContext } from "@dashboard/components/Locale";
import { renderHook } from "@testing-library/react-hooks";
import { type ReactNode } from "react";

import useDateLocalize from "./useDateLocalize";

function createWrapper(locale: Locale) {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    const value = { locale, setLocale: () => undefined };

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
  };

  Wrapper.displayName = "LocaleWrapper";

  return Wrapper;
}

describe("useDateLocalize", () => {
  it("formats date with default 'll' format in EN locale", () => {
    // Arrange
    const wrapper = createWrapper(Locale.EN);

    // Act
    const { result } = renderHook(() => useDateLocalize(), { wrapper });
    const formatted = result.current("2024-01-15T14:30:00Z");

    // Assert
    expect(formatted).toBe("Jan 15, 2024");
  });

  it("formats date with explicit 'lll' format including time", () => {
    // Arrange
    const wrapper = createWrapper(Locale.EN);

    // Act
    const { result } = renderHook(() => useDateLocalize(), { wrapper });
    const formatted = result.current("2024-01-15T14:30:00Z", "lll");

    // Assert
    expect(formatted).toBe("Jan 15, 2024 2:30 PM");
  });

  it("formats date with PL locale", () => {
    // Arrange
    const wrapper = createWrapper(Locale.PL);

    // Act
    const { result } = renderHook(() => useDateLocalize(), { wrapper });
    const formatted = result.current("2024-01-15T14:30:00Z");

    // Assert
    expect(formatted).toBe("15 sty 2024");
  });

  it("returns 'Invalid date' for empty string input", () => {
    // Arrange
    const wrapper = createWrapper(Locale.EN);

    // Act
    const { result } = renderHook(() => useDateLocalize(), { wrapper });
    const formatted = result.current("");

    // Assert
    expect(formatted).toBe("Invalid date");
  });

  it("formats ISO datetime string correctly", () => {
    // Arrange
    const wrapper = createWrapper(Locale.EN);

    // Act
    const { result } = renderHook(() => useDateLocalize(), { wrapper });
    const formatted = result.current("2024-06-15T09:00:00Z");

    // Assert
    expect(formatted).toBe("Jun 15, 2024");
  });
});
