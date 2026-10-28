import { Locale, RawLocaleProvider } from "@dashboard/components/Locale/Locale";
import { ShopContext } from "@dashboard/components/Shop";
import { LanguageCodeEnum, type ShopInfoQuery } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";
import { type ReactNode } from "react";

import {
  CachedLocalesStack,
  resolveLastUsedTranslationLocale,
  TranslationLocalesProvider,
  useCachedLocales,
} from "./useCachedLocales";

describe("CachedLocalesStack", () => {
  let stack: CachedLocalesStack;

  beforeEach(() => {
    // Arrange
    stack = new CachedLocalesStack([]);
  });

  describe("getMembers", () => {
    it("should return empty array when no members are added", () => {
      // Arrange
      // Act
      const members = stack.getMembers();

      // Assert
      expect(members).toEqual([]);
    });

    it("should return members in right order", () => {
      // Arrange
      stack.appendMember(LanguageCodeEnum.EN);
      stack.appendMember(LanguageCodeEnum.PL);
      stack.appendMember(LanguageCodeEnum.DE);

      // Act
      const members = stack.getMembers();

      // Assert
      expect(members).toEqual([LanguageCodeEnum.EN, LanguageCodeEnum.PL, LanguageCodeEnum.DE]);
    });
  });

  describe("appendMember", () => {
    it("should add new member to the stack", () => {
      // Arrange
      // Act
      stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(stack.getMembers()).toContain(LanguageCodeEnum.EN);
    });

    it("should not add duplicate members", () => {
      // Arrange
      stack.appendMember(LanguageCodeEnum.EN);

      // Act
      stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(stack.getMembers()).toEqual([LanguageCodeEnum.EN]);
    });

    it("moves a language that is already cached to the most recent position", () => {
      // Arrange
      stack.appendMember(LanguageCodeEnum.EN);
      stack.appendMember(LanguageCodeEnum.PL);
      stack.appendMember(LanguageCodeEnum.DE);

      // Act
      stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(stack.getMembers()).toEqual([
        LanguageCodeEnum.PL,
        LanguageCodeEnum.DE,
        LanguageCodeEnum.EN,
      ]);
    });

    it("keeps the oldest language when a cached language is chosen again at capacity", () => {
      // Arrange
      const languages = [
        LanguageCodeEnum.EN,
        LanguageCodeEnum.PL,
        LanguageCodeEnum.DE,
        LanguageCodeEnum.FR,
        LanguageCodeEnum.ES,
        LanguageCodeEnum.IT,
        LanguageCodeEnum.RU,
        LanguageCodeEnum.JA,
        LanguageCodeEnum.KO,
        LanguageCodeEnum.ZH,
      ];

      languages.forEach(lang => stack.appendMember(lang));

      // Act
      stack.appendMember(LanguageCodeEnum.PL);

      // Assert
      const members = stack.getMembers();

      expect(members).toHaveLength(10);
      expect(members[0]).toBe(LanguageCodeEnum.EN);
      expect(members[members.length - 1]).toBe(LanguageCodeEnum.PL);
    });

    it("should remove oldest member when exceeding max capacity", () => {
      // Arrange
      const languages = [
        LanguageCodeEnum.EN,
        LanguageCodeEnum.PL,
        LanguageCodeEnum.DE,
        LanguageCodeEnum.FR,
        LanguageCodeEnum.ES,
        LanguageCodeEnum.IT,
        LanguageCodeEnum.RU,
        LanguageCodeEnum.JA,
        LanguageCodeEnum.KO,
        LanguageCodeEnum.ZH,
      ];

      expect(languages.length).toBe(10);

      languages.forEach(lang => stack.appendMember(lang));

      // Act
      stack.appendMember(LanguageCodeEnum.AR);

      // Assert
      const members = stack.getMembers();

      expect(members).not.toContain(LanguageCodeEnum.EN);
      expect(members).toContain(LanguageCodeEnum.AR);
      expect(members.length).toBe(10);
    });

    it("should return the updated members set", () => {
      // Arrange
      // Act
      const result = stack.appendMember(LanguageCodeEnum.EN);

      // Assert
      expect(result).toBeInstanceOf(Set);
      expect(result.has(LanguageCodeEnum.EN)).toBe(true);
    });
  });
});

const shopLanguages = [
  LanguageCodeEnum.EN,
  LanguageCodeEnum.DE,
  LanguageCodeEnum.PL,
  LanguageCodeEnum.FR,
  LanguageCodeEnum.ES,
];

function shopWith(codes: LanguageCodeEnum[]): ShopInfoQuery["shop"] {
  return {
    languages: codes.map(code => ({ code, language: code })),
  } as ShopInfoQuery["shop"];
}

function createWrapper(
  shop: ShopInfoQuery["shop"] | undefined,
): ({ children }: { children: ReactNode }) => ReactNode {
  return function Wrapper({ children }: { children: ReactNode }): ReactNode {
    return (
      <RawLocaleProvider value={{ locale: Locale.EN, setLocale: () => undefined }}>
        <ShopContext.Provider value={shop as ShopInfoQuery["shop"]}>
          <TranslationLocalesProvider>{children}</TranslationLocalesProvider>
        </ShopContext.Provider>
      </RawLocaleProvider>
    );
  };
}

describe("resolveLastUsedTranslationLocale", () => {
  it("trusts the cached language while shop languages are still loading", () => {
    // Arrange
    const cachedLocales = [LanguageCodeEnum.DE];

    // Act
    const result = resolveLastUsedTranslationLocale({
      cachedLocales,
      shopLanguageCodes: undefined,
      interfaceLocale: Locale.EN,
    });

    // Assert
    expect(result).toBe(LanguageCodeEnum.DE);
  });

  it("does not guess from the interface language while shop languages are loading", () => {
    // Arrange // Act
    const result = resolveLastUsedTranslationLocale({
      cachedLocales: [],
      shopLanguageCodes: undefined,
      interfaceLocale: Locale.PT_BR,
    });

    // Assert
    expect(result).toBeNull();
  });

  it("skips a cached language the shop no longer enables", () => {
    // Arrange
    const cachedLocales = [LanguageCodeEnum.DE, LanguageCodeEnum.PL];

    // Act
    const result = resolveLastUsedTranslationLocale({
      cachedLocales,
      shopLanguageCodes: [LanguageCodeEnum.DE],
      interfaceLocale: Locale.EN,
    });

    // Assert
    expect(result).toBe(LanguageCodeEnum.DE);
  });

  it("uses the interface language when it is a shop language and nothing is cached", () => {
    // Arrange // Act
    const result = resolveLastUsedTranslationLocale({
      cachedLocales: [],
      shopLanguageCodes: [LanguageCodeEnum.EN, LanguageCodeEnum.DE],
      interfaceLocale: Locale.EN,
    });

    // Assert
    expect(result).toBe("EN");
  });

  it("does not turn a dashboard locale into a translation language code", () => {
    // Arrange // Act
    const result = resolveLastUsedTranslationLocale({
      cachedLocales: [],
      shopLanguageCodes: [LanguageCodeEnum.EN, LanguageCodeEnum.PT_BR],
      interfaceLocale: Locale.PT_BR,
    });

    // Assert
    expect(result).toBeNull();
  });
});

describe("useCachedLocales", () => {
  beforeEach(() => {
    // Arrange
    localStorage.clear();
  });

  it("returns no cached languages until one is opened", () => {
    // Arrange
    const { result } = renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });

    // Act // Assert
    expect(result.current.cachedValues).toEqual([]);
    expect(result.current.lastUsedLocaleOrFallback).toBe("EN");
  });

  it("remembers the most recently opened language across remounts", () => {
    // Arrange
    const { result, unmount } = renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });

    // Act
    act(() => {
      result.current.pushValue(LanguageCodeEnum.DE);
    });
    unmount();

    const remounted = renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });

    // Assert
    expect(remounted.result.current.lastUsedLocaleOrFallback).toBe(LanguageCodeEnum.DE);
    expect(remounted.result.current.cachedValues[0]).toBe(LanguageCodeEnum.DE);
    expect(localStorage.getItem("cachedTranslationLocales")).toBe(
      JSON.stringify([LanguageCodeEnum.DE]),
    );
  });

  it("lists cached languages with the most recent first", () => {
    // Arrange
    const { result } = renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });
    const languages = [
      LanguageCodeEnum.EN,
      LanguageCodeEnum.PL,
      LanguageCodeEnum.DE,
      LanguageCodeEnum.FR,
      LanguageCodeEnum.ES,
    ];

    // Act
    act(() => {
      languages.forEach(lang => result.current.pushValue(lang));
    });

    // Assert
    expect(result.current.cachedValues).toEqual([...languages].reverse());
    expect(result.current.lastUsedLocaleOrFallback).toBe(LanguageCodeEnum.ES);
  });

  it("does not write storage until a language is recorded", () => {
    // Arrange // Act
    renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });

    // Assert
    expect(localStorage.getItem("cachedTranslationLocales")).toBeNull();
  });

  it("ignores a stored value that is not a list of languages", () => {
    // Arrange
    localStorage.setItem("cachedTranslationLocales", JSON.stringify({ code: "DE" }));

    // Act
    const { result } = renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });

    // Assert
    expect(result.current.cachedValues).toEqual([]);
    expect(result.current.lastUsedLocaleOrFallback).toBe("EN");
  });

  it("remembers nothing when rendered without the provider", () => {
    // Arrange
    localStorage.setItem("cachedTranslationLocales", JSON.stringify([LanguageCodeEnum.DE]));

    // Act
    const { result } = renderHook(() => useCachedLocales());

    act(() => {
      result.current.pushValue(LanguageCodeEnum.PL);
    });

    // Assert
    expect(result.current.lastUsedLocaleOrFallback).toBeNull();
    expect(result.current.cachedValues).toEqual([]);
    expect(localStorage.getItem("cachedTranslationLocales")).toBe(
      JSON.stringify([LanguageCodeEnum.DE]),
    );
  });

  it("does not rewrite storage when the current language is recorded again", () => {
    // Arrange
    const { result } = renderHook(() => useCachedLocales(), {
      wrapper: createWrapper(shopWith(shopLanguages)),
    });

    act(() => {
      result.current.pushValue(LanguageCodeEnum.DE);
    });

    const stored = localStorage.getItem("cachedTranslationLocales");

    // Act
    act(() => {
      result.current.pushValue(LanguageCodeEnum.DE);
    });

    // Assert
    expect(localStorage.getItem("cachedTranslationLocales")).toBe(stored);
    expect(result.current.cachedValues).toEqual([LanguageCodeEnum.DE]);
  });
});
