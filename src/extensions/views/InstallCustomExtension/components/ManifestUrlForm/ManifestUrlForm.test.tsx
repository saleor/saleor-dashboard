import { fireEvent, logRoles, render, screen } from "@testing-library/react";
import React from "react";
import { type Control } from "react-hook-form";

import { ExtensionInstallFormData } from "../../types";
import { ManifestUrlForm } from "./ManifestUrlForm";

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <span>{defaultMessage}</span>
  ),
  useIntl: () => ({
    formatMessage: () => "Required field",
  }),
  defineMessages: (msg: unknown) => msg,
}));

// Mock HookFormInput - we are testing without useForm from hook-form
jest.mock("@dashboard/components/HookFormInput", () => ({
  HookFormInput: ({
    "aria-labelledby": ariaLabelledby,
    placeholder,
    onPaste,
  }: {
    "aria-labelledby": string;
    placeholder: string;
    onPaste: () => void;
  }) => <input aria-labelledby={ariaLabelledby} placeholder={placeholder} onPaste={onPaste} />,
}));

describe("ManifestUrlForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnPaste = jest.fn();
  const mockControl = {} as Control<ExtensionInstallFormData>;

  it("renders form with correct structure and accessibility attributes", () => {
    // Arrange
    const { container } = render(
      <ManifestUrlForm onSubmit={mockOnSubmit} control={mockControl} onPaste={mockOnPaste} />,
    );

    // Debug accessibility tree
    logRoles(container);

    // Assert
    const form = container.querySelector("form");

    expect(form).toBeInTheDocument();

    const labelContainer = container.querySelector("[data-macaw-ui-component='Text']");

    expect(labelContainer).toBeInTheDocument();
    expect(labelContainer).toHaveAttribute("id", "manifest-input-label");

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-labelledby", "manifest-input-label");
    expect(input).toHaveAttribute("placeholder", "https://example.com/api/manifest");
  });

  it("calls onSubmit when form is submitted", () => {
    // Arrange
    const { container } = render(
      <ManifestUrlForm onSubmit={mockOnSubmit} control={mockControl} onPaste={mockOnPaste} />,
    );

    // Act
    const form = container.querySelector("form");

    fireEvent.submit(form!);

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onPaste when input receives paste event", () => {
    // Arrange
    render(<ManifestUrlForm onSubmit={mockOnSubmit} control={mockControl} onPaste={mockOnPaste} />);

    // Act
    const input = screen.getByRole("textbox");

    fireEvent.paste(input);

    // Assert
    expect(mockOnPaste).toHaveBeenCalledTimes(1);
  });
});
