import { globalStyle } from "@vanilla-extract/css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("html, body", {
  height: "100%",
});

globalStyle("input, button, textarea, select", {
  fontFamily: "inherit",
});

globalStyle("img, picture, video, canvas", {
  display: "block",
  maxWidth: "100%",
});

globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
});

globalStyle("#macaw-ui-root", {
  isolation: "isolate",
});

globalStyle("ul, ol", {
  listStyle: "none",
  padding: 0,
});

globalStyle("a", {
  textDecoration: "none",
  color: "inherit",
});
