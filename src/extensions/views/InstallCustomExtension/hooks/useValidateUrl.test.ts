import { renderHook } from "@testing-library/react-hooks";

import { useValidateUrl } from "./useValidateUrl";

jest.mock("react-intl", () => ({
  useIntl: () => ({
    formatMessage: (message: { id: string; defaultMessage: string }) => message.defaultMessage,
  }),
  defineMessages: (messages: Record<string, { id: string; defaultMessage: string }>) => messages,
}));

describe("useValidateUrl", () => {
  it("should return true for valid URLs", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());

    // Act
    const isValid = result.current("https://example.com");

    // Assert
    expect(isValid).toBe(true);
  });

  it("should return error message for invalid URLs", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());

    // Act
    const error = result.current("not-a-url");

    // Assert
    expect(error).toBe("URL has invalid format");
  });

  it("should return error message for non-string values", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());

    // Act
    const error = result.current(123);

    // Assert
    expect(error).toBe("URL has invalid format");
  });

  it("should return error message for empty string", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());

    // Act
    const error = result.current("");

    // Assert
    expect(error).toBe("URL has invalid format");
  });

  it("should return true for URLs with different protocols", () => {
    // Arrange
    const { result } = renderHook(() => useValidateUrl());

    // Act
    const isValidHttp = result.current("http://example.com");
    const isValidHttps = result.current("https://example.com");
    const isValidFtp = result.current("ftp://example.com");

    // Assert
    expect(isValidHttp).toBe(true);
    expect(isValidHttps).toBe(true);
    expect(isValidFtp).toBe(true);
  });
});
