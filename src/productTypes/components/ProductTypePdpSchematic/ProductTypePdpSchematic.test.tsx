import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductTypePdpSchematic } from "./ProductTypePdpSchematic";

const choices = (name: string) => ({
  edges: [{ node: { name } }],
});

describe("ProductTypePdpSchematic", () => {
  it("renders assigned option names in the buy box and product attributes under the gallery", () => {
    // Arrange & Act
    render(
      <ProductTypePdpSchematic
        hasVariants={true}
        productAttributes={[{ id: "brand", name: "Brand", choices: choices("Saleor") }]}
        assignedVariantAttributes={[
          { variantSelection: true, attribute: { id: "color", name: "Color" } },
          {
            variantSelection: true,
            attribute: { id: "size", name: "Size", choices: choices("S") },
          },
        ]}
        selectedVariantAttributeIds={["color", "size"]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("product-type-pdp-schematic")).toBeInTheDocument();
    expect(screen.getByTestId("pdp-schematic-paper-mark")).toHaveAccessibleName("Paper");
    expect(screen.getByTestId("pdp-schematic-paper-mark").querySelector("svg")).toBeInTheDocument();
    expect(screen.getByTestId("pdp-schematic-paper-mark")).not.toHaveTextContent("P");
    expect(screen.getByTestId("pdp-schematic-image")).toBeInTheDocument();
    expect(screen.queryByText("Heavyweight hoodie")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("pdp-schematic-option")[0]).toHaveTextContent("Color");
    expect(screen.getAllByTestId("pdp-schematic-option")[1]).toHaveTextContent("Size");
    expect(screen.getAllByTestId("pdp-schematic-option")[1]).toHaveTextContent("S");
    expect(screen.getByTestId("pdp-schematic-spec")).toHaveTextContent("Brand");
    expect(screen.getByTestId("pdp-schematic-spec")).toHaveTextContent("Saleor");
    expect(screen.queryByTestId("pdp-schematic-sample-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("pdp-schematic-legend")).toHaveTextContent("Where attributes show");
    expect(screen.getByTestId("pdp-schematic-legend")).toHaveTextContent("Shopper picks");
    expect(screen.getByTestId("pdp-schematic-legend")).toHaveTextContent("Product details");
    expect(screen.getByTestId("pdp-schematic-legend")).toHaveTextContent("Variant facts");
    expect(
      screen.getByTestId("pdp-schematic-legend").querySelector('[data-schematic-region="options"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("pdp-schematic-legend").querySelector('[data-schematic-region="specs"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("pdp-schematic-legend").querySelector('[data-schematic-region="facts"]'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("pdp-schematic-dismiss")).not.toBeInTheDocument();
  });

  it("calls onDismiss from the footer", async () => {
    // Arrange
    const onDismiss = jest.fn();
    const user = userEvent.setup();

    render(
      <ProductTypePdpSchematic
        hasVariants={true}
        productAttributes={[]}
        assignedVariantAttributes={[]}
        selectedVariantAttributeIds={[]}
        onDismiss={onDismiss}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByTestId("pdp-schematic-dismiss"));

    // Assert
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("shows the first real choice on variant facts, not the attribute name", () => {
    // Arrange & Act
    render(
      <ProductTypePdpSchematic
        hasVariants={true}
        productAttributes={[]}
        assignedVariantAttributes={[
          { variantSelection: true, attribute: { id: "size", name: "Size" } },
          {
            variantSelection: false,
            attribute: { id: "certs", name: "Certifications", choices: choices("Fair Trade") },
          },
        ]}
        selectedVariantAttributeIds={["size"]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("pdp-schematic-badges")).toHaveTextContent("Fair Trade");
    expect(screen.getByTestId("pdp-schematic-badges")).not.toHaveTextContent("Certifications");
    expect(screen.getByTestId("pdp-schematic-badges")).not.toHaveTextContent("GOTS");
    expect(screen.getByTestId("pdp-schematic-option")).toHaveTextContent("Size");
  });

  it("does not invent a sample when the attribute has no choices", () => {
    // Arrange & Act
    render(
      <ProductTypePdpSchematic
        hasVariants={true}
        productAttributes={[{ id: "brand", name: "Brand" }]}
        assignedVariantAttributes={[
          { variantSelection: false, attribute: { id: "fit", name: "Fit" } },
        ]}
        selectedVariantAttributeIds={[]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getAllByTestId("pdp-schematic-sample-skeleton").length).toBeGreaterThan(0);
    expect(screen.queryByText("Saleor")).not.toBeInTheDocument();
    expect(screen.queryByText("GOTS")).not.toBeInTheDocument();
  });

  it("explains that a single-variant type has no pickers", () => {
    // Arrange & Act
    render(
      <ProductTypePdpSchematic
        hasVariants={false}
        productAttributes={[]}
        assignedVariantAttributes={[
          { variantSelection: true, attribute: { id: "size", name: "Size" } },
        ]}
        selectedVariantAttributeIds={["size"]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("pdp-schematic-no-pickers")).toBeInTheDocument();
    expect(screen.queryByTestId("pdp-schematic-option")).not.toBeInTheDocument();
  });

  it("reserves schematic regions while the product type is loading", () => {
    // Arrange & Act
    render(
      <ProductTypePdpSchematic
        loading
        hasVariants={false}
        productAttributes={undefined}
        assignedVariantAttributes={undefined}
        selectedVariantAttributeIds={[]}
        onDismiss={() => undefined}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("pdp-schematic-loading")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("pdp-schematic-legend")).toBeInTheDocument();
    expect(screen.queryByTestId("pdp-schematic-no-pickers")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pdp-schematic-option")).not.toBeInTheDocument();
    expect(screen.getByTestId("pdp-schematic-dismiss")).toBeDisabled();
  });
});
