import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { InlineExtensionPreferenceControls } from "./InlineExtensionPreferenceControls";

const setState = jest.fn();
let currentState = "default";

jest.mock("./useExtensionPreferences", () => ({
  useExtensionPreferences: () => ({ getState: () => currentState, setState, isSaving: false }),
}));

const extension = { id: "e", identifier: "e", label: "Widget", app: { id: "a", identifier: "a" } };

const renderControls = () =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <InlineExtensionPreferenceControls extension={extension} />
    </IntlProvider>,
  );

describe("InlineExtensionPreferenceControls", () => {
  beforeEach(() => {
    setState.mockClear();
    currentState = "default";
  });

  it("pins when the pin button is clicked", () => {
    // Arrange
    renderControls();

    // Act
    fireEvent.click(screen.getByTestId("extension-pin"));

    // Assert
    expect(setState).toHaveBeenCalledWith(extension, "pinned");
  });

  it("unpins when already pinned", () => {
    // Arrange
    currentState = "pinned";
    renderControls();

    // Act
    fireEvent.click(screen.getByTestId("extension-pin"));

    // Assert
    expect(setState).toHaveBeenCalledWith(extension, "default");
  });

  it("hides when the hide button is clicked", () => {
    // Arrange
    renderControls();

    // Act
    fireEvent.click(screen.getByTestId("extension-hide"));

    // Assert
    expect(setState).toHaveBeenCalledWith(extension, "hidden");
  });
});
