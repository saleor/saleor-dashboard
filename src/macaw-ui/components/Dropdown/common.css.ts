import { keyframes, style } from "@vanilla-extract/css";

const changeOpacity = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const content = style({
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "opacity",
  selectors: {
    "&[data-side='top']": {
      animationName: changeOpacity,
    },
    "&[data-side='bottom']": {
      animationName: changeOpacity,
    },
    "&[data-side='right']": {
      animationName: changeOpacity,
    },
    "&[data-side='left']": {
      animationName: changeOpacity,
    },
  },
});

export const focusVisible = style({
  selectors: {
    "&:focus-visible": {
      outline: "none",
    },
  },
});
