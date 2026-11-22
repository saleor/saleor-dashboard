// The "pt" catalogue is European Portuguese. Formatting it as plain "pt" would use Brazilian
// conventions: plural rules that treat 0 as singular ("0 produto" instead of "0 produtos") and
// Brazilian number and currency formats. The saved language code stays "pt".
export const getFormattingLocale = (locale: string): string => (locale === "pt" ? "pt-PT" : locale);
