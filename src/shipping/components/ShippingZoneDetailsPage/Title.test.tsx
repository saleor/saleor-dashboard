import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

import { ShippingZoneDetailsTitle } from "./Title";

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("ShippingZoneDetailsTitle", () => {
  it("renders skeleton on initial load", () => {
    // Arrange & Act
    renderTitle(<ShippingZoneDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("shipping-zone-details-title-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<ShippingZoneDetailsTitle name="Europe" loading />);

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.queryByTestId("shipping-zone-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders shipping zone name when loaded", () => {
    // Arrange & Act
    renderTitle(<ShippingZoneDetailsTitle name="Europe" />);

    // Assert
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });
});
