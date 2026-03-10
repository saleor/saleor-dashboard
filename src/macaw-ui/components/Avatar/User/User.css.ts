import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

import { sprinkles } from "~/theme";

import { base, sizeVariants } from "../common.css";

export const userAvatar = recipe({
  base: [
    base,
    sprinkles({
      borderRadius: "50%",
    }),
  ],

  variants: {
    size: sizeVariants,
    scheme: {
      accent1: sprinkles({
        backgroundColor: "accent1",
        color: "buttonDefaultPrimary",
      }),
      transparent: sprinkles({
        backgroundColor: "transparent",
        color: "default1",
      }),
    },
    type: {
      image: {},
      initials: {},
    },
  },

  compoundVariants: [
    {
      variants: {
        type: "initials",
        scheme: "transparent",
      },
      style: sprinkles({
        borderColor: "default1",
        borderStyle: "solid",
      }),
    },
  ],

  defaultVariants: {
    size: "medium",
    scheme: "accent1",
    type: "initials",
  },
});

export type UserAvatarVariants = RecipeVariants<typeof userAvatar>;
