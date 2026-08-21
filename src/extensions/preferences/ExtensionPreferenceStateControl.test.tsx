import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { IntlProvider } from "react-intl";

import { ExtensionPreferenceStateControl } from "./ExtensionPreferenceStateControl";

const renderControl = (
  props: Partial<React.ComponentProps<typeof ExtensionPreferenceStateControl>> = {},
) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <ExtensionPreferenceStateControl
        value="default"
        disabled={false}
        onChange={jest.fn()}
        {...props}
      />
    </IntlProvider>,
  );

describe("ExtensionPreferenceStateControl", () => {
  it("calls onChange with the selected state", () => {
    // Arrange
    const onChange = jest.fn();

    renderControl({ onChange });

    // Act
    fireEvent.click(screen.getByTestId("extension-state-hidden"));

    // Assert
    expect(onChange).toHaveBeenCalledWith("hidden");
  });
});
