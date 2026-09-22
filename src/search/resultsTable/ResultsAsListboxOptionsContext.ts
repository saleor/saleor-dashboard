import { createContext, useContext } from "react";

/**
 * True when the results table is rendered inside the Navigator's combobox popup.
 *
 * There the rows are the listbox options themselves — keyboard navigation moves
 * `aria-selected` onto them and the combobox's `aria-activedescendant` points at
 * them — so the table wrappers step out of the accessibility tree
 * (`role="presentation"`) and each row takes `role="option"`. Everywhere else the
 * results stay a plain table.
 */
export const ResultsAsListboxOptionsContext = createContext(false);

export const useResultsAsListboxOptions = (): boolean => useContext(ResultsAsListboxOptionsContext);
