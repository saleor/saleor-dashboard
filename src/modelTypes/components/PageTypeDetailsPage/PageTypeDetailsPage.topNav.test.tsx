import { pageType } from "@dashboard/modelTypes/fixtures";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

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
jest.mock("../PageTypeDetails/PageTypeDetails", () => ({
  __esModule: true,
  default: () => <div data-test-id="page-type-details-mock" />,
}));

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <MemoryRouter>
    <ThemeProvider>{children}</ThemeProvider>
  </MemoryRouter>
);

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

const renderPage = ({
  pageTypeProp,
  onShowMetadata = jest.fn(),
  onDelete = jest.fn(),
}: {
  pageTypeProp: typeof pageType | undefined;
  onShowMetadata?: () => void;
  onDelete?: () => void;
}): ReturnType<typeof render> =>
  render(
    <PageTypeDetailsPage
      {...defaultProps}
      pageType={pageTypeProp}
      onShowMetadata={onShowMetadata}
      onDelete={onDelete}
    />,
    { wrapper: Wrapper },
  );

describe("PageTypeDetailsPage top nav", () => {
  it("renders the metadata button", () => {
    // Arrange & Act
    renderPage({ pageTypeProp: pageType });

    // Assert
    expect(screen.getByTestId("show-model-type-metadata")).toBeInTheDocument();
  });

  it("calls onShowMetadata when the metadata button is clicked", () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ pageTypeProp: pageType, onShowMetadata });

    // Act
    screen.getByTestId("show-model-type-metadata").click();

    // Assert
    expect(onShowMetadata).toHaveBeenCalled();
  });

  it("disables the metadata button while page type data is loading", () => {
    // Arrange & Act
    renderPage({ pageTypeProp: undefined });

    // Assert
    expect(screen.getByTestId("show-model-type-metadata")).toBeDisabled();
  });

  it("calls onDelete from the cogs menu", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = jest.fn();

    renderPage({ pageTypeProp: pageType, onDelete });

    // Act
    await user.click(screen.getByTestId("show-more-button"));
    await user.click(screen.getByTestId("delete-model-type"));

    // Assert
    expect(onDelete).toHaveBeenCalled();
  });
});
