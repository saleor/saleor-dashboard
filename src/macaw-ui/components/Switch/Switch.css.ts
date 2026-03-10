import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { sprinkles, vars } from "~/theme";

const {
  colors: { background, text },
  boxShadow: { defaultFocused },
} = vars;

export const switchParent = recipe({
  base: [
    sprinkles({
      display: "flex",
      gap: 0.5,
      backgroundColor: "default3",
      borderRadius: 3,
      borderColor: "default1",
      height: 8,
      padding: 0.5,
    }),
  ],
  defaultVariants: {},
});

export const switchChild = recipe({
  base: [
    sprinkles({
      height: "100%",
      padding: 1,
      borderRadius: 2,
      cursor: "pointer",
    }),
    {
      selectors: {
        "&[data-state='checked']": {
          backgroundColor: background.default1,
          borderStyle: "none",
          boxShadow: defaultFocused,
          color: text.default1,
        },
        "&[data-state='unchecked']:hover": {
          backgroundColor: background.default1Hovered,
        },
        "&[data-state='unchecked']:active": {
          backgroundColor: background.default1Pressed,
        },
        "&[data-state='unchecked']:focus-visible": {
          backgroundColor: background.default1Focused,
        },
        "&[data-state='unchecked']": {
          backgroundColor: background.default3,
          borderStyle: "none",
          color: text.default1,
        },
        "&[disabled]": {
          color: text.defaultDisabled,
          cursor: "not-allowed",
        },
      },
    },
  ],
});

export type SwitchVariants = RecipeVariants<typeof switchParent>;
