import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { IntlProvider } from "react-intl";

import { ExtensionPreferenceStateControl } from "./ExtensionPreferenceStateControl";

const renderControl = (
  props: Partial<ComponentProps<typeof ExtensionPreferenceStateControl>> = {},
): ReturnType<typeof render> =>
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
  it("hides when visibility is turned off", () => {
    // Arrange
    const onChange = jest.fn();

    renderControl({ onChange, value: "pinned" });

    // Act
    fireEvent.click(screen.getByTestId("extension-widget-visible"));

    // Assert
    expect(onChange).toHaveBeenCalledWith("hidden");
  });

  it("restores a hidden widget to default", () => {
    // Arrange
    const onChange = jest.fn();

    renderControl({ onChange, value: "hidden" });

    // Act
    fireEvent.click(screen.getByTestId("extension-widget-visible"));

    // Assert
    expect(onChange).toHaveBeenCalledWith("default");
    expect(screen.queryByTestId("extension-pin")).not.toBeInTheDocument();
  });

  it("labels the current state", () => {
    // Arrange
    renderControl({ value: "pinned" });

    // Assert
    expect(screen.getByRole("button", { name: "Pinned" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Visible" })).toBeInTheDocument();
  });

  it("pins and unpins when shown", () => {
    // Arrange
    const onChange = jest.fn();

    renderControl({ onChange, value: "default" });

    // Act
    fireEvent.click(screen.getByTestId("extension-pin"));

    // Assert
    expect(onChange).toHaveBeenCalledWith("pinned");
  });
});
