import { type Ripple } from "@dashboard/ripples/types";

import { selectActiveCornerRipple } from "./selectActiveCornerRipple";

const makeRipple = (overrides: Partial<Ripple> & Pick<Ripple, "ID" | "dateAdded">): Ripple => ({
  type: "feature",
  TTL_seconds: 3600,
  content: {
    oneLiner: overrides.ID,
    contextual: "contextual",
    global: "global",
  },
  ...overrides,
});

describe("selectActiveCornerRipple", () => {
  it("returns undefined when nothing is eligible", () => {
    // Arrange
    const entries = [
      { model: makeRipple({ ID: "a", dateAdded: new Date(2026, 0, 1) }), Component: () => null },
    ];

    // Act
    const result = selectActiveCornerRipple(entries, () => false);

    // Assert
    expect(result).toBeUndefined();
  });

  it("returns the only eligible entry", () => {
    // Arrange
    const older = {
      model: makeRipple({ ID: "older", dateAdded: new Date(2026, 0, 1) }),
      Component: () => null,
    };
    const newer = {
      model: makeRipple({ ID: "newer", dateAdded: new Date(2026, 6, 1) }),
      Component: () => null,
    };

    // Act
    const result = selectActiveCornerRipple([older, newer], ripple => ripple.ID === "older");

    // Assert
    expect(result).toBe(older);
  });

  it("prefers the newest dateAdded among eligible entries", () => {
    // Arrange
    const older = {
      model: makeRipple({ ID: "older", dateAdded: new Date(2026, 0, 1) }),
      Component: () => null,
    };
    const newer = {
      model: makeRipple({ ID: "newer", dateAdded: new Date(2026, 6, 1) }),
      Component: () => null,
    };

    // Act
    const result = selectActiveCornerRipple([older, newer], () => true);

    // Assert
    expect(result).toBe(newer);
  });

  it("breaks ties by ID for stable selection", () => {
    // Arrange
    const sameDate = new Date(2026, 6, 1);
    const zebra = {
      model: makeRipple({ ID: "zebra", dateAdded: sameDate }),
      Component: () => null,
    };
    const alpha = {
      model: makeRipple({ ID: "alpha", dateAdded: sameDate }),
      Component: () => null,
    };

    // Act
    const result = selectActiveCornerRipple([zebra, alpha], () => true);

    // Assert
    expect(result).toBe(alpha);
  });
});
