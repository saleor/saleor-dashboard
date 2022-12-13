import { ThemeProvider } from "@saleor/macaw-ui";
import { render as rtlRender } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";

import { Locale } from "../Locale";
import ExitFormDialog from "./ExitFormDialog";

function render(ui, { locale = Locale.EN, ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <ThemeProvider>
        <IntlProvider locale={locale}>{children}</IntlProvider>
      </ThemeProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe("ExitFormDialog", () => {
  it("closes when ignore changes is clicked", () => {
    // Given
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };
    // When
    const { getByTestId } = render(<ExitFormDialog {...props} />);
    const button = getByTestId("ignore-changes");
    button.click();
    // Then
    expect(props.onLeave).toHaveBeenCalled();
  });
  it("closes when keep editing is clicked", () => {
    // Given
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };
    // When
    const { getByTestId } = render(<ExitFormDialog {...props} />);
    const button = getByTestId("keep-editing");
    button.click();
    // Then
    expect(props.onClose).toHaveBeenCalled();
  });
});
