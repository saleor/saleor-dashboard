import { useTheme } from "@dashboard/theme";
import { DefaultTheme } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import React from "react";

import { SaleorLogo } from "./SaleorLogo";

jest.mock("@dashboard/theme", () => {
  const actualTheme = jest.requireActual("@dashboard/theme");

  return {
    ...actualTheme,
    useTheme: jest.fn(),
  };
});

describe("SaleorLogo", () => {
  it("should display light mode logo when theme is defaultLight", () => {
    // Arrange
    const mockTheme: DefaultTheme = "defaultLight";

    (useTheme as jest.Mock).mockReturnValue({
      theme: mockTheme,
    });

    // Act
    render(<SaleorLogo />);

    // Assert
    const img = screen.getByRole("img");

    expect(img).toHaveAttribute("src", expect.stringContaining("sidebar-default-logo.png"));
  });

  it("should display dark mode logo when theme is defaultDark", () => {
    // Arrange
    const mockTheme: DefaultTheme = "defaultDark";

    (useTheme as jest.Mock).mockReturnValue({
      theme: mockTheme,
    });

    // Act
    render(<SaleorLogo />);

    // Assert
    const img = screen.getByRole("img");

    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("sidebar-deafult-logo-darkMode.png"),
    );
  });

  it("should throw error when theme is invalid", () => {
    // Arrange
    const mockTheme = "invalidTheme" as DefaultTheme;

    (useTheme as jest.Mock).mockReturnValue({
      theme: mockTheme,
    });

    // Act & Assert
    expect(() => {
      render(<SaleorLogo />);
    }).toThrow("Invalid theme mode, should not happen.");
  });
});
