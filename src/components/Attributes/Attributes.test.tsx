import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  ProductErrorCode,
} from "@dashboard/graphql";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { type AttributeInput, Attributes } from "./Attributes";

// Reference chips link to the referenced entity.
const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

const numericAttribute: AttributeInput = {
  id: "numeric",
  label: "Shipping weight",
  value: ["2.4"],
  data: {
    inputType: AttributeInputTypeEnum.NUMERIC,
    isRequired: false,
    values: [],
  },
};

const relatedProductsAttribute: AttributeInput = {
  id: "related",
  label: "Related products",
  value: ["p1", "p2"],
  data: {
    inputType: AttributeInputTypeEnum.REFERENCE,
    entityType: AttributeEntityTypeEnum.PRODUCT,
    isRequired: false,
    values: [],
    references: [
      { label: "Scarf", value: "p1" },
      { label: "Gloves", value: "p2" },
    ],
  },
};

const pairsWellWithAttribute: AttributeInput = {
  id: "pairs",
  label: "Pairs well with",
  value: [],
  data: {
    inputType: AttributeInputTypeEnum.REFERENCE,
    entityType: AttributeEntityTypeEnum.PRODUCT,
    isRequired: false,
    values: [],
    references: [],
  },
};

const richTextGetters: RichTextGetters<string> = {
  getDefaultValue: () => ({ blocks: [] }),
  getHandleChange: () => () => undefined,
  getMountEditor: () => () => undefined,
  getShouldMount: () => false,
};

const baseProps: ComponentProps<typeof Attributes> = {
  referenceLayoutView: "product",
  attributes: [numericAttribute, relatedProductsAttribute, pairsWellWithAttribute],
  attributeValues: [],
  errors: [],
  disabled: false,
  loading: false,
  fetchAttributeValues: jest.fn(),
  fetchMoreAttributeValues: { hasMore: false, loading: false, onFetchMore: jest.fn() },
  onAttributeSelectBlur: jest.fn(),
  onChange: jest.fn(),
  onFileChange: jest.fn(),
  onMultiChange: jest.fn(),
  onReferencesAddClick: jest.fn(),
  onReferencesRemove: jest.fn(),
  onReferencesReorder: jest.fn(),
  richTextGetters,
};

describe("Attributes", () => {
  it("shows attribute and reference counts in the card header", () => {
    // Arrange // Act
    render(<Attributes {...baseProps} chrome="card" />, { wrapper: RouterWrapper });

    // Assert
    expect(screen.getByRole("heading", { name: "Attributes" })).toBeInTheDocument();
    expect(screen.getByTestId("attributes-card-meta")).toHaveTextContent(
      "3 attributes · 2 references",
    );
  });

  it("omits the reference count when no references are assigned", () => {
    // Arrange // Act
    render(<Attributes {...baseProps} chrome="card" attributes={[numericAttribute]} />, {
      wrapper: RouterWrapper,
    });

    // Assert
    expect(screen.getByTestId("attributes-card-meta")).toHaveTextContent(/^1 attribute$/);
  });

  it("renders every reference attribute as a foldable row with count and add action", async () => {
    // Arrange
    const onReferencesAddClick = jest.fn();

    render(
      <Attributes {...baseProps} chrome="card" onReferencesAddClick={onReferencesAddClick} />,
      { wrapper: RouterWrapper },
    );

    const [related, pairs] = screen.getAllByTestId("attribute-reference-group");

    // Act
    await userEvent.click(within(pairs).getByTestId("attribute-reference-add"));

    // Assert
    expect(within(related).getByLabelText("Products")).toBeInTheDocument();
    expect(within(related).getByTestId("attribute-reference-count")).toHaveTextContent("2");
    expect(within(pairs).getByTestId("attribute-reference-count")).toHaveTextContent("None");
    expect(onReferencesAddClick).toHaveBeenCalledWith(pairsWellWithAttribute);
  });

  it("peeks the first reference names on one line and leaves them out of the expanded list action", () => {
    // Arrange
    const references = [
      "Alpha",
      "Beta",
      "Gamma",
      "Delta",
      "Epsilon",
      "Zeta",
      "Eta",
      "Theta",
      "Iota",
    ].map((label, index) => ({
      label,
      value: `ref-${index}`,
    }));
    const many: AttributeInput = {
      ...relatedProductsAttribute,
      id: "many",
      label: "Related products",
      value: references.map(reference => reference.value),
      data: {
        ...relatedProductsAttribute.data,
        references,
      },
    };

    // Act
    render(<Attributes {...baseProps} chrome="card" attributes={[many]} />, {
      wrapper: RouterWrapper,
    });

    const row = screen.getByTestId("attribute-reference-group");

    // Assert — more than 8 values starts collapsed, so the peek is what the row shows
    expect(row).toHaveAttribute("data-expanded", "false");
    expect(screen.getByTestId("attribute-reference-peek")).toHaveTextContent("Alpha");
    expect(screen.getByTestId("attribute-reference-peek")).toHaveTextContent("Gamma");
    expect(screen.getByTestId("attribute-reference-more")).toHaveTextContent("+6 more");
    expect(within(row).queryByRole("link")).not.toBeInTheDocument();
  });

  it("peeks product thumbnails when the reference has an image", () => {
    // Arrange
    const withThumbs: AttributeInput = {
      ...relatedProductsAttribute,
      data: {
        ...relatedProductsAttribute.data,
        references: [
          { label: "Cubes", value: "p1", thumbnailUrl: "https://example.com/cubes.jpg" },
          { label: "Alpine", value: "p2" },
        ],
      },
    };

    // Act
    render(<Attributes {...baseProps} chrome="card" attributes={[withThumbs]} />, {
      wrapper: RouterWrapper,
    });

    // Assert
    const peek = screen.getByTestId("attribute-reference-peek");
    const thumbs = within(peek).getAllByTestId("attribute-reference-peek-thumb");

    expect(thumbs[0].querySelector("img")).toHaveAttribute("src", "https://example.com/cubes.jpg");
    expect(thumbs[1]).toHaveTextContent("AL");
    expect(within(peek).queryByTestId("imageIcon")).not.toBeInTheDocument();
  });

  it("peeks variant thumbs with the variant name primary and product secondary", () => {
    // Arrange
    const relatedVariants: AttributeInput = {
      id: "related-variants",
      label: "Related variants",
      value: ["v1", "v2"],
      data: {
        inputType: AttributeInputTypeEnum.REFERENCE,
        entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
        isRequired: false,
        values: [],
        references: [
          {
            label: "White Plimsolls: 44 / White",
            value: "v1",
            thumbnailUrl: "https://example.com/shoe.jpg",
          },
          { label: "Andean Golden Banana: 700ml", value: "v2" },
        ],
      },
    };

    // Act
    render(<Attributes {...baseProps} chrome="card" attributes={[relatedVariants]} />, {
      wrapper: RouterWrapper,
    });

    // Assert
    const peek = screen.getByTestId("attribute-reference-peek");
    const thumbs = within(peek).getAllByTestId("attribute-reference-peek-thumb");

    expect(thumbs[0].querySelector("img")).toHaveAttribute("src", "https://example.com/shoe.jpg");
    expect(thumbs[1]).toHaveTextContent("AG");
    expect(peek).toHaveTextContent("44 / White");
    expect(peek).toHaveTextContent("White Plimsolls");
    expect(peek).toHaveTextContent("700ml");
    expect(within(peek).getAllByTestId("attribute-reference-product-name")[0]).toHaveTextContent(
      "White Plimsolls",
    );
  });

  it("centres simple attribute labels in the card and keeps rich text labels at the top", () => {
    // Arrange
    const richTextAttribute: AttributeInput = {
      id: "rich",
      label: "Care instructions",
      value: [],
      data: {
        inputType: AttributeInputTypeEnum.RICH_TEXT,
        isRequired: false,
        values: [],
      },
    };

    // Act
    render(
      <Attributes
        {...baseProps}
        chrome="card"
        attributes={[numericAttribute, richTextAttribute]}
      />,
      { wrapper: RouterWrapper },
    );

    const [numericLabel, richTextLabel] = screen.getAllByTestId("attribute-label");

    // Assert
    expect(numericLabel).toHaveStyle({ alignSelf: "center" });
    expect(richTextLabel).toHaveStyle({ alignSelf: "baseline" });
  });
  it("keeps the legacy empty reference row outside the card", () => {
    // Arrange // Act
    render(<Attributes {...baseProps} />, { wrapper: RouterWrapper });

    // Assert
    expect(screen.getAllByTestId("attribute-reference-group")).toHaveLength(1);
    expect(screen.queryByTestId("attributes-card-meta")).not.toBeInTheDocument();
  });

  it("lets legacy pages add references to filled and empty reference attributes", async () => {
    // Arrange
    const onReferencesAddClick = jest.fn();

    render(<Attributes {...baseProps} onReferencesAddClick={onReferencesAddClick} />, {
      wrapper: RouterWrapper,
    });

    const [relatedAdd, pairsAdd] = screen.getAllByTestId("attribute-reference-add");

    // Act
    await userEvent.click(relatedAdd);
    await userEvent.click(pairsAdd);

    // Assert
    expect(onReferencesAddClick).toHaveBeenNthCalledWith(1, relatedProductsAttribute);
    expect(onReferencesAddClick).toHaveBeenNthCalledWith(2, pairsWellWithAttribute);
  });

  it("shows a reference attribute error even while the group is collapsed", () => {
    // Arrange
    const many: AttributeInput = {
      ...relatedProductsAttribute,
      value: Array.from({ length: 9 }, (_, index) => `p${index}`),
      data: {
        ...relatedProductsAttribute.data,
        references: Array.from({ length: 9 }, (_, index) => ({
          label: `Product ${index}`,
          value: `p${index}`,
        })),
      },
    };
    const errors: ComponentProps<typeof Attributes>["errors"] = [
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "This attribute is required",
        attributes: [many.id],
      },
    ];

    // Act
    render(<Attributes {...baseProps} chrome="card" attributes={[many]} errors={errors} />, {
      wrapper: RouterWrapper,
    });

    // Assert
    expect(screen.getByTestId("attribute-reference-group")).toHaveAttribute(
      "data-expanded",
      "false",
    );
    expect(screen.getByTestId("attribute-reference-error")).toBeInTheDocument();
  });
});
