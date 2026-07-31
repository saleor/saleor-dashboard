import { type SearchActionContext } from "@dashboard/extensions/search-actions/resolveSearchActionContext";
import { type ContextualSearchAction } from "@dashboard/extensions/search-actions/types";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";

import { SearchActionsList } from "./SearchActionsList";

const context: SearchActionContext = {
  view: "PRODUCT_DETAILS",
  params: { productId: "UHJvZHVjdDox" },
};

// Neither label contains "avatax" - only the owning app's name does.
const actions: ContextualSearchAction[] = [
  {
    id: "extension-1",
    label: "Configure tax classes",
    section: "App actions",
    appName: "AvaTax",
    onSelect: () => undefined,
  },
  {
    id: "extension-2",
    label: "Sync to external catalog",
    section: "App actions",
    appName: "Catalog Sync",
    onSelect: () => undefined,
  },
];

const renderList = (query: string) =>
  render(
    <ThemeProvider>
      <SearchActionsList
        actions={actions}
        context={context}
        query={query}
        onActionSelected={() => undefined}
      />
    </ThemeProvider>,
  );

describe("SearchActionsList", () => {
  it("finds an action by its app name", () => {
    // Arrange & Act
    renderList("avatax");

    // Assert
    expect(screen.getByText("Configure tax classes")).toBeInTheDocument();
    expect(screen.queryByText("Sync to external catalog")).not.toBeInTheDocument();
  });

  it("tolerates a typo in the app name", () => {
    // Arrange & Act
    renderList("avtax");

    // Assert
    expect(screen.getByText("Configure tax classes")).toBeInTheDocument();
    expect(screen.queryByText("Sync to external catalog")).not.toBeInTheDocument();
  });

  it("still finds an action by its label", () => {
    // Arrange & Act
    renderList("tax classes");

    // Assert
    expect(screen.getByText("Configure tax classes")).toBeInTheDocument();
  });
});
