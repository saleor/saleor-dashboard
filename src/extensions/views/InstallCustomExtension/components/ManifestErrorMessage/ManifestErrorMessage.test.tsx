import { render, screen } from "@testing-library/react";
import { FieldError } from "react-hook-form";
import { IntlProvider } from "react-intl";

import { AppErrorCode } from "../../../../../graphql/types.generated";
import {
  MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT,
  MANIFEST_URL_CLIENT_VALIDATION_REQUIRED,
} from "../../schema";
import { ManifestErrorMessage } from "./ManifestErrorMessage";

describe("ManifestErrorMessage", () => {
  const renderWithError = (error: FieldError | null) =>
    render(
      <IntlProvider
        messages={{}}
        locale="en"
        onError={() => {
          /* Suppress missing translation errors in console during test if any fallbacks occur */
        }}
      >
        <ManifestErrorMessage error={error} />
      </IntlProvider>,
    );

  it("renders nothing when error is null", () => {
    // Arrange
    const { container } = renderWithError(null);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders required field client validation error", () => {
    // Arrange
    const error: FieldError = {
      type: "client",
      message: MANIFEST_URL_CLIENT_VALIDATION_REQUIRED,
    };

    renderWithError(error);
    // Assert
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders invalid URL format client validation error", () => {
    // Arrange
    const error: FieldError = {
      type: "client",
      message: MANIFEST_URL_CLIENT_VALIDATION_INVALID_FORMAT,
    };

    renderWithError(error);
    // Assert
    expect(screen.getByText("Invalid manifest URL")).toBeInTheDocument();
  });

  it("renders backend error with specific documentation link", () => {
    // Arrange
    const error: FieldError = {
      type: AppErrorCode.INVALID_MANIFEST_FORMAT, // Uses ID "FuIgAe"
      message: "",
    };

    renderWithError(error);
    // Assert
    // Check the error message text with placeholder
    expect(screen.getByText(/The extension's manifest has an invalid format/)).toBeInTheDocument();
    expect(screen.getByText(/{docsLink}/)).toBeInTheDocument();
    expect(screen.getByText(/{errorCode}/)).toBeInTheDocument();
  });

  it("renders backend error without specific documentation link", () => {
    // Arrange
    const error: FieldError = {
      type: AppErrorCode.FORBIDDEN,
      message: "",
    };

    renderWithError(error);
    // Assert
    expect(screen.getByText(/You are not allowed to perform this action/)).toBeInTheDocument();
    expect(screen.getByText(/{errorCode}/)).toBeInTheDocument();
  });

  it("renders generic fallback error message for unknown client error string", () => {
    // Arrange
    const error: FieldError = {
      type: "client",
      message: "An unexpected error occurred.",
    };

    renderWithError(error);

    // Assert
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    expect(screen.getByText(/{errorCode}/)).toBeInTheDocument();
  });

  it("renders generic 'Unknown error' message for unknown error object", () => {
    // Arrange
    const error: FieldError = {
      type: "unknown",
      message: "An unexpected error occurred.",
    };

    renderWithError(error);
    // Assert
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    expect(screen.getByText(/{errorCode}/)).toBeInTheDocument();
  });

  it("sets aria-live='polite' on the root Box when error is displayed", () => {
    // Arrange
    const error: FieldError = {
      type: "client",
      message: MANIFEST_URL_CLIENT_VALIDATION_REQUIRED,
    };
    const { container } = renderWithError(error);
    const box = container.querySelector("[aria-live='polite']");

    // Assert
    expect(box).toBeInTheDocument();
  });
});
