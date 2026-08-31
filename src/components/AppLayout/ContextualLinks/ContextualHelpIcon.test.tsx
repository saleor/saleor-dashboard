import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContextualHelpIcon } from "./ContextualHelpIcon";

const trackEvent = jest.fn();

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: () => ({ trackEvent }),
}));

describe("ContextualHelpIcon", () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it("renders a docs link and tracks the click", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ContextualHelpIcon
        href="https://docs.saleor.io/developer/products/configuration"
        label="Learn more about product configurations"
        analyticsType="product_configuration_docs"
        dataTestId="product-configurations-docs"
      />,
    );

    // Act
    const link = screen.getByRole("link", { name: "Learn more about product configurations" });

    await user.click(link);

    // Assert
    expect(link).toHaveAttribute("href", "https://docs.saleor.io/developer/products/configuration");
    expect(trackEvent).toHaveBeenCalledWith("contextual_link_clicked", {
      type: "product_configuration_docs",
    });
  });

  it("exposes the docs control as a link, not a nested button", () => {
    // Arrange & Act
    render(
      <ContextualHelpIcon
        href="https://docs.saleor.io/developer/products/configuration"
        label="Learn more about product configurations"
        analyticsType="product_configuration_docs"
      />,
    );

    // Assert
    expect(
      screen.getByRole("link", { name: "Learn more about product configurations" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
