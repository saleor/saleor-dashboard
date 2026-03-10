import { CSSProperties } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { sprinkles, vars } from "~/theme";

const outerGlow = (color: CSSProperties["backgroundColor"]) => {
  return `0 0 0 ${vars.spacing[1]} ${color?.toString()}`;
};

export const toggle = recipe({
  base: [
    sprinkles({
      borderRadius: 9,
      borderWidth: 1,
      display: "flex",
      alignItems: "center",
      position: "relative",
      padding: "px",
      outlineStyle: "none",
      cursor: "pointer",
    }),
    {
      selectors: {
        // Inner dot
        "&::before": {
          content: "",
          width: vars.spacing[2],
          height: vars.spacing[2],
          // Token mismatch
          backgroundColor: vars.colors.text.buttonDefaultPrimary,
          borderRadius: 4,
          transition: "all 40ms ease-in-out",
        },
        "&[disabled]::before": {
          backgroundColor: vars.colors.background.default3,
          boxShadow: "none",
        },

        // Ghost element for positioning
        "&::after": {
          content: "",
          visibility: "hidden",
          width: vars.spacing[2],
          height: vars.spacing[2],
          transition: "all 40ms ease-in-out",
        },
        // Transition from dot to pill on press
        "&:not([disabled]):active::before": {
          width: vars.spacing[4],
        },
        "&:not([disabled]):active::after": {
          width: vars.spacing[0],
        },

        // Styling for off state
        '&[data-state="off"]': {
          justifyContent: "flex-start",
          borderColor: "transparent",
          backgroundColor: vars.colors.background.default3,
        },
        '&[data-state="off"]:hover': {
          boxShadow: outerGlow(vars.colors.background.default1Hovered),
        },
        '&[data-state="off"]:active': {
          boxShadow: outerGlow(vars.colors.background.default1Pressed),
        },
        '&[data-state="off"]:focus-visible': {
          boxShadow: outerGlow(vars.colors.background.default1Focused),
        },
        '&[data-state="off"][disabled]': {
          backgroundColor: vars.colors.background.defaultDisabled,
          cursor: "not-allowed",
          boxShadow: "none",
        },

        // Styling for on state
        '&[data-state="on"]': {
          flexDirection: "row-reverse",
          backgroundColor: vars.colors.background.accent1,
          borderColor: "transparent",
        },
        '&[data-state="on"]:hover': {
          boxShadow: outerGlow(vars.colors.background.accent1Hovered),
        },
        '&[data-state="on"]:active': {
          boxShadow: outerGlow(vars.colors.background.accent1Pressed),
        },
        '&[data-state="on"]:focus-visible': {
          boxShadow: outerGlow(vars.colors.background.accent1Pressed),
        },
        '&[data-state="on"][disabled]': {
          backgroundColor: vars.colors.background.defaultDisabled,
          cursor: "not-allowed",
          boxShadow: "none",
        },
      },
    },
  ],
});
