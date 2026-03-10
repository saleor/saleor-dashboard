import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./contract.css";

globalStyle("body", {
  backgroundColor: vars.colors.background.default1,
});
