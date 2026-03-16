import { useCurrentDate } from "@dashboard/hooks/useCurrentDate";
import { ThemeProvider } from "@saleor/macaw-ui";
import { render, screen } from "@testing-library/react";

import { TimezoneProvider } from "../Timezone";
import { Date } from "./Date";

jest.mock("@dashboard/hooks/useCurrentDate");

const mockUseCurrentDate = useCurrentDate as jest.Mock;

const testDate = "2018-04-07";
const expectedDate = "Apr 7, 2018";

describe("Date", () => {
  beforeEach(() => {
    // 2018-04-10T00:00:00Z — exactly 3 days after testDate
    mockUseCurrentDate.mockReturnValue(new window.Date("2018-04-10T00:00:00Z").getTime());
  });

  it("Render plain date with timezone GMT-11", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="Pacific/Midway">
          <Date date={testDate} plain />
        </TimezoneProvider>
      </ThemeProvider>,
    );
    // Assert
    expect(screen.queryByText(expectedDate)).toBeInTheDocument();
  });
  it("Render plain date with timezone GMT+13", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="Pacific/Tongatapu">
          <Date date={testDate} plain />
        </TimezoneProvider>
      </ThemeProvider>,
    );
    // Assert
    expect(screen.queryByText(expectedDate)).toBeInTheDocument();
  });
  it("Render humanized date with timezone GMT-11", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="Pacific/Midway">
          <Date date={testDate} />
        </TimezoneProvider>
      </ThemeProvider>,
    );
    // Assert
    expect(screen.queryByTestId<HTMLTimeElement>("dateTime")!.dateTime).toEqual(testDate);
  });
  it("Render humanized date with timezone GMT+13", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="Pacific/Tongatapu">
          <Date date={testDate} />
        </TimezoneProvider>
      </ThemeProvider>,
    );
    // Assert
    expect(screen.queryByTestId<HTMLTimeElement>("dateTime")!.dateTime).toEqual(testDate);
  });
});

describe("Date - relative time units", () => {
  it("renders '3 days ago' for 3 day difference", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2018-04-10T00:00:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <Date date={testDate} />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("dateTime")).toHaveTextContent("3 days ago");
  });

  it("renders '10 seconds ago' for very recent dates", () => {
    // Arrange - 10 seconds after the date
    mockUseCurrentDate.mockReturnValue(new window.Date("2018-04-07T00:00:10Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <Date date="2018-04-07T00:00:00Z" />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("dateTime")).toHaveTextContent("10 seconds ago");
  });

  it("renders '5 minutes ago' for 5 minute difference", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2018-04-07T00:05:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <Date date="2018-04-07T00:00:00Z" />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("dateTime")).toHaveTextContent("5 minutes ago");
  });

  it("renders '3 hours ago' for 3 hour difference", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2018-04-07T03:00:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <Date date="2018-04-07T00:00:00Z" />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("dateTime")).toHaveTextContent("3 hours ago");
  });

  it("renders '2 months ago' for ~2 month difference", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2018-06-10T00:00:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <Date date="2018-04-07T00:00:00Z" />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("dateTime")).toHaveTextContent("2 months ago");
  });

  it("renders '2 years ago' for ~2 year difference", () => {
    // Arrange
    mockUseCurrentDate.mockReturnValue(new window.Date("2020-04-10T00:00:00Z").getTime());

    // Act
    render(
      // @ts-expect-error - legacy types
      <ThemeProvider>
        <TimezoneProvider value="UTC">
          <Date date="2018-04-07T00:00:00Z" />
        </TimezoneProvider>
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("dateTime")).toHaveTextContent("2 years ago");
  });
});
