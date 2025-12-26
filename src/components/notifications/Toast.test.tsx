import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { Toast, ToastProps } from "./Toast";

jest.mock("sonner", () => ({
  toast: {
    dismiss: jest.fn(),
  },
}));

const mockToastDismiss = toast.dismiss as jest.Mock;

const defaultProps: ToastProps = {
  id: "test-toast-1",
  type: "info",
  title: "Test Title",
};

const renderToast = (props: Partial<ToastProps> = {}) =>
  render(
    <ThemeProvider>
      <Toast {...defaultProps} {...props} />
    </ThemeProvider>,
  );

describe("Toast", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders toast with title", () => {
      // Arrange & Act
      renderToast({ title: "Success Message" });

      // Assert
      expect(screen.getByText("Success Message")).toBeInTheDocument();
    });

    it("renders toast with description", () => {
      // Arrange & Act
      renderToast({
        title: "Title",
        description: "This is a detailed description",
      });

      // Assert
      expect(screen.getByText("This is a detailed description")).toBeInTheDocument();
    });

    it("renders without description when not provided", () => {
      // Arrange & Act
      renderToast({ title: "Title Only" });

      // Assert
      expect(screen.getByText("Title Only")).toBeInTheDocument();
      expect(screen.queryByText("description")).not.toBeInTheDocument();
    });

    it("renders action button when action is provided", () => {
      // Arrange & Act
      renderToast({
        action: {
          label: "Undo",
          onClick: jest.fn(),
        },
      });

      // Assert
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    });

    it("does not render action button when action is not provided", () => {
      // Arrange & Act
      renderToast();

      // Assert
      expect(screen.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument();
    });
  });

  describe("toast types", () => {
    it.each([
      ["success", "Success"],
      ["error", "Error"],
      ["warning", "Warning"],
      ["info", "Info"],
    ] as const)("renders %s toast with title", (type, title) => {
      // Arrange & Act
      renderToast({ type, title });

      // Assert
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  describe("close functionality", () => {
    it("calls toast.dismiss when close button is clicked", () => {
      // Arrange
      renderToast({ id: "dismiss-test-id" });

      // Act
      const closeButtons = screen.getAllByRole("button");
      const closeButton = closeButtons.find(btn => btn.querySelector("svg"));

      fireEvent.click(closeButton!);

      // Assert
      expect(mockToastDismiss).toHaveBeenCalledWith("dismiss-test-id");
    });
  });

  describe("action button", () => {
    it("calls action onClick when action button is clicked", () => {
      // Arrange
      const onClickMock = jest.fn();

      renderToast({
        action: {
          label: "Retry",
          onClick: onClickMock,
        },
      });

      // Act
      const actionButton = screen.getByRole("button", { name: "Retry" });

      fireEvent.click(actionButton);

      // Assert
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it("dismisses toast after action button is clicked", () => {
      // Arrange
      const onClickMock = jest.fn();

      renderToast({
        id: "action-dismiss-test",
        action: {
          label: "Retry",
          onClick: onClickMock,
        },
      });

      // Act
      const actionButton = screen.getByRole("button", { name: "Retry" });

      fireEvent.click(actionButton);

      // Assert
      expect(mockToastDismiss).toHaveBeenCalledWith("action-dismiss-test");
    });
  });

  describe("description truncation", () => {
    it("renders long description", () => {
      // Arrange
      const longDescription =
        "This is a very long description that might get truncated when displayed in the toast notification. It contains multiple sentences to ensure it exceeds the maximum allowed lines for display.";

      // Act
      renderToast({ description: longDescription });

      // Assert
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("renders description container with overflow styles", () => {
      // Arrange
      const longDescription = "This is a very long description that spans multiple lines. ".repeat(
        10,
      );

      // Act
      renderToast({ description: longDescription.trim() });

      // Assert - verify the container has the truncation styles applied
      const descriptionElement = screen.getByText(longDescription.trim());

      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveStyle({ overflow: "hidden" });
    });

    it("responds to mouse enter events on description container", async () => {
      // Arrange
      const description = "A description that can be hovered";

      renderToast({ description });

      // Act
      const descriptionElement = screen.getByText(description);
      const descriptionContainer = descriptionElement.closest('[class*="_18fs8ps"]');

      if (descriptionContainer) {
        fireEvent.mouseEnter(descriptionContainer);
        fireEvent.mouseLeave(descriptionContainer);
      }

      // Assert - the component handles mouse events without errors
      await waitFor(() => {
        expect(descriptionElement).toBeInTheDocument();
      });
    });
  });

  describe("ReactNode description", () => {
    it("renders JSX elements as description", () => {
      // Arrange
      const jsxDescription = (
        <span data-testid="jsx-description">
          <strong>Bold</strong> and <em>italic</em> text
        </span>
      );

      // Act
      renderToast({ description: jsxDescription });

      // Assert
      expect(screen.getByText("Bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
    });
  });
});
