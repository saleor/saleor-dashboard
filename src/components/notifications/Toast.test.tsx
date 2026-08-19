import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { toast } from "sonner";

import { Toast, type ToastProps } from "./Toast";

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
    <IntlProvider locale="en" messages={{}}>
      <ThemeProvider>
        <Toast {...defaultProps} {...props} />
      </ThemeProvider>
    </IntlProvider>,
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
    it("calls onRemoved before toast.dismiss when close button is clicked", () => {
      // Arrange
      const onRemoved = jest.fn();

      renderToast({ id: "dismiss-test-id", onRemoved });

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Close notification" }));

      // Assert
      expect(onRemoved).toHaveBeenCalledTimes(1);
      expect(mockToastDismiss).toHaveBeenCalledWith("dismiss-test-id");
    });

    it("calls toast.dismiss when close button is clicked", () => {
      // Arrange
      renderToast({ id: "dismiss-test-id" });

      // Act
      fireEvent.click(screen.getByRole("button", { name: "Close notification" }));

      // Assert
      expect(mockToastDismiss).toHaveBeenCalledWith("dismiss-test-id");
    });
  });

  describe("progress hairline", () => {
    it("renders a progress indicator when duration is finite", () => {
      // Arrange & Act
      renderToast({ type: "success", duration: 6000 });

      // Assert
      expect(screen.getByTestId("toast-progress")).toBeInTheDocument();
    });

    it("does not render progress when duration is infinite", () => {
      // Arrange & Act
      renderToast({ type: "error", duration: Infinity });

      // Assert
      expect(screen.queryByTestId("toast-progress")).not.toBeInTheDocument();
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

    it("applies clamped description class for long copy", () => {
      // Arrange
      const longDescription = "This is a very long description that spans multiple lines. ".repeat(
        10,
      );

      // Act
      renderToast({ description: longDescription.trim() });

      // Assert
      const descriptionElement = screen.getByText(longDescription.trim());

      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement.className).toMatch(/descriptionTextClamped/);
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
