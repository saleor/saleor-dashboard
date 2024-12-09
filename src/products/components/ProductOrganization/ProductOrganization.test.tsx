import { getChoicesWithAncestors } from "@dashboard/products/utils/utils";
import { ThemeProvider } from "@saleor/macaw-ui";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { MemoryRouter as Router } from "react-router-dom";

import { ProductOrganization } from "./ProductOrganization";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

const intersectionObserverMock = () => ({
  observe: () => null,
  unobserve: () => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

const categories = getChoicesWithAncestors([
  {
    id: "1",
    name: "Shoes",
    ancestors: {
      edges: [],
    },
    parent: null,
    level: 0,
  },
  {
    id: "2",
    name: "Sneakers",
    ancestors: {
      edges: [],
    },
    parent: null,
    level: 0,
  },
  {
    id: "3",
    name: "Running",
    ancestors: {
      edges: [],
    },
    parent: null,
    level: 0,
  },
]);

const categoriesWithAncestors = getChoicesWithAncestors([
  {
    id: "1", // Shoes
    name: "Shoes",
    ancestors: {
      edges: [],
    },
    parent: null,
    level: 0,
  },
  {
    id: "2", // Shoes / Sneakers
    name: "Sneakers",
    ancestors: {
      edges: [
        {
          node: { id: "2-1", name: "Shoes" },
        },
      ],
    },
    parent: {
      id: "2-1",
      name: "Shoes",
    },
    level: 1,
  },
  {
    id: "3", // Shoes / ... / Trekking / Running
    name: "Running",
    ancestors: {
      edges: [
        {
          node: {
            id: "3-1",
            name: "Shoes",
          },
        },
      ],
    },
    parent: {
      id: "4-2",
      name: "Trekking",
    },
    level: 4,
  },
]);

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <Router>
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    <ThemeProvider>{children}</ThemeProvider>
  </Router>
);

describe("Products ProductOrganization", () => {
  it("renders combobox dropdown list", async () => {
    // Arrange & Act
    render(
      <Wrapper>
        <ProductOrganization
          categories={categories}
          canChangeType={false}
          categoryInputDisplayValue="categoryInputDisplayValue"
          collections={[]}
          collectionsInputDisplayValue={[]}
          data={{ category: "category", collections: [] }}
          disabled={false}
          errors={[]}
          fetchCategories={jest.fn()}
          fetchCollections={jest.fn()}
          // @ts-expect-error - fn not used in this test
          fetchMoreCategories={jest.fn()}
          // @ts-expect-error - fn not used in this test
          fetchMoreCollections={jest.fn()}
          productType={{ hasVariants: true, id: "id", name: "name" }}
          productTypeInputDisplayValue="productTypeInputDisplayValue"
          productTypes={undefined}
          onCategoryChange={jest.fn()}
          onCollectionChange={jest.fn()}
          onProductTypeChange={jest.fn()}
        />
      </Wrapper>,
    );

    const labelElement = screen.getAllByRole("combobox", {
      expanded: false,
    })[0]; // get the first combobox - categories

    fireEvent.click(labelElement!);

    // Assert
    expect(labelElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Shoes")).toBeInTheDocument();
      expect(screen.getByText("Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Running")).toBeInTheDocument();
    });
  });
  it("renders combobox with dropdown list with multiple ancestors", async () => {
    // Arrange & Act
    render(
      <Wrapper>
        <ProductOrganization
          categories={categoriesWithAncestors}
          canChangeType={false}
          categoryInputDisplayValue="categoryInputDisplayValue"
          collections={[]}
          collectionsInputDisplayValue={[]}
          data={{ category: "category", collections: [] }}
          disabled={false}
          errors={[]}
          fetchCategories={jest.fn()}
          fetchCollections={jest.fn()}
          // @ts-expect-error - fn not used in this test
          fetchMoreCategories={jest.fn()}
          // @ts-expect-error - fn not used in this test
          fetchMoreCollections={jest.fn()}
          productType={{ hasVariants: true, id: "id", name: "name" }}
          productTypeInputDisplayValue="productTypeInputDisplayValue"
          productTypes={undefined}
          onCategoryChange={jest.fn()}
          onCollectionChange={jest.fn()}
          onProductTypeChange={jest.fn()}
        />
      </Wrapper>,
    );

    const labelElement = screen.getAllByRole("combobox", {
      expanded: false,
    })[0]; // get the first combobox - categories

    fireEvent.click(labelElement!);

    // Assert
    expect(labelElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Running")).toBeInTheDocument();
      expect(screen.getByText("Shoes /")).toBeInTheDocument();
      expect(screen.getByText("Shoes / ... / Trekking /")).toBeInTheDocument();
    });
  });
});
