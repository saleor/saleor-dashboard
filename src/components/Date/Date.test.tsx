// @ts-strict-ignore
import { ThemeProvider } from "@saleor/macaw-ui";
import { render, screen } from "@testing-library/react";

import { TimezoneProvider } from "../Timezone";
import Date from "./Date";

const testDate = "2018-04-07";
const expectedDate = "Apr 7, 2018";

describe("Date", () => {
  it("Render plain date with timezone GMT-11", () => {
    // Arrange & Act
    render(
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
      <ThemeProvider>
        <TimezoneProvider value="Pacific/Midway">
          <Date date={testDate} />
        </TimezoneProvider>
      </ThemeProvider>,
    );
    // Assert
    expect(screen.queryByTestId<HTMLTimeElement>("dateTime").dateTime).toEqual(testDate);
  });
  it("Render humanized date with timezone GMT+13", () => {
    // Arrange & Act
    render(
      <ThemeProvider>
        <TimezoneProvider value="Pacific/Tongatapu">
          <Date date={testDate} />
        </TimezoneProvider>
      </ThemeProvider>,
    );
    // Assert
    expect(screen.queryByTestId<HTMLTimeElement>("dateTime").dateTime).toEqual(testDate);
  });
});
