import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MetadataDialog, MetadataDialogProps } from "./MetadataDialog";

const defaultProps: MetadataDialogProps = {
  open: true,
  onClose: jest.fn(),
  onSave: jest.fn(),
  data: {
    metadata: [],
    privateMetadata: [],
  },
  onChange: jest.fn(),
  loading: false,
  disabled: false,
  formIsDirty: false,
};

describe("MetadataDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("close behavior without unsaved changes", () => {
    it("closes immediately when formIsDirty is false", async () => {
      // Arrange
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onClose={onClose} formIsDirty={false} />);

      // Act
      await user.click(screen.getByTestId("back"));

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not show ExitFormDialog when closing with clean form", async () => {
      // Arrange
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onClose={onClose} formIsDirty={false} />);

      // Act
      await user.click(screen.getByTestId("back"));

      // Assert
      expect(screen.queryByText("You have unsaved changes")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ignore-changes")).not.toBeInTheDocument();
    });
  });

  describe("close behavior with unsaved changes", () => {
    it("shows ExitFormDialog when trying to close with formIsDirty set to true", async () => {
      // Arrange
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onClose={onClose} formIsDirty={true} />);

      // Act
      await user.click(screen.getByTestId("back"));

      // Assert - ExitFormDialog should be visible
      expect(screen.getByTestId("ignore-changes")).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });

    it("keeps dialog open when 'Keep editing' is clicked in ExitFormDialog", async () => {
      // Arrange
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onClose={onClose} formIsDirty={true} />);

      // Act - open exit dialog
      await user.click(screen.getByTestId("back"));

      // Assert - exit dialog is visible
      expect(screen.getByTestId("ignore-changes")).toBeInTheDocument();

      // Act - click "Keep editing" (back button in ExitFormDialog)
      const exitDialog = screen
        .getByTestId("ignore-changes")
        .closest("[role='dialog']") as HTMLElement;
      const keepEditingButton = within(exitDialog).getAllByTestId("back")[0];

      await user.click(keepEditingButton);

      // Assert - exit dialog is closed, main dialog stays open, onClose not called
      expect(screen.queryByTestId("ignore-changes")).not.toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByTestId("save")).toBeInTheDocument();
    });

    it("closes dialog when 'Ignore changes' is clicked in ExitFormDialog", async () => {
      // Arrange
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onClose={onClose} formIsDirty={true} />);

      // Act - open exit dialog
      await user.click(screen.getByTestId("back"));

      // Act - click "Ignore changes"
      await user.click(screen.getByTestId("ignore-changes"));

      // Assert - onClose should be called
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when ExitFormDialog is shown", async () => {
      // Arrange
      const onClose = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onClose={onClose} formIsDirty={true} />);

      // Act
      await user.click(screen.getByTestId("back"));

      // Assert
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("save button behavior", () => {
    it("disables save button when formIsDirty is false", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} formIsDirty={false} />);

      // Assert
      expect(screen.getByTestId("save")).toBeDisabled();
    });

    it("enables save button when formIsDirty is true", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} formIsDirty={true} />);

      // Assert
      expect(screen.getByTestId("save")).not.toBeDisabled();
    });

    it("calls onSave when save button is clicked", async () => {
      // Arrange
      const onSave = jest.fn();
      const user = userEvent.setup();

      render(<MetadataDialog {...defaultProps} onSave={onSave} formIsDirty={true} />);

      // Act
      await user.click(screen.getByTestId("save"));

      // Assert
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it("disables save button when loading is true", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} formIsDirty={true} loading={true} />);

      // Assert
      expect(screen.getByTestId("save")).toBeDisabled();
    });

    it("disables save button when disabled is true", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} formIsDirty={true} disabled={true} />);

      // Assert
      expect(screen.getByTestId("save")).toBeDisabled();
    });
  });

  describe("dialog rendering", () => {
    it("renders with default title 'Metadata' when no title prop is provided", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} />);

      // Assert
      // The title "Metadata" appears both in header and MetadataCard components
      // Check that the dialog is rendered with any "Metadata" text
      const metadataTexts = screen.getAllByText("Metadata");

      expect(metadataTexts.length).toBeGreaterThanOrEqual(1);
    });

    it("renders with custom title when title prop is provided", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} title="Custom Title" />);

      // Assert
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("does not render when open is false", () => {
      // Arrange & Act
      render(<MetadataDialog {...defaultProps} open={false} />);

      // Assert
      expect(screen.queryByTestId("save")).not.toBeInTheDocument();
      expect(screen.queryByTestId("back")).not.toBeInTheDocument();
    });
  });
});
