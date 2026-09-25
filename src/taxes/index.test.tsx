import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TaxesSection from ".";

// `@sentry/react` is auto-mocked in the test setup, which turns the Sentry-wrapped
// `Route` from the shared Router module into `undefined`. Use the plain react-router
// `Route` instead so routing actually resolves.
jest.mock("@dashboard/components/Router", () => ({
  Route: jest.requireActual("react-router-dom").Route,
}));

// The tab views pull in Apollo queries and page layouts. This test only exercises
// routing, so stub them with recognizable markers.
jest.mock("./views/TaxChannelsList", () => ({
  __esModule: true,
  default: () => <div data-test-id="tax-channels-view" />,
}));
jest.mock("./views/TaxCountriesList", () => ({
  __esModule: true,
  default: () => <div data-test-id="tax-countries-view" />,
}));
jest.mock("./views/TaxClassesList", () => ({
  __esModule: true,
  default: () => <div data-test-id="tax-classes-view" />,
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <TaxesSection />
    </MemoryRouter>,
  );

describe("TaxesSection routing", () => {
  it("redirects the section root to the channels tab (regression: /taxes rendered a blank page)", () => {
    // Arrange & Act
    renderAt("/taxes");

    // Assert
    expect(screen.getByTestId("tax-channels-view")).toBeInTheDocument();
  });

  it("redirects the section root to the channels tab regardless of a trailing slash", () => {
    // Arrange & Act
    renderAt("/taxes/");

    // Assert
    expect(screen.getByTestId("tax-channels-view")).toBeInTheDocument();
  });

  it("keeps rendering the countries tab on its own path", () => {
    // Arrange & Act
    renderAt("/taxes/countries");

    // Assert
    expect(screen.getByTestId("tax-countries-view")).toBeInTheDocument();
    expect(screen.queryByTestId("tax-channels-view")).not.toBeInTheDocument();
  });

  it("keeps rendering the tax classes tab on its own path", () => {
    // Arrange & Act
    renderAt("/taxes/tax-classes");

    // Assert
    expect(screen.getByTestId("tax-classes-view")).toBeInTheDocument();
    expect(screen.queryByTestId("tax-channels-view")).not.toBeInTheDocument();
  });
});
