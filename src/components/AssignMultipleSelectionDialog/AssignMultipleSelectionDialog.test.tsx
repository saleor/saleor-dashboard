import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";

import { AssignMultipleSelectionDialog } from "./AssignMultipleSelectionDialog";

// Mock the InfiniteScroll component
jest.mock("@dashboard/components/InfiniteScroll", () => ({
  InfiniteScroll: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

// Mock useSearchQuery hook
const mockUseSearchQuery = jest.fn(() => [
  "", // query
  jest.fn(), // onQueryChange
  jest.fn(), // queryReset
]);

jest.mock("@dashboard/hooks/useSearchQuery", () => ({
  __esModule: true,
  default: () => mockUseSearchQuery(),
}));

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>
  );
};

const mockItems = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
];

const defaultProps = {
  confirmButtonState: "default" as const,
  items: mockItems,
  loading: false,
  open: true,
  labels: {
    confirmBtn: "Confirm",
    title: "Select Items",
    label: "Search",
    placeholder: "Search items...",
  },
  onClose: jest.fn(),
  onFetch: jest.fn(),
  onFetchMore: jest.fn(),
  onSubmit: jest.fn(),
  hasMore: false,
  renderRow: (item: any) => <div>{item.name}</div>,
};

describe("AssignMultipleSelectionDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog with items", () => {
    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Select Items")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("should show search input", () => {
    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const searchInput = screen.getByRole("textbox", { name: /search/i });

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", "Search items...");
  });

  it("should call onFetch when typing in search input", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const searchInput = screen.getByRole("textbox", { name: /search/i });

    await user.type(searchInput, "test");

    expect(defaultProps.onFetch).toHaveBeenCalledWith("test");
  });

  it("should allow selecting multiple items", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    
    // Select first two items
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("should toggle item selection on click", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    
    // Select item
    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    // Deselect item
    await user.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
  });

  it("should submit selected items", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    
    // Select first and third items
    await user.click(checkboxes[0]);
    await user.click(checkboxes[2]);

    // Click confirm button
    const confirmButton = screen.getByRole("button", { name: "Confirm" });

    await user.click(confirmButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith([
      mockItems[0],
      mockItems[2],
    ]);
  });

  it("should submit empty array if no items selected", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });

    await user.click(confirmButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith([]);
  });

  it("should show loading spinner when loading", () => {
    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} loading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should show empty message when no items", () => {
    renderWithIntl(
      <AssignMultipleSelectionDialog
        {...defaultProps}
        items={[]}
        emptyMessage="No items found"
      />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("should show default empty message when no items and no custom message", () => {
    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} items={[]} />);

    expect(screen.getByText("No objects found")).toBeInTheDocument();
  });

  it("should preselect items based on selectedIds prop", () => {
    const selectedIds = { "1": true, "3": true };

    renderWithIntl(
      <AssignMultipleSelectionDialog
        {...defaultProps}
        selectedIds={selectedIds}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("should allow clicking on row to toggle selection", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const firstRow = screen.getByTestId("dialog-row");
    const firstCheckbox = screen.getAllByRole("checkbox")[0];

    await user.click(firstRow);
    expect(firstCheckbox).toBeChecked();

    await user.click(firstRow);
    expect(firstCheckbox).not.toBeChecked();
  });

  it("should call onClose when closing dialog", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignMultipleSelectionDialog {...defaultProps} />);

    const backButton = screen.getByRole("button", { name: /back/i });

    await user.click(backButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});