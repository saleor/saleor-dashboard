import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "~/theme";

export const variants = {
  size: {
    small: {
      width: vars.spacing[4],
      height: vars.spacing[4],
    },
    medium: {
      width: vars.spacing[5],
      height: vars.spacing[5],
    },
    large: {
      width: vars.spacing[6],
      height: vars.spacing[6],
    },
    fill: {},
  },
} as const;

export const svgWrapper = recipe({
  variants,
  defaultVariants: {
    size: "medium",
  },
});

export type SVGWrapperVariants = RecipeVariants<typeof svgWrapper>;
