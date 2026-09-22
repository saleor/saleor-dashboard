import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

import { CustomerTypeDetailsTitle } from "./Title";

const customerType = {
  name: "B2B",
  isDefault: false,
};

const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
  <ThemeWrapper>{children}</ThemeWrapper>
);

const renderTitle = (ui: ReactElement) => render(ui, { wrapper: Wrapper });

describe("CustomerTypeDetailsTitle", () => {
  it("renders skeleton on initial load", () => {
    // Arrange & Act
    renderTitle(<CustomerTypeDetailsTitle loading />);

    // Assert
    expect(screen.getByTestId("customer-type-details-title-skeleton")).toBeInTheDocument();
  });

  it("keeps header content during background refetch", () => {
    // Arrange & Act
    renderTitle(<CustomerTypeDetailsTitle customerType={customerType} loading />);

    // Assert
    expect(screen.getByText("B2B")).toBeInTheDocument();
    expect(screen.queryByTestId("customer-type-details-title-skeleton")).not.toBeInTheDocument();
  });

  it("renders customer type name when loaded", () => {
    // Arrange & Act
    renderTitle(<CustomerTypeDetailsTitle customerType={customerType} />);

    // Assert
    expect(screen.getByText("B2B")).toBeInTheDocument();
    expect(screen.queryByTestId("customer-type-default-pill")).not.toBeInTheDocument();
  });

  it("renders the default pill for the default customer type", () => {
    // Arrange & Act
    renderTitle(<CustomerTypeDetailsTitle customerType={{ name: "Default", isDefault: true }} />);

    // Assert
    expect(screen.getByTestId("customer-type-default-pill")).toBeInTheDocument();
  });
});
