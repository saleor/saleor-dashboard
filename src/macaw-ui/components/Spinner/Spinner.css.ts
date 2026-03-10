import { keyframes, style } from "@vanilla-extract/css";

const spin = keyframes({
  "100%": {
    transform: "rotate(360deg)",
  },
});

export const spinner = style({
  animation: `${spin} 1s linear infinite`,
  transformOrigin: "center",
});
