import { type LanguageCodeEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import useShop from "@dashboard/hooks/useShop";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** Oldest first. The last entry is the translation language opened most recently. */
const CACHED_TRANSLATION_LOCALES_KEY = "cachedTranslationLocales";

function readStoredLocales(): LanguageCodeEnum[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(CACHED_TRANSLATION_LOCALES_KEY) ?? "[]",
    );

    return Array.isArray(parsed)
      ? parsed.filter((code): code is LanguageCodeEnum => typeof code === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStoredLocales(locales: LanguageCodeEnum[]): void {
  try {
    localStorage.setItem(CACHED_TRANSLATION_LOCALES_KEY, JSON.stringify(locales));
  } catch {
    console.warn(`Could not save ${CACHED_TRANSLATION_LOCALES_KEY} to localStorage`);
  }
}

export class CachedLocalesStack {
  private members = new Set<LanguageCodeEnum>();

  private maxMembers = 10;

  constructor(init: LanguageCodeEnum[]) {
    this.members = new Set<LanguageCodeEnum>(Array.isArray(init) ? init : []);
  }

  getMembers(): LanguageCodeEnum[] {
    return Array.from(this.members);
  }

  appendMember(member: LanguageCodeEnum): Set<LanguageCodeEnum> {
    const alreadyTracked = this.members.has(member);

    if (alreadyTracked) {
      this.members.delete(member);
    } else if (this.members.size >= this.maxMembers) {
      const oldest = this.members.values().next().value;

      if (oldest !== undefined) {
        this.members.delete(oldest);
      }
    }

    this.members.add(member);

    return this.members;
  }
}

interface ResolveLastUsedTranslationLocaleParams {
  /** Oldest first, matching the stored stack. */
  cachedLocales: readonly LanguageCodeEnum[];
  /**
   * Undefined while shop languages are still loading. An empty list means the
   * shop has loaded and has no languages.
   */
  shopLanguageCodes: readonly string[] | undefined;
  interfaceLocale: string;
}

/**
 * Prefer the newest cached language that this shop still enables. While shop
 * languages are loading, only the cache is trusted: the interface language is
 * used once it can be checked, because dashboard locales like "pt-BR" are not
 * shop language codes.
 */
export function resolveLastUsedTranslationLocale({
  cachedLocales,
  shopLanguageCodes,
  interfaceLocale,
}: ResolveLastUsedTranslationLocaleParams): string | null {
  const shopReady = shopLanguageCodes !== undefined;
  const remembered = [...cachedLocales]
    .reverse()
    .find(code => !shopReady || shopLanguageCodes.includes(code));

  if (remembered) {
    return remembered;
  }

  if (!shopReady) {
    return null;
  }

  const interfaceCode = interfaceLocale.toUpperCase();

  if (shopLanguageCodes.includes(interfaceCode)) {
    return interfaceCode;
  }

  return null;
}

interface TranslationLocales {
  /** Recent languages first, limited to languages the shop currently enables. */
  cachedValues: LanguageCodeEnum[];
  /** Null when nothing valid is known yet — open the language list instead. */
  lastUsedLocaleOrFallback: string | null;
  pushValue: (code: LanguageCodeEnum) => void;
}

const TranslationLocalesContext = createContext<TranslationLocales>({
  cachedValues: [],
  lastUsedLocaleOrFallback: null,
  pushValue: () => undefined,
});

export function TranslationLocalesProvider({ children }: { children: ReactNode }): ReactNode {
  const { locale } = useLocale();
  const shop = useShop();
  const [locales, setLocales] = useState(readStoredLocales);
  const loadedLocales = useRef(locales);

  useEffect(
    function persistTranslationLocales() {
      if (locales !== loadedLocales.current) {
        writeStoredLocales(locales);
      }
    },
    [locales],
  );

  const pushValue = useCallback((code: LanguageCodeEnum) => {
    setLocales(current => {
      if (current[current.length - 1] === code) {
        return current;
      }

      const stack = new CachedLocalesStack(current);

      stack.appendMember(code);

      return stack.getMembers();
    });
  }, []);
  const shopLanguages = shop?.languages;
  const lastUsedLocaleOrFallback = resolveLastUsedTranslationLocale({
    cachedLocales: locales,
    shopLanguageCodes: shopLanguages?.map(language => language.code),
    interfaceLocale: locale,
  });
  const cachedValues = useMemo(() => {
    const recentFirst = [...locales].reverse();

    if (!shopLanguages) {
      return recentFirst;
    }

    const enabled = new Set(shopLanguages.map(language => language.code));

    return recentFirst.filter(code => enabled.has(code));
  }, [locales, shopLanguages]);
  const value = useMemo(
    () => ({
      cachedValues,
      lastUsedLocaleOrFallback,
      pushValue,
    }),
    [cachedValues, lastUsedLocaleOrFallback, pushValue],
  );

  return (
    <TranslationLocalesContext.Provider value={value}>
      {children}
    </TranslationLocalesContext.Provider>
  );
}

TranslationLocalesProvider.displayName = "TranslationLocalesProvider";

/** Without the provider (isolated tests, stories) nothing is remembered and Translate opens the language list. */
export function useCachedLocales(): TranslationLocales {
  return useContext(TranslationLocalesContext);
}
