import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";

import AssignModelDialog from "./AssignModelDialog";

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  defineMessages: (messages: Record<string, unknown>) => messages,
}));

jest.mock("../ModalFilters/entityConfigs/ModalPageFilterProvider", () => ({
  ModalPageFilterProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useModalPageFilterContext: () => ({
    combinedFilters: { where: {} },
    clearFilters: jest.fn(),
  }),
}));

jest.mock("../ModalFilters/ModalFilters", () => ({
  ModalFilters: () => <div data-testid="modal-filters">Modal Filters</div>,
}));

jest.mock("@dashboard/hooks/useModalDialogOpen", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@dashboard/hooks/useModalSearchWithFilters", () => ({
  useModalSearchWithFilters: () => ({
    query: "",
    onQueryChange: jest.fn(),
    resetQuery: jest.fn(),
  }),
}));

const mockPages = [
  {
    __typename: "Page" as const,
    id: "page-1",
    title: "Test Page 1",
  },
  {
    __typename: "Page" as const,
    id: "page-2",
    title: "Test Page 2",
  },
  {
    __typename: "Page" as const,
    id: "page-3",
    title: "Test Page 3",
  },
];

const defaultProps = {
  confirmButtonState: "default" as const,
  pages: mockPages,
  loading: false,
  hasMore: false,
  onFetchMore: jest.fn(),
  onSubmit: jest.fn(),
  onClose: jest.fn(),
  open: true,
};

describe("AssignModelDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Multiple selection mode", () => {
    it("should render component in multiple selection mode", () => {
      // Arrange & Act
      render(<AssignModelDialog {...defaultProps} selectionMode="multiple" />);

      // Assert
      expect(screen.getByText("Assign Model")).toBeInTheDocument();
      expect(screen.getByText("Test Page 1")).toBeInTheDocument();
      expect(screen.getByText("Test Page 2")).toBeInTheDocument();
      expect(screen.getByText("Test Page 3")).toBeInTheDocument();
    });

    it("should show checkboxes in multiple selection mode", () => {
      // Arrange & Act
      render(<AssignModelDialog {...defaultProps} selectionMode="multiple" />);

      // Assert
      const checkboxes = screen.getAllByRole("checkbox");

      expect(checkboxes).toHaveLength(3);
    });

    it("should call onSubmit with selected items when multiple pages are selected", async () => {
      // Arrange
      const onSubmit = jest.fn();

      render(<AssignModelDialog {...defaultProps} selectionMode="multiple" onSubmit={onSubmit} />);

      const user = userEvent.setup();

      // Act
      const checkboxes = screen.getAllByRole("checkbox");

      await user.click(checkboxes[0]);
      await user.click(checkboxes[2]);

      const submitButton = screen.getByTestId("assign-and-save-button");

      await user.click(submitButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledWith([
        { id: "page-1", name: "Test Page 1" },
        { id: "page-3", name: "Test Page 3" },
      ]);
    });
  });

  describe("Single selection mode", () => {
    it("should render component in single selection mode", () => {
      // Arrange & Act
      render(<AssignModelDialog {...defaultProps} selectionMode="single" />);

      // Assert
      expect(screen.getByText("Assign Model")).toBeInTheDocument();
      expect(screen.getByText("Test Page 1")).toBeInTheDocument();
      expect(screen.getByText("Test Page 2")).toBeInTheDocument();
      expect(screen.getByText("Test Page 3")).toBeInTheDocument();
    });

    it("should show radio buttons in single selection mode", () => {
      // Arrange & Act
      render(<AssignModelDialog {...defaultProps} selectionMode="single" />);

      // Assert
      const radios = screen.getAllByRole("radio");

      expect(radios).toHaveLength(3);
    });

    it("should call onSubmit with selected item in single selection mode", async () => {
      // Arrange
      const onSubmit = jest.fn();

      render(<AssignModelDialog {...defaultProps} selectionMode="single" onSubmit={onSubmit} />);

      const user = userEvent.setup();

      // Act
      const radios = screen.getAllByRole("radio");

      await user.click(radios[1]);

      const submitButton = screen.getByTestId("assign-and-save-button");

      await user.click(submitButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledWith([{ id: "page-2", name: "Test Page 2" }]);
    });

    it("should allow deselecting in single selection mode by clicking the same radio", async () => {
      // Arrange
      const onSubmit = jest.fn();

      render(<AssignModelDialog {...defaultProps} selectionMode="single" onSubmit={onSubmit} />);

      const user = userEvent.setup();

      // Act
      const radios = screen.getAllByRole("radio");

      await user.click(radios[0]);
      await user.click(radios[0]);

      const submitButton = screen.getByTestId("assign-and-save-button");

      await user.click(submitButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledWith([]);
    });
  });

  it("should show loading indicator when loading is true", () => {
    // Arrange & Act
    render(<AssignModelDialog {...defaultProps} loading={true} />);
    expect(screen.getByPlaceholderText("Search Models")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show 'no models available' message when pages array is empty", () => {
    // Arrange & Act
    render(<AssignModelDialog {...defaultProps} pages={[]} loading={false} />);

    // Assert
    expect(screen.getByText("No models available")).toBeInTheDocument();
  });

  it("should call onClose when back button is clicked", async () => {
    // Arrange
    const onClose = jest.fn();

    render(<AssignModelDialog {...defaultProps} onClose={onClose} />);

    const user = userEvent.setup();

    // Act
    const backButton = screen.getByRole("button", { name: /back/i });

    await user.click(backButton);

    // Assert
    expect(onClose).toHaveBeenCalled();
  });
});
