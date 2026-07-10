import ExitFormDialogProvider from "@dashboard/components/Form/ExitFormDialogProvider";
import { pageType } from "@dashboard/modelTypes/fixtures";
import { modelTypesPath } from "@dashboard/modelTypes/urls";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, type MemoryHistory } from "history";
import { Route, Router } from "react-router-dom";

import PageTypeDetailsPage from "./PageTypeDetailsPage";

jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: () => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({
    PAGE_TYPE_DETAILS_MORE_ACTIONS: [],
  }),
}));
jest.mock("../PageTypeAttributes/PageTypeAttributes", () => ({
  __esModule: true,
  default: () => <div data-test-id="page-type-attributes-mock" />,
}));

const listPath = modelTypesPath;
const detailPath = `/model-types/${pageType.id}`;

const defaultProps = {
  disabled: false,
  errors: [],
  saveButtonBarState: "default" as const,
  attributeList: {
    isChecked: () => false,
    selected: 0,
    toggle: jest.fn(),
    toggleAll: jest.fn(),
    toolbar: null,
  },
  onAttributeAdd: jest.fn(),
  onAttributeCreate: jest.fn(),
  onAttributeReorder: jest.fn(),
  onAttributeUnassign: jest.fn(),
  onDelete: jest.fn(),
  onShowMetadata: jest.fn(),
  onSubmit: jest.fn(),
};

const renderPage = (history: MemoryHistory): void => {
  render(
    <Router history={history}>
      <ExitFormDialogProvider>
        <ThemeProvider>
          <Route path="/model-types/:id">
            <PageTypeDetailsPage {...defaultProps} pageType={pageType} />
          </Route>
          <Route path={listPath}>
            <div data-test-id="model-type-list-page" />
          </Route>
        </ThemeProvider>
      </ExitFormDialogProvider>
    </Router>,
  );
};

describe("PageTypeDetailsPage dirty state", () => {
  it("blocks navigation when the name field is edited", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(history);

    // Act
    await user.clear(screen.getByTestId("page-type-name"));
    await user.type(screen.getByTestId("page-type-name"), "Updated model type");
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.getByTestId("ignore-changes")).toBeInTheDocument();
    expect(history.location.pathname).toBe(detailPath);
  });

  it("allows navigation when the form is pristine", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(history);

    // Act
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.queryByTestId("ignore-changes")).not.toBeInTheDocument();
    expect(history.location.pathname).toBe(listPath);
  });

  it("clears dirty state when the name is reverted", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(history);

    // Act
    await user.clear(screen.getByTestId("page-type-name"));
    await user.type(screen.getByTestId("page-type-name"), "Updated model type");
    await user.clear(screen.getByTestId("page-type-name"));
    await user.type(screen.getByTestId("page-type-name"), pageType.name);
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.queryByTestId("ignore-changes")).not.toBeInTheDocument();
    expect(history.location.pathname).toBe(listPath);
  });
});
