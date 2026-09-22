import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { type ItemData } from "./prepareResults";
import { ResultsAsListboxOptionsContext } from "./ResultsAsListboxOptionsContext";
import { ResultsTable } from "./ResultsTable";

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => mockNavigate,
}));

const data: ItemData = {
  orders: [],
  categories: [
    {
      __typename: "Category",
      id: "Q2F0ZWdvcnk6MQ==",
      name: "Accessories",
      updatedAt: "2026-08-20T10:00:00+00:00",
      backgroundImage: null,
      products: {
        __typename: "ProductCountableConnection",
        totalCount: 3,
      },
      parent: null,
      level: 0,
      ancestors: {
        __typename: "CategoryCountableConnection",
        edges: [],
      },
    },
  ],
  collections: [],
  products: [],
  productVariants: [],
  models: [],
  modelTypes: [],
  empty: false,
};

const renderTable = ({ insideListbox }: { insideListbox: boolean }) =>
  render(
    <MemoryRouter>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>
          <ResultsAsListboxOptionsContext.Provider value={insideListbox}>
            <ResultsTable data={data} />
          </ResultsAsListboxOptionsContext.Provider>
        </ThemeProvider>
      </IntlProvider>
    </MemoryRouter>,
  );

describe("ResultsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stays a table of links on its own", () => {
    // Arrange & Act
    renderTable({ insideListbox: false });

    // Assert
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  // A listbox may only own options, so inside the Navigator popup the rows are the
  // options and the table wrappers leave the accessibility tree.
  it("turns rows into options inside the Navigator listbox", () => {
    // Arrange & Act
    renderTable({ insideListbox: true });

    // Assert
    expect(screen.getByRole("option")).toHaveAttribute("data-href");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByRole("row")).not.toBeInTheDocument();
    expect(screen.queryByRole("rowgroup")).not.toBeInTheDocument();
  });

  // An option's content is presentational, so a nested link would be dropped by
  // assistive technology while still trapping focus.
  it("holds no nested link inside an option", () => {
    // Arrange & Act
    renderTable({ insideListbox: true });

    // Assert
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("navigates from the option itself, now that its cells are not links", () => {
    // Arrange
    renderTable({ insideListbox: true });

    // Act
    screen.getByRole("option").click();

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/categories/Q2F0ZWdvcnk6MQ%3D%3D?");
  });
});
