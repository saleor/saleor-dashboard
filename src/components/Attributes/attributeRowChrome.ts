import { createContext, useContext } from "react";

import { type AttributeRowChrome } from "./types";

/**
 * Set by `Attributes` so every row type (basic, dropdown, swatch, reference) picks up the
 * card layout without each of them taking a prop.
 */
export const AttributeRowChromeContext = createContext<AttributeRowChrome>("legacy");

export const useAttributeRowChrome = (): AttributeRowChrome =>
  useContext(AttributeRowChromeContext);
