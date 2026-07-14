import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

import { PageTypeDetailsTitle } from "./Title";

const pageType = {
  name: "Blog",
};

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("PageTypeDetailsTitle", () => {
  it("renders skeleton on initial load", () => {
    // Arrange & Act
    renderTitle(<PageTypeDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("page-type-details-title-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<PageTypeDetailsTitle pageType={pageType} loading />);

    // Assert
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.queryByTestId("page-type-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders model type name when loaded", () => {
    // Arrange & Act
    renderTitle(<PageTypeDetailsTitle pageType={pageType} />);

    // Assert
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });
});
