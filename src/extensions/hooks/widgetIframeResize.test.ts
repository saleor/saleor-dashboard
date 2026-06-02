import {
  applyWidgetHeightToFrame,
  clampWidgetHeight,
  isPositiveFiniteWidgetHeight,
} from "./widgetIframeResize";

describe("widgetIframeResize", () => {
  describe("isPositiveFiniteWidgetHeight", () => {
    it.each([
      { height: 1, expected: true },
      { height: 0, expected: false },
      { height: -10, expected: false },
      { height: Number.NaN, expected: false },
      { height: Number.POSITIVE_INFINITY, expected: false },
    ])("returns $expected for height $height", ({ height, expected }) => {
      expect(isPositiveFiniteWidgetHeight(height)).toBe(expected);
    });
  });

  describe("clampWidgetHeight", () => {
    it("rounds up and caps at WIDGET_MAX_HEIGHT", () => {
      expect(clampWidgetHeight(321.4)).toBe(322);
      expect(clampWidgetHeight(10_000_000)).toBe(5000);
    });
  });

  describe("applyWidgetHeightToFrame", () => {
    let iframe: HTMLIFrameElement;

    beforeEach(() => {
      iframe = document.createElement("iframe");
    });

    it("sets clamped height for valid values", () => {
      applyWidgetHeightToFrame(iframe, 321.4);

      expect(iframe.style.height).toBe("322px");
    });

    it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])(
      "does not change the iframe for invalid height %s",
      height => {
        iframe.style.height = "200px";

        applyWidgetHeightToFrame(iframe, height);

        expect(iframe.style.height).toBe("200px");
      },
    );
  });
});
