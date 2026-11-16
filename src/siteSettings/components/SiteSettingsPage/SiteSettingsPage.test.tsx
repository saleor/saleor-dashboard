import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import { shop } from "@dashboard/siteSettings/fixtures";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { ApolloMockedProvider } from "@test/ApolloMockedProvider";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { SiteSettingsPage } from "./SiteSettingsPage";

// Radix primitives used by macaw-ui need ResizeObserver, which jsdom lacks.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
  <ApolloMockedProvider>
    <MemoryRouter>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>
          <SavebarRefProvider>{children}</SavebarRefProvider>
        </ThemeProvider>
      </IntlProvider>
    </MemoryRouter>
  </ApolloMockedProvider>
);

const renderPage = ({
  allowStorefrontTraffic = true,
  disabled = false,
  onShowMetadata = jest.fn(),
}: {
  allowStorefrontTraffic?: boolean;
  disabled?: boolean;
  onShowMetadata?: () => void;
} = {}) =>
  render(
    <SiteSettingsPage
      disabled={disabled}
      errors={[]}
      shop={{ ...shop!, allowStorefrontTraffic }}
      saveButtonBarState="default"
      onShowMetadata={onShowMetadata}
      onSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  );

// macaw's Checkbox puts data-test-id on its wrapper Box, so drill down to the Radix control.
const storefrontTrafficToggle = () =>
  within(screen.getByTestId("allow-storefront-traffic-checkbox")).getByRole("checkbox");

describe("SiteSettingsPage — API access section", () => {
  it("sits between customer accounts and advanced sections", () => {
    // Arrange & Act
    const { container } = renderPage();

    // Assert
    const sectionIds = Array.from(container.querySelectorAll("section")).map(section => section.id);

    expect(sectionIds).toEqual([
      "store-details",
      "company-information",
      "customer-accounts",
      "api-access",
      "advanced",
    ]);
  });

  it("reflects allowStorefrontTraffic and hides the warning when traffic is allowed", () => {
    // Arrange & Act
    renderPage();

    // Assert
    expect(storefrontTrafficToggle()).toBeChecked();
    expect(
      screen.queryByText(/Turning this off blocks storefronts from reaching the API/),
    ).not.toBeInTheDocument();
  });

  it("lists the consequences once storefront traffic is blocked", async () => {
    // Arrange
    renderPage();

    // Act
    await userEvent.click(storefrontTrafficToggle());

    // Assert
    expect(storefrontTrafficToggle()).not.toBeChecked();
    expect(
      screen.getByText(/Turning this off blocks storefronts from reaching the API/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Customer login, password reset/)).toBeInTheDocument();
    expect(
      screen.getByText(/Schema introspection requires app or staff credentials/),
    ).toBeInTheDocument();
  });
});

describe("SiteSettingsPage — store metadata", () => {
  it("opens the store metadata editor from the top bar", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit store metadata" }));

    // Assert
    expect(onShowMetadata).toHaveBeenCalledTimes(1);
  });

  it("does not open the editor while the page is loading or saving", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ disabled: true, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit store metadata" }));

    // Assert
    expect(onShowMetadata).not.toHaveBeenCalled();
  });
});
