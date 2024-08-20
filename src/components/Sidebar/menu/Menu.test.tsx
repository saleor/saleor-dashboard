import { render, screen } from "@testing-library/react";
import React from "react";

import { Menu } from "./Menu";

jest.mock("react-intl", () => ({
  FormattedMessage: () => <>Open env</>,
  defineMessages: jest.fn(),
}));
jest.mock("./useMenuStructure", () => ({
  useMenuStructure: jest.fn(() => []),
}));

jest.mock("@dashboard/auth/hooks/useCloud", () => ({
  useCloud: jest.fn(() => ({ isAuthenticatedViaCloud: true })),
}));

describe("Sidebar menu", () => {
  it("renders link to the cloud environment on production", async () => {
    // Arrange
    const stagingHref =
      "https://cloud.saleor.io/env/test.com?utm_source=dashboard&utm_content=sidebar_button";
    delete (window as { location?: unknown }).location;
    // @ts-expect-error
    window.location = { hostname: "test.com" };
    render(<Menu />);

    // Assert
    await screen.findAllByTestId((content, element) => {
      const isMatchTestId = content === "menu-item-label-env";
      const isMatchHref = element?.getAttribute("href") === stagingHref;
      return isMatchTestId && isMatchHref;
    });
  });

  it("renders link to the cloud environment on staging", async () => {
    // Arrange
    const stagingHref =
      "https://cloud.staging.saleor.io/env/test.staging.com?utm_source=dashboard&utm_content=sidebar_button";
    delete (window as { location?: unknown }).location;
    // @ts-expect-error
    window.location = { hostname: "test.staging.com" };
    render(<Menu />);

    // Assert
    await screen.findAllByTestId((content, element) => {
      const isMatchTestId = content === "menu-item-label-env";
      const isMatchHref = element?.getAttribute("href") === stagingHref;
      return isMatchTestId && isMatchHref;
    });
  });
});
