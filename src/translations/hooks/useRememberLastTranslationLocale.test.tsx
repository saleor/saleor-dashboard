import { Locale, RawLocaleProvider } from "@dashboard/components/Locale/Locale";
import { ShopContext } from "@dashboard/components/Shop";
import { LanguageCodeEnum, type ShopInfoQuery } from "@dashboard/graphql";
import {
  TranslationLocalesProvider,
  useCachedLocales,
} from "@dashboard/translations/useCachedLocales";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { useRememberLastTranslationLocale } from "./useRememberLastTranslationLocale";

const shop = {
  languages: [
    { code: LanguageCodeEnum.DE, language: "German" },
    { code: LanguageCodeEnum.PL, language: "Polish" },
  ],
} as ShopInfoQuery["shop"];

function createWrapper(
  initialPath: string,
  shopValue: ShopInfoQuery["shop"] | undefined,
): ({ children }: { children: ReactNode }) => ReactNode {
  return function Wrapper({ children }: { children: ReactNode }): ReactNode {
    return (
      <MemoryRouter initialEntries={[initialPath]}>
        <RawLocaleProvider value={{ locale: Locale.EN, setLocale: () => undefined }}>
          <ShopContext.Provider value={shopValue as ShopInfoQuery["shop"]}>
            <TranslationLocalesProvider>{children}</TranslationLocalesProvider>
          </ShopContext.Provider>
        </RawLocaleProvider>
      </MemoryRouter>
    );
  };
}

function useProbe(): ReturnType<typeof useCachedLocales> {
  useRememberLastTranslationLocale();

  return useCachedLocales();
}

describe("useRememberLastTranslationLocale", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores the language of the translation being viewed", async () => {
    // Arrange
    const { result } = renderHook(() => useProbe(), {
      wrapper: createWrapper("/translations/DE/products/product-1", shop),
    });

    // Act
    await waitFor(() => {
      expect(result.current.lastUsedLocaleOrFallback).toBe(LanguageCodeEnum.DE);
    });

    // Assert
    expect(localStorage.getItem("cachedTranslationLocales")).toBe(
      JSON.stringify([LanguageCodeEnum.DE]),
    );
  });

  it("does not store a language the shop does not enable", () => {
    // Arrange
    const { result } = renderHook(() => useProbe(), {
      wrapper: createWrapper("/translations/FR/products/product-1", shop),
    });

    // Act // Assert
    expect(result.current.cachedValues).toEqual([]);
    expect(localStorage.getItem("cachedTranslationLocales")).toBeNull();
  });

  it("does not store anything from the language list", () => {
    // Arrange
    const { result } = renderHook(() => useProbe(), {
      wrapper: createWrapper("/translations/", shop),
    });

    // Act // Assert
    expect(result.current.cachedValues).toEqual([]);
    expect(localStorage.getItem("cachedTranslationLocales")).toBeNull();
  });

  it("does not store the route language before shop languages have loaded", () => {
    // Arrange
    const { result } = renderHook(() => useProbe(), {
      wrapper: createWrapper("/translations/PL/categories/category-1", undefined),
    });

    // Act // Assert
    expect(result.current.lastUsedLocaleOrFallback).toBeNull();
    expect(localStorage.getItem("cachedTranslationLocales")).toBeNull();
  });
});
