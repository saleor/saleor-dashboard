import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { ThemeProvider } from "@saleor/macaw-ui";
import { render, screen } from "@testing-library/react";

import { TimezoneProvider } from "../Timezone";
import { DateTime } from "./DateTime";

jest.mock("@dashboard/hooks/useCurrentDate");

const mockUseCurrentDate = useCurrentDate as jest.Mock;

const testDateTime = "2024-01-15T14:30:00Z";

describe("DateTime", () => {
  beforeEach(() => {
    // 2024-01-20T14:30:00Z — 5 days after testDateTime
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-01-20T14:30:00Z").getTime());
  });

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
    expect(screen.getByText(/Jan 15, 2024,? 2:30 PM/)).toBeInTheDocument();
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
    expect(screen.getByText(/Jan 15, 2024,? 9:30 AM/)).toBeInTheDocument();
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

describe("DateTime - additional coverage", () => {
  it("renders formatted datetime with Asia/Tokyo timezone in plain mode", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-01-20T14:30:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="Asia/Tokyo">
          <DateTime date={testDateTime} plain />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert — 14:30 UTC = 11:30 PM JST
    expect(screen.getByText(/Jan 15, 2024,? 11:30 PM/)).toBeInTheDocument();
  });

  it("renders relative time with specific days difference", () => {
    // Arrange — 5 days after
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-01-20T14:30:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <DateTime date={testDateTime} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByText(/5 days ago/)).toBeInTheDocument();
  });

  it("renders relative time with timezone applied", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-01-20T14:30:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="America/New_York">
          <DateTime date={testDateTime} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert — relative time should still show ~5 days regardless of timezone
    expect(screen.getByText(/5 days ago/)).toBeInTheDocument();
  });

  it("renders seconds ago for very recent dates", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-01-15T14:30:10Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <DateTime date={testDateTime} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByText(/few seconds ago|seconds? ago/)).toBeInTheDocument();
  });

  it("renders hours ago for dates hours in the past", () => {
    // Arrange — 3 hours after
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-01-15T17:30:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <DateTime date={testDateTime} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByText(/3 hours ago/)).toBeInTheDocument();
  });

  it("renders months ago for dates months in the past", () => {
    // Arrange — ~3 months after
    mockUseCurrentDate.mockReturnValue(new window.Date("2024-04-20T14:30:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <DateTime date={testDateTime} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByText(/3 months ago/)).toBeInTheDocument();
  });
});
