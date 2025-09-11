import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { IntlProvider } from "react-intl";

import { AssignSingleSelectionDialog } from "./AssignSingleSelectionDialog";

// Mock the InfiniteScroll component
jest.mock("@dashboard/components/InfiniteScroll", () => ({
  InfiniteScroll: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

// Mock useSearchQuery hook  
const mockOnQueryChange = jest.fn();
const mockQueryReset = jest.fn();

jest.mock("@dashboard/hooks/useSearchQuery", () => ({
  __esModule: true,
  default: (onFetch: (query: string) => void) => [
    "", 
    (event: { target: { value: string } }) => {
      onFetch(event.target.value);
      mockOnQueryChange(event);
    }, 
    mockQueryReset
  ],
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
    title: "Select Item",
    label: "Search",
    placeholder: "Search items...",
  },
  onClose: jest.fn(),
  onFetch: jest.fn(),
  onFetchMore: jest.fn(),
  onSubmit: jest.fn(),
  hasMore: false,
  renderItem: (item: any) => <div>{item.name}</div>,
};

describe("AssignSingleSelectionDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnQueryChange.mockClear();
    mockQueryReset.mockClear();
  });

  it("should render dialog with items", () => {
    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Select Item")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("should show search input", () => {
    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    const searchInput = screen.getByLabelText("Search");

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", "Search items...");
  });

  it("should call onFetch when typing in search input", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    const searchInput = screen.getByLabelText("Search");

    await user.type(searchInput, "x");

    expect(defaultProps.onFetch).toHaveBeenCalledWith("x");
    expect(defaultProps.onFetch).toHaveBeenCalledTimes(1);
  });

  it("should allow selecting an item", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    // Click on the first dialog row (multiple items have the same test id)
    const dialogRows = screen.getAllByTestId("dialog-row");

    await user.click(dialogRows[0]);

    // Check if the radio button with role "radio" and value "1" is selected
    const radioButton = document.querySelector('[role="radio"][value="1"]');

    expect(radioButton).toHaveAttribute('aria-checked', 'true');
  });

  it("should submit selected item", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    // Select first item
    const dialogRows = screen.getAllByTestId("dialog-row");

    await user.click(dialogRows[0]);

    // Click confirm button
    const confirmButton = screen.getByRole("button", { name: "Confirm" });

    await user.click(confirmButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith([mockItems[0]]);
  });

  it("should submit empty array if no item selected", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });

    await user.click(confirmButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith([]);
  });

  it("should show loading spinner when loading", () => {
    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} loading />);

    // The spinner should be rendered somewhere in the component
    const spinner = document.querySelector('[data-macaw-ui-component="Spinner"]');

    expect(spinner).toBeInTheDocument();
  });

  it("should show empty message when no items", () => {
    renderWithIntl(
      <AssignSingleSelectionDialog
        {...defaultProps}
        items={[]}
        emptyMessage="No items found"
      />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("should show default empty message when no items and no custom message", () => {
    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} items={[]} />);

    expect(screen.getByText("No objects found")).toBeInTheDocument();
  });

  it("should preselect item based on selectedId prop", () => {
    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} selectedId="2" />);

    const radioButton = document.querySelector('[role="radio"][value="2"]');

    expect(radioButton).toHaveAttribute('aria-checked', 'true');
  });

  it("should call onClose when closing dialog", async () => {
    const user = userEvent.setup();

    renderWithIntl(<AssignSingleSelectionDialog {...defaultProps} />);

    const backButton = screen.getByRole("button", { name: /back/i });

    await user.click(backButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});