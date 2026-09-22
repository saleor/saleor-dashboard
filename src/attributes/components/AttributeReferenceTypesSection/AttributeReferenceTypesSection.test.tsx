import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { AttributeReferenceTypesSection } from "./AttributeReferenceTypesSection";

// Multiselect uses IntersectionObserver for infinite scroll.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("AttributeReferenceTypesSection", () => {
  it("renders reference types in the standard settings card", () => {
    // Arrange & Act
    render(
      <AttributeReferenceTypesSection
        entityType={AttributeEntityTypeEnum.PRODUCT}
        fetchOptions={jest.fn()}
        onChange={jest.fn()}
        options={[]}
        value={[]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("attribute-reference-types-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reference Types" })).toBeInTheDocument();
    expect(screen.getByTestId("attribute-reference-types-select")).toBeInTheDocument();
  });
});
