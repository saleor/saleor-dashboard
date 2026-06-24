import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { CountryList } from "./CountryList";

const defaultProps = {
  disabled: false,
  emptyText: "No countries assigned",
  summaryContext: "shipping-zone" as const,
  title: "Countries",
  onCountryAssign: jest.fn(),
  onCountryUnassign: jest.fn(),
};

describe("CountryList", () => {
  it("renders skeleton while countries are loading", () => {
    // Arrange // Act
    render(<CountryList {...defaultProps} countries={undefined} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("country-list-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("No countries assigned")).not.toBeInTheDocument();
  });

  it("renders empty state when countries are loaded but empty", () => {
    // Arrange // Act
    render(<CountryList {...defaultProps} countries={[]} />, { wrapper: Wrapper });

    // Assert
    expect(screen.queryByTestId("country-list-skeleton")).not.toBeInTheDocument();
    expect(screen.getByText("No countries assigned")).toBeInTheDocument();
  });
});
