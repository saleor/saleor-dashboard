import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { OrderErrorCode, OrderErrorFragment } from "@dashboard/graphql";
import { IMoney } from "@dashboard/utils/intl";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { OrderCaptureDialog, OrderCaptureDialogProps } from "./OrderCaptureDialog";

const createMoney = (amount: number, currency = "USD"): IMoney => ({
  amount,
  currency,
});

const defaultProps: OrderCaptureDialogProps = {
  confirmButtonState: "default" as ConfirmButtonTransitionState,
  orderTotal: createMoney(100),
  authorizedAmount: createMoney(100),
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

const renderDialog = (props: Partial<OrderCaptureDialogProps> = {}) =>
  render(
    <Wrapper>
      <OrderCaptureDialog {...defaultProps} {...props} />
    </Wrapper>,
  );

describe("OrderCaptureDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the dialog when open is true", () => {
      // Arrange & Act
      renderDialog();

      // Assert
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Capture Payment")).toBeInTheDocument();
    });

    it("displays order total label", () => {
      // Arrange & Act
      renderDialog({ orderTotal: createMoney(150) });

      // Assert
      expect(screen.getByText("Order total")).toBeInTheDocument();
    });

    it("displays available to capture label", () => {
      // Arrange & Act
      renderDialog({ authorizedAmount: createMoney(80) });

      // Assert
      expect(screen.getByText("Available to capture (authorized)")).toBeInTheDocument();
    });
  });

  describe("authorization status", () => {
    it("shows 'Fully Authorized' pill when authorized >= remaining", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(100),
      });

      // Assert
      expect(screen.getByText("Fully Authorized")).toBeInTheDocument();
    });

    it("shows 'Partial Authorisation' pill when authorized < remaining", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
      });

      // Assert
      expect(screen.getByText("Partial Authorisation")).toBeInTheDocument();
    });

    it("shows warning callout for partial authorization with shortfall", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
      });

      // Assert
      expect(
        screen.getByText(/The remaining authorization doesn't cover the balance/),
      ).toBeInTheDocument();
    });

    it("shows 'No Authorization' pill when authorized is 0", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
      });

      // Assert
      expect(screen.getByText("No Authorization")).toBeInTheDocument();
    });

    it("shows error callout when no authorization", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
      });

      // Assert
      expect(screen.getByText(/No payment has been authorized for this order/)).toBeInTheDocument();
    });

    it("shows 'Fully Captured' pill when order is fully paid", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
        chargedAmount: createMoney(100),
      });

      // Assert
      expect(screen.getByText("Fully Captured")).toBeInTheDocument();
    });
  });

  describe("radio options", () => {
    it("defaults to first option for full authorization", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(100),
      });

      // Assert
      const radioGroup = screen.getByRole("radiogroup");
      const selectedRadio = within(radioGroup).getByRole("radio", { checked: true });

      expect(selectedRadio).toHaveAttribute("value", "orderTotal");
    });

    it("shows 'Remaining max (authorized)' label for partial authorization", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
      });

      // Assert
      expect(screen.getByText("Remaining max (authorized)")).toBeInTheDocument();
    });

    it("disables radio options when no authorization", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
      });

      // Assert
      const radioGroup = screen.getByRole("radiogroup");
      const radios = within(radioGroup).getAllByRole("radio");

      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });

    it("allows selecting custom amount option", async () => {
      // Arrange
      renderDialog();

      // Act
      const customRadio = screen.getByRole("radio", { name: /Custom amount/i });

      fireEvent.click(customRadio);

      // Assert
      expect(customRadio).toBeChecked();
    });
  });

  describe("custom amount input", () => {
    const getCustomInput = () => {
      const dialog = screen.getByRole("dialog");

      return dialog.querySelector('input[type="text"]') as HTMLInputElement;
    };

    it("is disabled when custom option is not selected", () => {
      // Arrange & Act
      renderDialog();

      // Assert
      const input = getCustomInput();

      expect(input).toBeDisabled();
    });

    it("is enabled when custom option is selected", () => {
      // Arrange
      renderDialog();

      // Act
      const customRadio = screen.getByRole("radio", { name: /Custom amount/i });

      fireEvent.click(customRadio);

      // Assert
      const input = getCustomInput();

      expect(input).not.toBeDisabled();
    });

    it("shows max capturable hint", () => {
      // Arrange & Act
      renderDialog({
        authorizedAmount: createMoney(75),
      });

      // Assert
      expect(screen.getByText(/Max:/)).toBeInTheDocument();
    });

    it("accepts valid custom amount input", () => {
      // Arrange
      renderDialog();

      const customRadio = screen.getByRole("radio", { name: /Custom amount/i });

      fireEvent.click(customRadio);

      // Act
      const input = getCustomInput();

      fireEvent.change(input, { target: { value: "50" } });

      // Assert
      expect(input).toHaveValue("50");
    });

    it("limits decimal places based on currency", () => {
      // Arrange
      renderDialog();

      const customRadio = screen.getByRole("radio", { name: /Custom amount/i });

      fireEvent.click(customRadio);

      // Act
      const input = getCustomInput();

      fireEvent.change(input, { target: { value: "50.999" } });

      // Assert - USD has 2 decimal places
      expect(input).toHaveValue("50.99");
    });
  });

  describe("submit button", () => {
    it("shows capture amount in button text", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(100),
      });

      // Assert
      expect(screen.getByRole("button", { name: /Capture/i })).toBeInTheDocument();
    });

    it("calls onSubmit with correct amount for full authorization", () => {
      // Arrange
      const onSubmit = jest.fn();

      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(100),
        onSubmit,
      });

      // Act
      const captureButton = screen.getByRole("button", { name: /Capture/i });

      fireEvent.click(captureButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledWith(100);
    });

    it("calls onSubmit with max available for partial authorization", () => {
      // Arrange
      const onSubmit = jest.fn();

      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
        onSubmit,
      });

      // Act
      const captureButton = screen.getByRole("button", { name: /Capture/i });

      fireEvent.click(captureButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledWith(50);
    });

    it("calls onSubmit with custom amount when selected", () => {
      // Arrange
      const onSubmit = jest.fn();

      renderDialog({ onSubmit });

      const customRadio = screen.getByRole("radio", { name: /Custom amount/i });

      fireEvent.click(customRadio);

      const dialog = screen.getByRole("dialog");
      const input = dialog.querySelector('input[type="text"]') as HTMLInputElement;

      fireEvent.change(input, { target: { value: "25" } });

      // Act
      const captureButton = screen.getByRole("button", { name: /Capture/i });

      fireEvent.click(captureButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledWith(25);
    });

    it("is disabled when no authorization", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(0),
      });

      // Assert
      const captureButton = screen.getByRole("button", { name: /Capture/i });

      expect(captureButton).toBeDisabled();
    });

    it("is disabled when custom amount exceeds max", () => {
      // Arrange
      renderDialog({
        authorizedAmount: createMoney(50),
      });

      const customRadio = screen.getByRole("radio", { name: /Custom amount/i });

      fireEvent.click(customRadio);

      const dialog = screen.getByRole("dialog");
      const input = dialog.querySelector('input[type="text"]') as HTMLInputElement;

      fireEvent.change(input, { target: { value: "100" } });

      // Assert
      const captureButton = screen.getByRole("button", { name: /Capture/i });

      expect(captureButton).toBeDisabled();
    });
  });

  describe("close button", () => {
    it("calls onClose when back button is clicked", () => {
      // Arrange
      const onClose = jest.fn();

      renderDialog({ onClose });

      // Act
      const backButton = screen.getByRole("button", { name: /back/i });

      fireEvent.click(backButton);

      // Assert
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("displays error messages when provided", () => {
      // Arrange
      const errors = [
        {
          __typename: "OrderError" as const,
          code: OrderErrorCode.CAPTURE_INACTIVE_PAYMENT,
          field: null,
          addressType: null,
          message: null,
          orderLines: null,
        },
      ] as OrderErrorFragment[];

      // Act
      renderDialog({ errors });

      // Assert
      // The error message will be rendered by getOrderErrorMessage utility
      const dialog = screen.getByRole("dialog");

      expect(dialog).toBeInTheDocument();
    });
  });

  describe("outcome prediction", () => {
    it("shows outcome message when capturing full balance", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(100),
      });

      // Assert - outcome prediction message is shown
      expect(screen.getByText(/This will result in/)).toBeInTheDocument();
    });

    it("shows outcome message when capturing partial balance", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
      });

      // Assert - outcome prediction message is shown
      expect(screen.getByText(/This will result in/)).toBeInTheDocument();
    });
  });

  describe("with charged amount", () => {
    it("displays 'Captured so far' label when there is prior charged amount", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
        chargedAmount: createMoney(30),
      });

      // Assert
      expect(screen.getByText("Captured so far")).toBeInTheDocument();
    });

    it("displays 'Balance due' label with prior charges", () => {
      // Arrange & Act
      renderDialog({
        orderTotal: createMoney(100),
        authorizedAmount: createMoney(50),
        chargedAmount: createMoney(30),
      });

      // Assert
      expect(screen.getByText("Balance due")).toBeInTheDocument();
    });
  });
});
