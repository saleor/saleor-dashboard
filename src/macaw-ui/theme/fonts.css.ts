import { globalFontFace, globalStyle } from "@vanilla-extract/css";

// adapted from https://rsms.me/inter/inter.css

globalFontFace("Inter", {
  src: 'url("./Inter-Thin.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "100",
});

globalFontFace("Inter", {
  src: 'url("./Inter-ThinItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "100",
});

globalFontFace("Inter", {
  src: 'url("./Inter-ExtraLight.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "200",
});

globalFontFace("Inter", {
  src: 'url("./Inter-ExtraLightItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "200",
});

globalFontFace("Inter", {
  src: 'url("./Inter-Light.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "300",
});

globalFontFace("Inter", {
  src: 'url("./Inter-LightItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "300",
});

globalFontFace("Inter", {
  src: 'url("./Inter-Regular.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
});

globalFontFace("Inter", {
  src: 'url("./Inter-Italic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "400",
});

globalFontFace("Inter", {
  src: 'url("./Inter-Medium.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "500",
});

globalFontFace("Inter", {
  src: 'url("./Inter-MediumItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "500",
});

globalFontFace("Inter", {
  src: 'url("./Inter-SemiBold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "600",
});

globalFontFace("Inter", {
  src: 'url("./Inter-SemiBoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "600",
});

globalFontFace("Inter", {
  src: 'url("./Inter-Bold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "700",
});

globalFontFace("Inter", {
  src: 'url("./Inter-BoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "700",
});

globalFontFace("Inter", {
  src: 'url("./Inter-ExtraBold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "800",
});

globalFontFace("Inter", {
  src: 'url("./Inter-ExtraBoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "800",
});

globalFontFace("Inter", {
  src: 'url("./Inter-Black.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "900",
});

globalFontFace("Inter", {
  src: 'url("./Inter-BlackItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "900",
});

globalFontFace("Inter var", {
  src: 'url("./Inter-roman.var.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "100 900",
});

globalFontFace("Inter var", {
  src: 'url("./Inter-italic.var.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "100 900",
});

globalStyle("html", {
  fontFamily: "Inter, sans-serif",
  "@supports": {
    "(font-variation-settings: normal)": {
      fontFamily: "'Inter var', sans-serif",
    },
  },
});

globalFontFace("Geist", {
  src: 'url("./Geist-Thin.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "100",
});

globalFontFace("Geist", {
  src: 'url("./Geist-ThinItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "100",
});

globalFontFace("Geist", {
  src: 'url("./Geist-ExtraLight.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "200",
});

globalFontFace("Geist", {
  src: 'url("./Geist-ExtraLightItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "200",
});

globalFontFace("Geist", {
  src: 'url("./Geist-Light.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "300",
});

globalFontFace("Geist", {
  src: 'url("./Geist-LightItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "300",
});

globalFontFace("Geist", {
  src: 'url("./Geist-Regular.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
});

globalFontFace("Geist", {
  src: 'url("./Geist-RegularItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "400",
});

globalFontFace("Geist", {
  src: 'url("./Geist-Medium.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "500",
});

globalFontFace("Geist", {
  src: 'url("./Geist-MediumItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "500",
});

globalFontFace("Geist", {
  src: 'url("./Geist-SemiBold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "600",
});

globalFontFace("Geist", {
  src: 'url("./Geist-SemiBoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "600",
});

globalFontFace("Geist", {
  src: 'url("./Geist-Bold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "700",
});

globalFontFace("Geist", {
  src: 'url("./Geist-BoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "700",
});

globalFontFace("Geist", {
  src: 'url("./Geist-ExtraBold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "800",
});

globalFontFace("Geist", {
  src: 'url("./Geist-ExtraBoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "800",
});

globalFontFace("Geist", {
  src: 'url("./Geist-Black.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "900",
});

globalFontFace("Geist", {
  src: 'url("./Geist-BlackItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "900",
});

globalFontFace("Geist var", {
  src: 'url("./Geist[wght].woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "100 900",
});

globalFontFace("Geist var", {
  src: 'url("./Geist-Italic[wght].woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "100 900",
});

globalFontFace("Geist Mono", {
  src: 'url("./GeistMono-Regular.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
});

globalFontFace("Geist Mono", {
  src: 'url("./GeistMono-Italic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "400",
});

globalFontFace("Geist Mono", {
  src: 'url("./GeistMono-Medium.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "500",
});

globalFontFace("Geist Mono", {
  src: 'url("./GeistMono-MediumItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "500",
});

globalFontFace("Geist Mono", {
  src: 'url("./GeistMono-Bold.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "700",
});

globalFontFace("Geist Mono", {
  src: 'url("./GeistMono-BoldItalic.woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "700",
});

globalFontFace("Geist Mono var", {
  src: 'url("./GeistMono[wght].woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "100 900",
});

globalFontFace("Geist Mono var", {
  src: 'url("./GeistMono-Italic[wght].woff2") format("woff2")',
  fontDisplay: "swap",
  fontStyle: "italic",
  fontWeight: "100 900",
});
