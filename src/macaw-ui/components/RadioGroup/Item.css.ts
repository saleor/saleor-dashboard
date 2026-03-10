import { recipe } from "@vanilla-extract/recipes";
import { sprinkles, vars } from "~/theme";

export const indicator = recipe({
  base: [
    sprinkles({
      position: "absolute",
      display: "block",
      zIndex: "1",
      inset: 0.5,
    }),
  ],
  variants: {
    disabled: {
      true: sprinkles({ color: "defaultDisabled" }),
      false: sprinkles({ color: "buttonDefaultPrimary" }),
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const {
  colors: { background },
} = vars;

export const item = recipe({
  base: [
    sprinkles({
      position: "relative",
      boxShadow: "defaultFocused",
      borderColor: "default1",
      cursor: "pointer",
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: "100%",
      width: 3,
      height: 3,
      padding: 0,
      backgroundColor: "default1",
      flexShrink: "0",
    }),
    {
      selectors: {
        "&:after": {
          content: "",
          width: vars.spacing[5],
          height: vars.spacing[5],
          display: "block",
          borderRadius: "50%",
          position: "absolute",
          inset: "-5px",
        },
        "&:hover": {
          backgroundColor: background.default1Hovered,
        },
        "&:active": {
          backgroundColor: background.default1Pressed,
        },
        "&[data-disabled]": {
          cursor: "not-allowed",
        },
        "&[data-state='checked'][data-disabled]": {
          backgroundColor: background.defaultDisabled,
        },
        "&:active:after": {
          backgroundColor: background.default1Pressed,
        },
        "&:hover:after": {
          backgroundColor: background.default1Hovered,
        },
        "&:focus-visible": {
          backgroundColor: background.default1Focused,
        },
        "&:focus-visible:after": {
          backgroundColor: background.default1Focused,
        },
        "&[data-state='checked']": {
          backgroundColor: background.accent1,
          borderColor: "transparent",
        },
        "&[data-state='checked']:hover": {
          backgroundColor: background.accent1,
        },
        "&[data-state='checked']:hover:after": {
          backgroundColor: background.accent1Hovered,
        },
        "&[data-state='checked']:focus-visible": {
          backgroundColor: background.accent1Pressed,
        },
        "&[data-state='checked']:focus-visible:after": {
          backgroundColor: background.accent1Pressed,
        },
      },
    },
  ],

  variants: {
    error: {
      true: {
        selectors: {
          "&:hover": {
            backgroundColor: background.critical1,
          },
          "&:active": {
            backgroundColor: background.critical1,
          },
          "&[data-state='checked'][data-disabled]": {
            backgroundColor: background.defaultDisabled,
          },
          "&:active:after": {
            backgroundColor: background.critical1,
          },
          "&:hover:after": {
            backgroundColor: background.critical1,
          },
          "&:focus-visible": {
            backgroundColor: background.critical1,
          },
          "&:focus-visible:after": {
            backgroundColor: background.critical1,
          },
          "&[data-state='checked']": {
            backgroundColor: background.critical1,
            borderColor: vars.colors.border.critical1,
          },
          "&[data-state='checked']:hover": {
            backgroundColor: background.critical1,
          },
          "&[data-state='checked']:hover:after": {
            backgroundColor: background.critical1,
          },
          "&[data-state='checked']:focus-visible": {
            backgroundColor: background.critical1,
          },
          "&[data-state='checked']:focus-visible:after": {
            backgroundColor: background.critical1,
          },
        },
      },
    },
    disabled: {
      true: {
        selectors: {
          "&:hover": {
            backgroundColor: background.defaultDisabled,
          },
          "&:active": {
            backgroundColor: background.defaultDisabled,
          },
          "&:active:after": {
            backgroundColor: background.defaultDisabled,
          },
          "&[data-state='checked']:hover": {
            backgroundColor: background.defaultDisabled,
          },
          "&[data-state='checked']:hover:after": {
            backgroundColor: background.defaultDisabled,
          },
        },
      },
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
  },
});
