import { keyframes, style } from "@vanilla-extract/css";

export const trigger = style({});

export const icon = style({
  transition: "transform 300ms",
  selectors: {
    [`${trigger}[data-state="open"] &`]: {
      transform: "rotate(180deg)",
    },
  },
});

const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    height: "var(--radix-accordion-content-height)",
  },
});

const slideUp = keyframes({
  from: {
    height: "var(--radix-accordion-content-height)",
  },
  to: {
    height: 0,
  },
});

export const content = style({
  overflow: "hidden",
  selectors: {
    '&[data-state="open"]': {
      animation: `${slideDown} 300ms ease-out`,
      overflow: "visible",
    },
    '&[data-state="closed"]': {
      animation: `${slideUp} 300ms ease-out`,
    },
  },
});
