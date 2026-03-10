import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { sprinkles } from "~/theme";

export const fieldset = sprinkles({
  padding: 0,
  margin: 0,
  borderWidth: 0,
});

export const groupLabelRecipe = recipe({
  base: [
    sprinkles({
      padding: 0,
      margin: 0,
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
      true: sprinkles({
        color: "defaultDisabled",
      }),
    },
    error: {
      true: sprinkles({
        color: "critical2",
      }),
      false: sprinkles({
        color: "default2",
      }),
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
export type RadioGroupVariants = RecipeVariants<typeof groupLabelRecipe>;
