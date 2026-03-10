import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { sprinkles } from "~/theme";

export const inputContainer = recipe({
  base: [
    sprinkles({
      position: "relative",
      display: "flex",
      alignItems: "center",
      color: "default1",
      width: "100%",
      borderRadius: 3,
      transition: "all",
      backgroundColor: {
        default: "default1",
        hover: "default1Hovered",
        focusWithin: "default1Focused",
      },
    }),
  ],
  variants: {
    size: {
      small: sprinkles({
        paddingY: 1.5,
        paddingX: 2,
      }),
      medium: sprinkles({
        paddingY: 2,
        paddingX: 2,
      }),
      large: sprinkles({
        paddingY: 3,
        paddingX: 3,
      }),
    },
  },
});

export const input = recipe({
  base: [
    sprinkles({
      width: "100%",
      backgroundColor: "transparent",
      borderWidth: 0,
      outlineStyle: "none",
      padding: 0,
      color: {
        default: "default1",
        disabled: "default2",
        placeholder: "default2",
      },
    }),
  ],
});

export const searchIcon = recipe({
  base: [
    sprinkles({
      color: "default2",
      marginRight: 2,
    }),
  ],
});

export type InputContainerVariants = RecipeVariants<typeof inputContainer>;
