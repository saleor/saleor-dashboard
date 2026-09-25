import { type DefaultTheme } from "@saleor/macaw-ui-next";

/**
 * Macaw `text.default2` is a bit light for secondary/helper copy
 * (~4.1:1 on white). Slightly darker/lighter values clear WCAG AA
 * for small text while staying visually secondary.
 */
export const secondaryTextDefault2: Record<DefaultTheme, string> = {
  defaultLight: "hsla(180, 1%, 40%, 1)", // was 49% (~4.1:1) → ~5.7:1
  defaultDark: "hsla(230, 10%, 62%, 1)", // was 53% (~5.3:1) → ~7.3:1
};

export const secondaryTextCssVar = "--mu-colors-text-default2";
