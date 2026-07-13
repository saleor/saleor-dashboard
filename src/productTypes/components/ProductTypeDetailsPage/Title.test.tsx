import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

import { ProductTypeDetailsTitle } from "./Title";

const productType = {
  name: "E-books",
};

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("ProductTypeDetailsTitle", () => {
  it("renders skeleton on initial load", () => {
    // Arrange & Act
    renderTitle(<ProductTypeDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("product-type-details-title-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<ProductTypeDetailsTitle productType={productType} loading />);

    // Assert
    expect(screen.getByText("E-books")).toBeInTheDocument();
    expect(screen.queryByTestId("product-type-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders product type name when loaded", () => {
    // Arrange & Act
    renderTitle(<ProductTypeDetailsTitle productType={productType} />);

    // Assert
    expect(screen.getByText("E-books")).toBeInTheDocument();
  });
});
