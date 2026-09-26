import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { ReferenceList } from "./ReferenceList";
import { type ReferenceListValue } from "./referenceValueAppearance";

const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

const values: ReferenceListValue[] = [
  { label: "Alpine Oak Coffee Table", value: "p1", url: "/products/p1" },
  { label: "Andean Wool Throw", value: "p2", url: "/products/p2" },
  { label: "Apple Juice Concentrate 5L", value: "p3", url: "/products/p3" },
];

describe("ReferenceList", () => {
  it("shows position, name, and category, and scrolls the rows", () => {
    // Arrange
    render(
      <ReferenceList
        values={values}
        details={[
          { id: "p1", categoryName: "Furniture" },
          { id: "p2", categoryName: "Textiles" },
          { id: "p3", productTypeName: "Juice" },
        ]}
        onRemove={jest.fn()}
        onRemoveAll={jest.fn()}
        onReorder={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    const rows = screen.getAllByTestId("product-reference-row");

    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent("1");
    expect(rows[0]).toHaveTextContent("Alpine Oak Coffee Table");
    expect(rows[0]).toHaveTextContent("Furniture");
    expect(rows[0]).toHaveTextContent("AO");
    expect(rows[2]).toHaveTextContent("Juice");
    expect(screen.getByTestId("product-reference-scroll")).toBeInTheDocument();
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("moves and removes a product from the row actions", async () => {
    // Arrange
    const onRemove = jest.fn();
    const onReorder = jest.fn();

    render(
      <ReferenceList
        values={values}
        details={[]}
        onRemove={onRemove}
        onRemoveAll={jest.fn()}
        onReorder={onReorder}
      />,
      { wrapper: RouterWrapper },
    );

    const row = screen.getAllByTestId("product-reference-row")[1];

    // Act
    await userEvent.click(within(row).getByTestId("product-reference-move-up"));
    await userEvent.click(within(row).getByTestId("product-reference-remove"));

    // Assert
    expect(onReorder).toHaveBeenCalledWith({ oldIndex: 1, newIndex: 0 });
    expect(onRemove).toHaveBeenCalledWith(["p2"]);
  });

  it("switches to packed chips that keep a menu for each product", async () => {
    // Arrange
    render(
      <ReferenceList
        values={values}
        details={[]}
        onRemove={jest.fn()}
        onRemoveAll={jest.fn()}
        onReorder={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Act
    await userEvent.click(screen.getByTestId("product-reference-view-packed"));

    // Assert
    expect(screen.queryByTestId("product-reference-row")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("product-reference-chip")).toHaveLength(3);
    expect(screen.getAllByTestId("attribute-value-menu")).toHaveLength(3);
    expect(screen.getByTestId("product-reference-view-packed")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows the variant name as primary and the product as secondary on the first line", () => {
    // Arrange
    render(
      <ReferenceList
        entityType={AttributeEntityTypeEnum.PRODUCT_VARIANT}
        values={[
          {
            label: "White Plimsolls: 44 / White",
            value: "v1",
            url: "/variants/v1",
          },
        ]}
        details={[{ id: "v1", thumbnailUrl: "https://example.com/shoe.jpg" }]}
        onRemove={jest.fn()}
        onRemoveAll={jest.fn()}
        onReorder={jest.fn()}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    const row = screen.getByTestId("product-reference-row");

    expect(row).toHaveTextContent("44 / White");
    expect(screen.getByTestId("attribute-reference-product-name")).toHaveTextContent(
      "White Plimsolls",
    );
    expect(row.textContent?.match(/White Plimsolls/g)).toHaveLength(1);
    expect(row.querySelector("img")).toHaveAttribute("src", "https://example.com/shoe.jpg");
  });
});
