import { style } from "@vanilla-extract/css";
import { vars } from "~/theme";

export const trigger = style({});

export const icon = style({
  transition: "transform 300ms",
  selectors: {
    [`${trigger}[data-state="open"] &`]: {
      transform: "rotate(180deg)",
    },
  },
});

export const button = style({
  selectors: {
    [`${trigger}[data-state="open"] &`]: {
      // using vars here as sprinkles do not work currently in selectors
      // https://github.com/vanilla-extract-css/vanilla-extract/discussions/824
      backgroundColor: vars.colors.background.default1Focused,
    },
  },
});
