import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { NAVIGATOR_SEARCH_LISTBOX_ID } from "./consts";
import NavigatorSearchInput from "./NavigatorSearchInput";

const renderInput = ({ isExpanded = true }: { isExpanded?: boolean } = {}) =>
  render(
    <IntlProvider defaultLocale="en" locale="en">
      <ThemeProvider>
        <NavigatorSearchInput onSearch={() => undefined} value="" isExpanded={isExpanded} />
      </ThemeProvider>
    </IntlProvider>,
  );

describe("NavigatorSearchInput", () => {
  it("exposes the field as a combobox that controls the results listbox", () => {
    // Arrange & Act
    renderInput();

    // Assert
    const combobox = screen.getByRole("combobox");

    expect(combobox).toHaveAttribute("aria-controls", NAVIGATOR_SEARCH_LISTBOX_ID);
    expect(combobox).toHaveAttribute("aria-autocomplete", "list");
    expect(combobox).toHaveAccessibleName("Search");
  });

  it("mirrors the popup state in aria-expanded", () => {
    // Arrange & Act
    const { unmount } = renderInput({ isExpanded: true });

    // Assert
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");

    // Act
    unmount();
    renderInput({ isExpanded: false });

    // Assert
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("announces no active option until keyboard navigation highlights one", () => {
    // Arrange & Act
    renderInput();

    // Assert
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-activedescendant");
  });
});
