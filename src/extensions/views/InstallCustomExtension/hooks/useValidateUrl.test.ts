import { renderHook } from "@testing-library/react-hooks";

import { useValidateUrl } from "./useValidateUrl";

jest.mock("react-intl", () => {
  const reactIntl = jest.requireActual("react-intl");

  return {
    ...reactIntl,
    useIntl: () => ({
      formatMessage: jest.fn(({ defaultMessage }: { defaultMessage: string }) => defaultMessage),
    }),
  };
});

describe("useValidateUrl", () => {
  it("should return true for valid URLs", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());
    const validate = result.current;

    // Act
    const isValid = validate("http://example.com");

    // Assert
    expect(isValid).toBe(true);
  });

  it("should return error message for invalid URLs", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());
    const validate = result.current;

    // Act
    const error = validate("invalid-url");

    // Assert
    expect(error).toBe(
      "A URL field within the extension's manifest has an invalid format. {docsLink} ({errorCode})",
    );
  });

  it("should return error message for non-string values", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());
    const validate = result.current;

    // Act
    const error = validate(123);

    // Assert
    expect(error).toBe(
      "A URL field within the extension's manifest has an invalid format. {docsLink} ({errorCode})",
    );
  });

  it("should return error message for empty string", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());
    const validate = result.current;

    // Act
    const error = validate("");

    // Assert
    expect(error).toBe(
      "A URL field within the extension's manifest has an invalid format. {docsLink} ({errorCode})",
    );
  });

  it("should return true for URLs with different protocols", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());
    const validate = result.current;

    // Act
    const isFtpValid = validate("ftp://example.com");
    const isHttpsValid = validate("https://example.com");

    // Assert
    expect(isFtpValid).toBe(true);
    expect(isHttpsValid).toBe(true);
  });

  it("should return true for URLs with ports and paths", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());
    const validate = result.current;

    // Act
    const isUrlWithPortValid = validate("http://example.com:8080");
    const isUrlWithPathValid = validate("http://example.com/path/to/resource");
    const isUrlWithPortAndPathValid = validate("http://example.com:8080/path/to/resource");

    // Assert
    expect(isUrlWithPortValid).toBe(true);
    expect(isUrlWithPathValid).toBe(true);
    expect(isUrlWithPortAndPathValid).toBe(true);
  });
});
