import { render, screen } from "@testing-library/react";
import React from "react";

import { ProductAnalytics } from ".";

jest.mock("posthog-js/react", () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children} with posthog</>
  ),
}));

describe("ProductAnalytics", () => {
  const ENV_COPY = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV_COPY }; // Make a copy
  });

  afterAll(() => {
    process.env = ENV_COPY; // Restore old environment
  });

  it("renders analytics when it is cloud instance and config was provided", async () => {
    // Arrange
    process.env.IS_CLOUD_INSTANCE = "true";
    process.env.POSTHOG_KEY = "key";
    process.env.POSTHOG_HOST = "host";

    // Act
    render(<ProductAnalytics>Test</ProductAnalytics>);

    // Assert
    await screen.findByText("Test with posthog");
  });

  it("does not renders analytics when there is no config", async () => {
    // Arrange
    process.env.IS_CLOUD_INSTANCE = "true";

    // Act
    render(<ProductAnalytics>Test</ProductAnalytics>);

    // Assert
    await screen.findByText("Test");
  });

  it("does not renders analytics it is not cloud instance", async () => {
    // Act
    render(<ProductAnalytics>Test</ProductAnalytics>);

    // Assert
    await screen.findByText("Test");
  });
});
