import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { sprinkles, vars } from "~/theme";

// override translate because multiselect has two items inside wrapper: label text and input
export const multiselectSpanRecipe = recipe({
  base: [
    style({
      transform: "translate(0, 42%) scale(1)",
    }),
  ],
  variants: {
    typed: {
      true: [
        {
          transform: "translate(0, 0) scale(0.84)",
        },
      ],
    },
  },
});

export const multiselectInputRecipe = recipe({
  base: [
    sprinkles({
      width: "100%",
      backgroundColor: "transparent",
      fontSize: 3,
      lineHeight: 3,
      borderWidth: 0,
      outlineStyle: "none",
      padding: 0,
      color: {
        default: "default1",
        disabled: "defaultDisabled",
      },
    }),
    {
      selectors: {
        "&::-webkit-input-placeholder": {
          color: "transparent",
        },
        "&::-moz-placeholder": {
          color: "transparent",
        },
        "&:focus::-webkit-input-placeholder": {
          color: vars.colors.text.default2,
        },
        "&:focus::-moz-placeholder": {
          color: vars.colors.text.default2,
        },
      },
    },
  ],
  variants: {
    size: {
      small: sprinkles({
        fontSize: 1,
        lineHeight: 1,
        letterSpacing: 1,
      }),
      medium: sprinkles({
        fontSize: 2,
        lineHeight: 2,
        letterSpacing: 2,
      }),
      large: sprinkles({
        fontSize: 2,
        lineHeight: 2,
        letterSpacing: 2,
      }),
    },
    error: {
      true: sprinkles({
        color: "critical1",
      }),
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
