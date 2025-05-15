import { fireEvent, logRoles, render, screen } from "@testing-library/react";
import React from "react";
import { useForm } from "react-hook-form";

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
describe("ManifestUrlForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnPaste = jest.fn();

  // Helper component to use the useForm hook required by components in form
  const TestWrapper = ({ onSubmit, onPaste }: { onSubmit: () => void; onPaste: () => void }) => {
    const { control } = useForm<ExtensionInstallFormData>();

    return <ManifestUrlForm onSubmit={onSubmit} control={control} onPaste={onPaste} />;
  };

  it("renders form with correct structure and accessibility attributes", () => {
    // Arrange
    const { container } = render(<TestWrapper onSubmit={mockOnSubmit} onPaste={mockOnPaste} />);

    // Debug accessibility tree
    logRoles(container);

    // Assert
    const form = container.querySelector("form");

    expect(form).toBeInTheDocument();

    const labelContainer = container.querySelector("[data-macaw-ui-component='Text']");

    expect(labelContainer).toBeInTheDocument();
    expect(labelContainer).toHaveAttribute("id", "manifest-input-label");

    const input = screen.getByRole("input");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-labelledby", "manifest-input-label");
    expect(input).toHaveAttribute("placeholder", "https://example.com/api/manifest");
  });

  it("calls onSubmit when form is submitted", () => {
    // Arrange
    const { container } = render(<TestWrapper onSubmit={mockOnSubmit} onPaste={mockOnPaste} />);

    // Act
    const form = container.querySelector("form");

    fireEvent.submit(form!);

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onPaste when input receives paste event", () => {
    // Arrange
    render(<TestWrapper onSubmit={mockOnSubmit} onPaste={mockOnPaste} />);

    // Act
    const input = screen.getByRole("input");

    fireEvent.paste(input);

    // Assert
    expect(mockOnPaste).toHaveBeenCalledTimes(1);
  });
});
