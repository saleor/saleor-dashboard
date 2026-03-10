import { keyframes, style } from "@vanilla-extract/css";

const changeOpacity = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const showContent = style({
  animationDuration: "150ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "opacity",
  animationName: changeOpacity,
});
