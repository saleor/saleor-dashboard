import ExitFormDialogProvider from "@dashboard/components/Form/ExitFormDialogProvider";
import { customerType } from "@dashboard/customerTypes/fixtures";
import { customerTypesPath } from "@dashboard/customerTypes/urls";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, type MemoryHistory } from "history";
import { Route, Router } from "react-router-dom";

import { CustomerTypeDetailsPage } from "./CustomerTypeDetailsPage";

jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: () => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
jest.mock("../CustomerTypeAttributes/CustomerTypeAttributes", () => ({
  CustomerTypeAttributes: () => <div data-test-id="customer-type-attributes-mock" />,
}));

const listPath = customerTypesPath;
const detailPath = `/customer-types/${customerType.id}`;

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
  onSetDefault: jest.fn(),
  onShowMetadata: jest.fn(),
  onSubmit: jest.fn(),
};

const renderPage = (history: MemoryHistory): void => {
  render(
    <Router history={history}>
      <ExitFormDialogProvider>
        <ThemeProvider>
          <Route path="/customer-types/:id">
            <CustomerTypeDetailsPage {...defaultProps} customerType={customerType} />
          </Route>
          <Route path={listPath}>
            <div data-test-id="customer-type-list-page" />
          </Route>
        </ThemeProvider>
      </ExitFormDialogProvider>
    </Router>,
  );
};

describe("CustomerTypeDetailsPage dirty state", () => {
  it("blocks navigation when the name field is edited", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [detailPath] });

    renderPage(history);

    // Act
    await user.clear(screen.getByTestId("customer-type-name"));
    await user.type(screen.getByTestId("customer-type-name"), "Updated customer type");
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
    await user.clear(screen.getByTestId("customer-type-name"));
    await user.type(screen.getByTestId("customer-type-name"), "Updated customer type");
    await user.clear(screen.getByTestId("customer-type-name"));
    await user.type(screen.getByTestId("customer-type-name"), customerType.name);
    await user.click(screen.getByTestId("app-header-back-button"));

    // Assert
    expect(screen.queryByTestId("ignore-changes")).not.toBeInTheDocument();
    expect(history.location.pathname).toBe(listPath);
  });
});
