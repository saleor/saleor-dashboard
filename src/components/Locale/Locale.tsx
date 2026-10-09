import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { createContext, type ReactNode, useEffect, useState } from "react";
import { IntlProvider, ReactIntlErrorCode } from "react-intl";

export enum Locale {
  AR = "ar",
  AZ = "az",
  BG = "bg",
  BN = "bn",
  CA = "ca",
  CS = "cs",
  DA = "da",
  DE = "de",
  EL = "el",
  EN = "en",
  ES = "es",
  ES_CO = "es-CO",
  ET = "et",
  FA = "fa",
  FR = "fr",
  HI = "hi",
  HU = "hu",
  HY = "hy",
  ID = "id",
  IS = "is",
  IT = "it",
  JA = "ja",
  KO = "ko",
  MN = "mn",
  NB = "nb",
  NL = "nl",
  PL = "pl",
  PT = "pt",
  PT_BR = "pt-BR",
  RO = "ro",
  RU = "ru",
  SK = "sk",
  SL = "sl",
  SQ = "sq",
  SR = "sr",
  SV = "sv",
  TH = "th",
  TR = "tr",
  UK = "uk",
  VI = "vi",
  ZH_HANS = "zh-Hans",
  ZH_HANT = "zh-Hant",
}

interface StructuredMessage {
  context?: string;
  string: string;
}
type LocaleMessages = Record<string, StructuredMessage>;

export const localeNames: Record<Locale, string> = {
  [Locale.AR]: "العربيّة",
  [Locale.AZ]: "Azərbaycanca",
  [Locale.BG]: "български",
  [Locale.BN]: "বাংলা",
  [Locale.CA]: "català",
  [Locale.CS]: "česky",
  [Locale.DA]: "dansk",
  [Locale.DE]: "Deutsch",
  [Locale.EL]: "Ελληνικά",
  [Locale.EN]: "English",
  [Locale.ES]: "español",
  [Locale.ES_CO]: "español de Colombia",
  [Locale.ET]: "eesti",
  [Locale.FA]: "فارسی",
  [Locale.FR]: "français",
  [Locale.HI]: "Hindi",
  [Locale.HU]: "Magyar",
  [Locale.HY]: "հայերեն",
  [Locale.ID]: "Bahasa Indonesia",
  [Locale.IS]: "Íslenska",
  [Locale.IT]: "italiano",
  [Locale.JA]: "日本語",
  [Locale.KO]: "한국어",
  [Locale.MN]: "Mongolian",
  [Locale.NB]: "norsk (bokmål)",
  [Locale.NL]: "Nederlands",
  [Locale.PL]: "polski",
  [Locale.PT]: "Português",
  [Locale.PT_BR]: "Português Brasileiro",
  [Locale.RO]: "Română",
  [Locale.RU]: "Русский",
  [Locale.SK]: "Slovensky",
  [Locale.SL]: "Slovenščina",
  [Locale.SQ]: "shqip",
  [Locale.SR]: "српски",
  [Locale.SV]: "svenska",
  [Locale.TH]: "ภาษาไทย",
  [Locale.TR]: "Türkçe",
  [Locale.UK]: "Українська",
  [Locale.VI]: "Tiếng Việt",
  [Locale.ZH_HANS]: "简体中文",
  [Locale.ZH_HANT]: "繁體中文",
};

const dotSeparator = "_dot_";
const sepRegExp = new RegExp(dotSeparator, "g");

function getKeyValueJson(messages: LocaleMessages | undefined): Record<string, string> | undefined {
  if (!messages) {
    return undefined;
  }

  return Object.entries(messages).reduce<Record<string, string>>((acc, [id, msg]) => {
    acc[id.replace(sepRegExp, ".")] = msg.string;

    return acc;
  }, {});
}

const supportedLocales = new Set<string>(Object.values(Locale));

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === "string" && supportedLocales.has(value);

/**
 * Maps a locale setting to a supported `Locale`.
 *
 * Accepts the enum key used by `LOCALE_CODE` ("EN", "PT_BR"), the locale tag
 * stored in local storage ("en", "pt-BR") and loosely formatted variants of
 * both (surrounding whitespace, lower case, dashes instead of underscores).
 * Anything that still does not match a supported locale yields `fallback`.
 */
export const resolveLocale = (value: unknown, fallback: Locale = Locale.EN): Locale => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  if (isSupportedLocale(trimmed)) {
    return trimmed;
  }

  const enumKey = trimmed.toUpperCase().replace(/-/g, "_");

  if (Object.prototype.hasOwnProperty.call(Locale, enumKey)) {
    return Locale[enumKey as keyof typeof Locale];
  }

  return fallback;
};

const defaultLocale = resolveLocale(process.env.LOCALE_CODE);

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
export const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => undefined,
});

const { Consumer: LocaleConsumer, Provider: RawLocaleProvider } = LocaleContext;
const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [storedLocale, setLocale] = useLocalStorage<string>("locale", defaultLocale);
  // A stale or hand-edited value in local storage must not take the whole
  // dashboard down, so anything unsupported falls back to the default.
  const locale = resolveLocale(storedLocale, defaultLocale);
  const [messages, setMessages] = useState<LocaleMessages | undefined>(undefined);

  useEffect(
    function loadMessages() {
      let cancelled = false;

      async function changeLocale() {
        if (locale === Locale.EN) {
          setMessages(undefined);

          return;
        }

        try {
          // It seems like Webpack is unable to use aliases for lazy imports
          const mod = await import(`../../../locale/${locale}.json`);

          if (!cancelled) {
            setMessages(mod.default);
          }
        } catch (error) {
          // Missing or broken translation bundle: keep the default messages
          // instead of surfacing an unhandled rejection.
          console.error(`Could not load translations for locale "${locale}"`, error);

          if (!cancelled) {
            setMessages(undefined);
          }
        }
      }

      changeLocale();

      return () => {
        cancelled = true;
      };
    },
    [locale],
  );

  return (
    <IntlProvider
      defaultLocale={defaultLocale}
      locale={locale}
      messages={getKeyValueJson(messages)}
      onError={err => {
        if (!(err.code === ReactIntlErrorCode.MISSING_TRANSLATION)) {
          console.error(err);
        }
      }}
      key={locale}
    >
      <RawLocaleProvider
        value={{
          locale,
          setLocale,
        }}
      >
        {children}
      </RawLocaleProvider>
    </IntlProvider>
  );
};

export { LocaleConsumer, LocaleProvider, RawLocaleProvider };
