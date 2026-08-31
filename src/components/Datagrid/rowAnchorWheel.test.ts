import { getForwardedWheelDelta } from "./rowAnchorWheel";

describe("getForwardedWheelDelta", () => {
  const horizontallyScrollable: Parameters<typeof getForwardedWheelDelta>[0] = {
    scrollWidth: 800,
    clientWidth: 400,
    scrollHeight: 200,
    clientHeight: 200,
  };
  const verticallyScrollable: Parameters<typeof getForwardedWheelDelta>[0] = {
    scrollWidth: 400,
    clientWidth: 400,
    scrollHeight: 800,
    clientHeight: 200,
  };
  const bothScrollable: Parameters<typeof getForwardedWheelDelta>[0] = {
    scrollWidth: 800,
    clientWidth: 400,
    scrollHeight: 800,
    clientHeight: 200,
  };
  const noOverflow: Parameters<typeof getForwardedWheelDelta>[0] = {
    scrollWidth: 400,
    clientWidth: 400,
    scrollHeight: 200,
    clientHeight: 200,
  };

  it("forwards horizontal delta only when the grid overflows sideways", () => {
    // Arrange & Act
    const delta = getForwardedWheelDelta(horizontallyScrollable, { deltaX: 30, deltaY: 80 });

    // Assert
    expect(delta).toEqual({ left: 30, top: 0 });
  });

  it("forwards vertical delta only when the grid overflows downwards", () => {
    // Arrange & Act
    const delta = getForwardedWheelDelta(verticallyScrollable, { deltaX: 30, deltaY: 80 });

    // Assert
    expect(delta).toEqual({ left: 0, top: 80 });
  });

  it("forwards both axes when the grid can scroll in both directions", () => {
    // Arrange & Act
    const delta = getForwardedWheelDelta(bothScrollable, { deltaX: 12, deltaY: -40 });

    // Assert
    expect(delta).toEqual({ left: 12, top: -40 });
  });

  it("returns null so the page can take a wheel the grid cannot scroll", () => {
    // Arrange & Act
    const verticalOverList = getForwardedWheelDelta(horizontallyScrollable, {
      deltaX: 0,
      deltaY: 80,
    });
    const overNoOverflow = getForwardedWheelDelta(noOverflow, { deltaX: 10, deltaY: 20 });

    // Assert
    expect(verticalOverList).toBeNull();
    expect(overNoOverflow).toBeNull();
  });
});
