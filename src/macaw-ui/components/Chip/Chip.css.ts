import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { sprinkles } from "~/theme";

export const chip = recipe({
  base: [
    sprinkles({
      borderRadius: 2,
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      lineHeight: 1,
      borderWidth: 1,
      borderStyle: "solid",
    }),
  ],

  variants: {
    size: {
      small: sprinkles({
        paddingX: 1,
        height: 4,
      }),
      medium: sprinkles({
        paddingX: 1,
        height: 5,
      }),
      large: sprinkles({
        paddingX: 1.5,
        height: 6,
      }),
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type ChipVariants = RecipeVariants<typeof chip>;
