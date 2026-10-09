import useLocale from "@dashboard/hooks/useLocale";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";

import { isSupportedLocale, Locale, LocaleProvider, resolveLocale } from "./Locale";

describe("resolveLocale", () => {
  it.each([
    ["EN", Locale.EN],
    ["en", Locale.EN],
    [" EN ", Locale.EN],
    ["PT_BR", Locale.PT_BR],
    ["pt-BR", Locale.PT_BR],
    ["pt-br", Locale.PT_BR],
    ["zh-Hans", Locale.ZH_HANS],
    ["ZH_HANT", Locale.ZH_HANT],
  ])("maps %p to a supported locale", (value, expected) => {
    // Arrange & Act
    const result = resolveLocale(value);

    // Assert
    expect(result).toBe(expected);
  });

  it.each([undefined, null, "", "   ", "xx", "undefined", "en-XX", 42])(
    "falls back to English for %p",
    value => {
      // Arrange & Act
      const result = resolveLocale(value);

      // Assert
      expect(result).toBe(Locale.EN);
    },
  );

  it("uses the provided fallback for unsupported values", () => {
    // Arrange & Act
    const result = resolveLocale("xx", Locale.DE);

    // Assert
    expect(result).toBe(Locale.DE);
  });

  it("does not resolve inherited object properties as locales", () => {
    // Arrange & Act
    const result = resolveLocale("constructor");

    // Assert
    expect(result).toBe(Locale.EN);
  });
});

describe("isSupportedLocale", () => {
  it("accepts every value of the Locale enum", () => {
    // Arrange & Act & Assert
    Object.values(Locale).forEach(locale => {
      expect(isSupportedLocale(locale)).toBe(true);
    });
  });

  it("rejects enum keys and unknown values", () => {
    // Arrange & Act & Assert
    expect(isSupportedLocale("EN")).toBe(false);
    expect(isSupportedLocale("xx")).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
  });
});

describe("LocaleProvider", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LocaleProvider>{children}</LocaleProvider>
  );

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uses the default locale when nothing is stored", () => {
    // Arrange & Act
    const { result } = renderHook(() => useLocale(), { wrapper });

    // Assert
    expect(result.current.locale).toBe(Locale.EN);
  });

  it("uses a supported locale stored in local storage", async () => {
    // Arrange
    localStorage.setItem("locale", Locale.DE);

    // Act
    const { result } = renderHook(() => useLocale(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.locale).toBe(Locale.DE));
  });

  it("falls back to the default locale when the stored value is not supported", () => {
    // Arrange
    localStorage.setItem("locale", "undefined");

    // Act
    const { result } = renderHook(() => useLocale(), { wrapper });

    // Assert
    expect(result.current.locale).toBe(Locale.EN);
  });

  it("keeps rendering when the translation bundle cannot be loaded", async () => {
    // Arrange
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);

    // es-CO is a supported locale, but its bundle is stored as es_CO.json.
    localStorage.setItem("locale", Locale.ES_CO);

    // Act
    const { result } = renderHook(() => useLocale(), { wrapper });

    // Assert
    expect(result.current.locale).toBe(Locale.ES_CO);
    await waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Could not load translations for locale "es-CO"'),
        expect.anything(),
      ),
    );
  });
});
