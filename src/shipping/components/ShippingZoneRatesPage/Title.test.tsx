import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

import { ShippingMethodDetailsTitle } from "./Title";

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("ShippingMethodDetailsTitle", () => {
  it("renders skeletons on initial load", () => {
    // Arrange & Act
    renderTitle(<ShippingMethodDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("shipping-method-zone-title-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("shipping-method-details-title-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(
      <ShippingMethodDetailsTitle shippingZoneName="Europe" rateName="Standard shipping" loading />,
    );

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Standard shipping")).toBeInTheDocument();
    expect(screen.queryByTestId("shipping-method-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders zone and method names when loaded", () => {
    // Arrange & Act
    renderTitle(
      <ShippingMethodDetailsTitle shippingZoneName="Europe" rateName="Standard shipping" />,
    );

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Standard shipping")).toBeInTheDocument();
  });
});
