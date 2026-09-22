import { type KeyboardEvent } from "react";

import { isVariantReferenceMenuOpen } from "./useVariantReferenceCombobox";

const createEvent = (target: Element): KeyboardEvent => ({ target }) as unknown as KeyboardEvent;

describe("isVariantReferenceMenuOpen", () => {
  it("is true only when the combobox is expanded", () => {
    // Arrange
    const open = document.createElement("input");

    open.setAttribute("role", "combobox");
    open.setAttribute("aria-expanded", "true");

    const closed = document.createElement("input");

    closed.setAttribute("role", "combobox");
    closed.setAttribute("aria-expanded", "false");

    // Act & Assert
    expect(isVariantReferenceMenuOpen(createEvent(open))).toBe(true);
    expect(isVariantReferenceMenuOpen(createEvent(closed))).toBe(false);
  });
});
