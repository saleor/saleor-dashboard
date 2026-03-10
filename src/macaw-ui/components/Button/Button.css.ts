import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { sprinkles } from "~/theme";

export const button = recipe({
  base: [
    sprinkles({
      outlineStyle: "none",
      display: "flex",
      placeItems: "center",
      padding: 0,
      textDecoration: "none",
      fontWeight: "bold",
      cursor: {
        default: "pointer",
        disabled: "not-allowed",
      },
    }),
  ],

  variants: {
    variant: {
      primary: sprinkles({
        backgroundColor: {
          default: "buttonDefaultPrimary",
          hover: "buttonDefaultPrimaryHovered",
          focusVisible: "buttonDefaultPrimaryFocused",
          active: "buttonDefaultPrimaryPressed",
          disabled: "buttonDefaultDisabled",
        },
        color: {
          default: "buttonDefaultPrimary",
          disabled: "defaultDisabled",
        },
        boxShadow: {
          default: "defaultFocused",
          hover: "defaultHovered",
          focusVisible: "defaultFocused",
          active: "none",
          disabled: "none",
        },
        borderStyle: "none",
      }),
      secondary: sprinkles({
        backgroundColor: {
          default: "buttonDefaultSecondary",
          hover: "buttonDefaultSecondaryHovered",
          focusVisible: "buttonDefaultSecondaryFocused",
          active: "buttonDefaultSecondaryPressed",
          disabled: "buttonDefaultDisabled",
        },
        color: {
          default: "buttonDefaultSecondary",
          disabled: "defaultDisabled",
        },
        boxShadow: {
          default: "defaultFocused",
          hover: "defaultHovered",
          focusVisible: "defaultFocused",
          active: "none",
          disabled: "none",
        },
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: {
          default: "default1",
          hover: "default1Hovered",
          focusVisible: "default1Focused",
          active: "default2",
          disabled: "defaultDisabled",
        },
      }),
      tertiary: sprinkles({
        backgroundColor: {
          default: "buttonDefaultTertiary",
          hover: "buttonDefaultTertiaryHovered",
          focusVisible: "buttonDefaultTertiaryFocused",
          active: "buttonDefaultTertiaryPressed",
          disabled: "buttonDefaultDisabled",
        },
        color: {
          default: "default1",
          disabled: "defaultDisabled",
        },
        borderStyle: "none",
      }),
      error: sprinkles({
        backgroundColor: {
          default: "buttonCriticalPrimary",
          hover: "buttonCriticalPrimaryHovered",
          focusVisible: "buttonCriticalPrimaryFocused",
          active: "buttonCriticalPrimaryPressed",
          disabled: "buttonCriticalDisabled",
        },
        color: {
          default: "buttonCriticalPrimary",
          disabled: "buttonCriticalDisabled",
        },
        borderStyle: "none",
      }),
    },
    size: {
      small: {},
      medium: {},
      large: {},
    },
    fixedWidth: {
      true: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        size: "small",
        fixedWidth: true,
      },
      style: sprinkles({
        height: 6,
        width: 6,
        borderRadius: 2,
        padding: 0.5,
        fontSize: 1,
        lineHeight: 1,
        letterSpacing: 1,
        gap: 1,
      }),
    },
    {
      variants: {
        size: "medium",
        fixedWidth: true,
      },
      style: sprinkles({
        height: 8,
        width: 8,
        borderRadius: 3,
        padding: 1,
        fontSize: 2,
        lineHeight: 2,
        letterSpacing: 2,
        gap: 1,
      }),
    },
    {
      variants: {
        size: "large",
        fixedWidth: true,
      },
      style: sprinkles({
        height: 10,
        width: 10,
        borderRadius: 3,
        padding: 2,
        fontSize: 3,
        lineHeight: 3,
        letterSpacing: 3,
        gap: 2,
      }),
    },
    {
      variants: {
        size: "small",
        fixedWidth: false,
      },
      style: sprinkles({
        height: 6,
        borderRadius: 2,
        paddingX: 2,
        paddingY: 0,
        fontSize: 1,
        lineHeight: 1,
        letterSpacing: 1,
        gap: 1,
      }),
    },
    {
      variants: {
        size: "medium",
        fixedWidth: false,
      },
      style: sprinkles({
        height: 8,
        borderRadius: 3,
        paddingX: 3,
        paddingY: 1,
        fontSize: 2,
        lineHeight: 2,
        letterSpacing: 2,
        gap: 1,
      }),
    },
    {
      variants: {
        size: "large",
        fixedWidth: false,
      },
      style: sprinkles({
        height: 10,
        borderRadius: 3,
        paddingX: 4,
        paddingY: 2,
        fontSize: 3,
        lineHeight: 2,
        letterSpacing: 2,
        gap: 2,
      }),
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
