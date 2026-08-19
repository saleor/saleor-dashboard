import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ExitFormDialog from "./ExitFormDialog";

jest.mock("@saleor/macaw-ui", () => ({
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  // eslint-disable-next-line react/display-name
  DialogHeader: jest.fn(() => () => <></>),
}));
describe("ExitFormDialog", () => {
  it("does not call onClose when the modal opens", () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };

    // Act
    render(<ExitFormDialog {...props} />);

    // Assert
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("calls onLeave without onClose when ignore changes is clicked", async () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };
    const user = userEvent.setup();
    // Act
    const { getByTestId, rerender } = render(<ExitFormDialog {...props} />);

    await user.click(getByTestId("ignore-changes"));
    // Simulate parent closing the dialog after leave (same as ExitFormDialogProvider).
    rerender(<ExitFormDialog {...props} isOpen={false} />);
    // Assert
    expect(props.onLeave).toHaveBeenCalledTimes(1);
    expect(props.onClose).not.toHaveBeenCalled();
  });
  it("closes when keep editing is clicked", async () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
      description: "Media changes are already saved.",
    };
    const user = userEvent.setup();
    // Act
    const { getByTestId, getByText } = render(<ExitFormDialog {...props} />);

    expect(getByText("Media changes are already saved.")).toBeInTheDocument();
    await user.click(getByTestId("back"));
    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });
});
