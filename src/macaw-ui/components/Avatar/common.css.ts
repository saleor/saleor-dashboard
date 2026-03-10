import { sprinkles } from "~/theme";

export const base = sprinkles({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderColor: "default1",
});

export const sizeVariants = {
  small: sprinkles({ width: 6, height: 6 }),
  medium: sprinkles({ width: 8, height: 8 }),
  large: sprinkles({ width: 9, height: 9 }),
};
