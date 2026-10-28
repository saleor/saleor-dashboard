import { getDrawerOffset, getSwipeAxis, shouldDismissDrawer } from "./drawerSwipe";

describe("getSwipeAxis", () => {
  it("waits until the touch moved far enough", () => {
    // Arrange
    const movement = { dx: -4, dy: 3 };

    // Act
    const axis = getSwipeAxis(movement);

    // Assert
    expect(axis).toBeNull();
  });

  it.each([
    { movement: { dx: -12, dy: 4 }, expected: "horizontal" },
    { movement: { dx: 4, dy: 12 }, expected: "vertical" },
    { movement: { dx: -8, dy: -8 }, expected: "vertical" },
  ])("locks to the dominant direction of $movement", ({ movement, expected }) => {
    // Arrange & Act
    const axis = getSwipeAxis(movement);

    // Assert
    expect(axis).toBe(expected);
  });
});

describe("getDrawerOffset", () => {
  it.each([
    { dx: -40, expected: -40 },
    { dx: 40, expected: 0 },
  ])("follows only leftward movement ($dx)", ({ dx, expected }) => {
    // Arrange & Act
    const offset = getDrawerOffset(dx);

    // Assert
    expect(offset).toBe(expected);
  });
});

describe("shouldDismissDrawer", () => {
  it.each([
    { release: { offset: -110, width: 300, velocity: 0 }, expected: true },
    { release: { offset: -90, width: 300, velocity: -0.1 }, expected: false },
    { release: { offset: -30, width: 300, velocity: -0.6 }, expected: true },
    { release: { offset: -10, width: 300, velocity: -2 }, expected: false },
    { release: { offset: -200, width: 300, velocity: 0.5 }, expected: false },
    { release: { offset: 0, width: 0, velocity: 0 }, expected: false },
  ])("returns $expected for $release", ({ release, expected }) => {
    // Arrange & Act
    const dismiss = shouldDismissDrawer(release);

    // Assert
    expect(dismiss).toBe(expected);
  });
});
