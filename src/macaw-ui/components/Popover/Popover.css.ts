import { style } from "@vanilla-extract/css";
import { sprinkles } from "~/theme";

export const popover = sprinkles({
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "default1",
  borderRadius: 3,
  boxShadow: "defaultHovered",
  backgroundColor: "default2",
});

export const arrow = style({
  transform: "translateY(-1px)",
});
