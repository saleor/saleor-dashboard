import { appDetails } from "@dashboard/extensions/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppWidgetCard } from "./AppWidgetCard";

describe("AppWidgetCard", () => {
  it("renders extension label in header link with accessible app attribution", () => {
    // Arrange
    const extension = {
      label: "Product Insights",
      app: {
        id: appDetails.id,
        name: "Saleor Pulse",
        brand: null,
      },
    };

    // Act
    render(
      <MemoryRouter>
        <Wrapper>
          <AppWidgetCard extension={extension}>
            <div data-test-id="widget-body">Widget content</div>
          </AppWidgetCard>
        </Wrapper>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText("Product Insights")).toBeInTheDocument();
    expect(screen.getByTestId("app-widget-card-header-link")).toBeInTheDocument();
    expect(screen.getByTestId("widget-body")).toBeInTheDocument();
  });

  it("falls back to app name when extension label is empty", () => {
    // Arrange
    const extension = {
      label: "",
      app: {
        id: appDetails.id,
        name: "Saleor Pulse",
        brand: null,
      },
    };

    // Act
    render(
      <MemoryRouter>
        <Wrapper>
          <AppWidgetCard extension={extension}>
            <div>Widget content</div>
          </AppWidgetCard>
        </Wrapper>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText("Saleor Pulse")).toBeInTheDocument();
  });
});
