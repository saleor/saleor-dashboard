import { getChoicesWithAncestors } from "@dashboard/products/utils/utils";
import { ThemeProvider } from "@saleor/macaw-ui";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
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
  },
  {
    id: "2",
    name: "Sneakers",
    ancestors: {
      edges: [],
    },
  },
  {
    id: "3",
    name: "Running",
    ancestors: {
      edges: [],
    },
  },
]);

const categoriesWithAncestors = getChoicesWithAncestors([
  {
    id: "1",
    name: "Shoes",
    ancestors: {
      edges: [],
    },
  },
  {
    id: "2",
    name: "Sneakers",
    ancestors: {
      edges: [
        {
          node: {
            id: "2-1",
            name: "Shoes",
          },
        },
      ],
    },
  },
  {
    id: "3",
    name: "Running",
    ancestors: {
      edges: [
        {
          node: {
            id: "3-1",
            name: "Shoes",
          },
        },
        {
          node: {
            id: "3-2",
            name: "Sneakers",
          },
        },
      ],
    },
  },
]);

const Wrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Router>
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

    fireEvent.focus(labelElement!);

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

    fireEvent.focus(labelElement!);

    // Assert
    expect(labelElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Running")).toBeInTheDocument();
      expect(screen.getByText("Shoes / Sneakers /")).toBeInTheDocument();
    });
  });
});
