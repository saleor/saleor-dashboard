import { setWidgetShown, toggleWidgetPinned } from "./widgetPreferenceState";

describe("setWidgetShown", () => {
  it("hides a visible widget", () => {
    expect(setWidgetShown("default", false)).toBe("hidden");
    expect(setWidgetShown("pinned", false)).toBe("hidden");
  });

  it("restores a hidden widget to default, not pinned", () => {
    expect(setWidgetShown("hidden", true)).toBe("default");
  });

  it("leaves an already-shown widget unchanged", () => {
    expect(setWidgetShown("default", true)).toBe("default");
    expect(setWidgetShown("pinned", true)).toBe("pinned");
  });
});

describe("toggleWidgetPinned", () => {
  it("pins a default widget and unpins a pinned one", () => {
    expect(toggleWidgetPinned("default")).toBe("pinned");
    expect(toggleWidgetPinned("pinned")).toBe("default");
  });

  it("does not pin a hidden widget", () => {
    expect(toggleWidgetPinned("hidden")).toBe("hidden");
  });
});
