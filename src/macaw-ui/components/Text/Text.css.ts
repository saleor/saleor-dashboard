import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

import { sprinkles } from "~/theme";

export const text = recipe({
  variants: {
    ellipsis: {
      multiline: sprinkles({ overflow: "hidden", textOverflow: "ellipsis" }),
      true: sprinkles({
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }),
      false: {},
    },
  },

  defaultVariants: {
    ellipsis: false,
  },
});

export type TextVariants = RecipeVariants<typeof text>;
