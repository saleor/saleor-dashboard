import { render, screen } from "@testing-library/react";

import { TaxAppLabel } from "./TaxAppLabel";

jest.mock("@dashboard/extensions/components/AppAvatar/AppAvatar", () => ({
  AppAvatar: () => <div data-testid="app-avatar" />,
}));

jest.mock("@dashboard/hooks/useLocale", () => () => ({
  locale: "en",
  setLocale: () => undefined,
}));

describe("TaxAppLabel", () => {
  it("renders locale-formatted date from ISO string", () => {
    // Arrange & Act
    render(
      <TaxAppLabel name="Tax App" logoUrl={undefined} created="2024-06-15T10:30:00Z" id="1" />,
    );

    // Assert
    const expected = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date("2024-06-15T10:30:00Z"));

    expect(screen.getByText(`(${expected})`)).toBeInTheDocument();
  });

  it("does not render date when created is null", () => {
    // Arrange & Act
    const { container } = render(
      <TaxAppLabel name="Tax App" logoUrl={undefined} created={null} id="1" />,
    );

    // Assert
    expect(container.textContent).not.toContain("(");
  });

  it("renders app name section when name is provided", () => {
    // Arrange & Act
    render(<TaxAppLabel name="Tax App" logoUrl={undefined} created={null} id="1" />);

    // Assert
    expect(screen.getByText(/Use app/)).toBeInTheDocument();
  });

  it("does not render name section when name is null", () => {
    // Arrange & Act
    render(<TaxAppLabel name={null} logoUrl={undefined} created="2024-01-01T00:00:00Z" id="1" />);

    // Assert
    expect(screen.queryByText(/Use app/)).not.toBeInTheDocument();
  });
});
