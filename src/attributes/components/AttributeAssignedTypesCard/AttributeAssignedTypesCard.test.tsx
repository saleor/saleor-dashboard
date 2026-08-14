import { AttributeTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { AttributeAssignedTypesCard } from "./AttributeAssignedTypesCard";

const RouterWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

describe("AttributeAssignedTypesCard", () => {
  it("renders empty product usage with a link to product types", () => {
    // Arrange & Act
    render(
      <AttributeAssignedTypesCard
        attributeType={AttributeTypeEnum.PRODUCT_TYPE}
        productTypes={{ items: [], hasMore: false }}
        variantTypes={{ items: [], hasMore: false }}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByTestId("attribute-usage-card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    expect(screen.getByText("Not used on any product types yet.")).toBeInTheDocument();
    expect(screen.getByText(/Assign this attribute from a/)).toBeInTheDocument();
  });

  it("lists assigned product types with a count subtitle", () => {
    // Arrange & Act
    render(
      <AttributeAssignedTypesCard
        attributeType={AttributeTypeEnum.PRODUCT_TYPE}
        productTypes={{
          items: [
            { id: "pt-1", name: "T-Shirt" },
            { id: "pt-2", name: "Hoodie" },
          ],
          hasMore: false,
        }}
        variantTypes={{ items: [], hasMore: false }}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByText("2 product types")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "T-Shirt" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hoodie" })).toBeInTheDocument();
  });
});
