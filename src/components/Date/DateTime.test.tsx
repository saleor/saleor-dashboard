import { ThemeProvider } from "@saleor/macaw-ui";
import { render, screen } from "@testing-library/react";

import { TimezoneProvider } from "../Timezone";
import { DateTime } from "./DateTime";

const testDateTime = "2024-01-15T14:30:00Z";

describe("DateTime", () => {
  it("renders formatted datetime string in plain mode", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <DateTime date={testDateTime} plain />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByText("Jan 15, 2024 2:30 PM")).toBeInTheDocument();
  });

  it("renders formatted datetime with timezone in plain mode", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="America/New_York">
          <DateTime date={testDateTime} plain />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByText("Jan 15, 2024 9:30 AM")).toBeInTheDocument();
  });

  it("renders relative time element in non-plain mode", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <DateTime date={testDateTime} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    const timeElement = screen.getByText(/ago|year|month|day|hour|minute|second/i);

    expect(timeElement).toBeInTheDocument();
  });
});
