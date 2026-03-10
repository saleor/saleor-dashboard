import { style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

import { sprinkles, vars } from "~/theme";

export const labelRecipe = recipe({
  base: [
    sprinkles({
      position: "relative",
      display: "flex",
      color: "default2",
      borderRadius: 3,
      paddingY: 1.5,
      borderWidth: 1,
      borderStyle: "solid",
      cursor: "text",
      backgroundColor: "transparent",
    }),
  ],
  variants: {
    size: {
      small: sprinkles({
        paddingX: 2,
      }),
      medium: sprinkles({
        paddingX: 2,
      }),
      large: sprinkles({
        paddingX: 3,
      }),
    },
    active: {
      true: {},
    },
    typed: {
      true: {},
    },
    disabled: {
      true: {},
    },
    error: {
      true: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        typed: true,
        active: true,
        disabled: false,
        error: false,
      },
      style: sprinkles({
        borderStyle: "solid",
        borderColor: "accent1",
      }),
    },
    {
      variants: {
        typed: true,
        active: false,
        disabled: false,
        error: false,
      },
      style: sprinkles({
        borderColor: {
          default: "default1",
          hover: "default1Hovered",
        },
      }),
    },
    {
      variants: {
        typed: false,
        active: true,
        error: false,
      },
      style: sprinkles({
        borderColor: "transparent",
      }),
    },
    {
      variants: {
        typed: false,
        active: false,
        disabled: false,
        error: false,
      },
      style: sprinkles({
        borderStyle: "solid",
        borderColor: {
          default: "default1",
          hover: "default1Hovered",
        },
      }),
    },
    {
      variants: {
        disabled: true,
      },
      style: sprinkles({
        color: "defaultDisabled",
        backgroundColor: "default1",
        borderColor: "default1",
      }),
    },
    {
      variants: {
        error: true,
        typed: false,
      },
      style: sprinkles({
        borderStyle: "solid",
        borderColor: "critical1",
      }),
    },
    {
      variants: {
        error: true,
        typed: true,
      },
      style: sprinkles({
        borderStyle: "solid",
        borderColor: "critical1",
      }),
    },
  ],
  defaultVariants: {
    size: "medium",
  },
});

export const spanRecipe = recipe({
  base: [
    style({
      transition: "transform 0.3s",
      transformOrigin: "left",
      transform: "translate(0, 50%) scale(1)",
      userSelect: "none",
    }),
    sprinkles({
      color: "default2",
    }),
  ],
  variants: {
    size: {
      small: sprinkles({
        fontSize: 1,
        letterSpacing: 1,
        lineHeight: 1,
      }),
      medium: sprinkles({
        fontSize: 2,
        letterSpacing: 2,
        lineHeight: 2,
      }),
      large: sprinkles({
        fontSize: 3,
        letterSpacing: 3,
        lineHeight: 3,
      }),
    },
    disabled: {
      true: sprinkles({ color: "defaultDisabled" }),
    },
    typed: {
      true: [
        {
          transform: "translate(0, 0) scale(0.84)",
        },
      ],
    },
    error: {
      true: sprinkles({
        color: "critical2",
      }),
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const inputRecipe = recipe({
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
        // disable autocomplete background colors
        "&:-webkit-autofill": {
          transition: "background-color 9999s ease-in-out 0s",
        },
        "&:-webkit-autofill:hover": {
          transition: "background-color 9999s ease-in-out 0s",
        },
        "&:-webkit-autofill:focus": {
          transition: "background-color 9999s ease-in-out 0s",
        },
        "&:-webkit-autofill:active": {
          transition: "background-color 9999s ease-in-out 0s",
        },
        "&[data-com-onepassword-filled]": {
          transition: "background-color 9999s ease-in-out 0s",
        },
      },
    },
  ],
  variants: {
    size: {
      small: sprinkles({
        fontSize: 1,
        lineHeight: 1,
      }),
      medium: sprinkles({
        fontSize: 2,
        lineHeight: 2,
      }),
      large: sprinkles({
        fontSize: 3,
        lineHeight: 3,
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

export const helperTextRecipe = recipe({
  variants: {
    size: {
      small: sprinkles({
        paddingTop: 2,
      }),
      medium: sprinkles({
        paddingTop: 2,
      }),
      large: sprinkles({
        paddingTop: 2,
      }),
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export type LabelVariants = RecipeVariants<typeof labelRecipe>;
export type InputVariants = RecipeVariants<typeof inputRecipe>;
