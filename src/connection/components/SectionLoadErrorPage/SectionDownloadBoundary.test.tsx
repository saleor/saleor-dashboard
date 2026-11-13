import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { SectionDownloadBoundary } from "./SectionDownloadBoundary";

const Throws = ({ error }: { error: Error }): never => {
  throw error;
};

const renderBoundary = (error: Error): void => {
  render(
    <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
      <SectionDownloadBoundary>
        <Throws error={error} />
      </SectionDownloadBoundary>
    </Router>,
    { wrapper: Wrapper },
  );
};

describe("SectionDownloadBoundary", () => {
  beforeEach(() => {
    // React logs every error an error boundary catches.
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("says the page couldn't open when its code couldn't be downloaded", () => {
    // Arrange & Act
    renderBoundary(new TypeError("Failed to fetch dynamically imported module: /assets/auth.js"));

    // Assert
    expect(screen.getByText("Couldn't open this page")).toBeInTheDocument();
  });

  it("passes on any other error", () => {
    // Arrange
    const bug = new TypeError("Cannot read properties of undefined (reading 'user')");

    // Act
    const rendering = (): void => renderBoundary(bug);

    // Assert
    expect(rendering).toThrow(bug);
  });
});
