import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AttributePageLoading } from "./AttributePageLoading";

jest.mock("@dashboard/components/Savebar");

describe("AttributePageLoading", () => {
  it("renders the stable layout without type-dependent sections", () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <AttributePageLoading attributePageBackLink="/attributes" onShowMetadata={jest.fn()} />
      </MemoryRouter>,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("attribute-details-loading")).toBeInTheDocument();
    expect(screen.getByTestId("attribute-general-information")).toBeInTheDocument();
    expect(screen.getByTestId("attribute-properties")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Attribute Values" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Reference Types" })).not.toBeInTheDocument();
    expect(screen.queryByText("Dropdown")).not.toBeInTheDocument();
    expect(screen.queryByText("Filterable in storefront")).not.toBeInTheDocument();
    expect(screen.queryByText("Assign value")).not.toBeInTheDocument();
    expect(screen.queryByText(/used internally/i)).not.toBeInTheDocument();
  });
});
