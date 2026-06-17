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

  it("closes when ignore changes is clicked", async () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };
    const user = userEvent.setup();
    // Act
    const { getByTestId } = render(<ExitFormDialog {...props} />);

    await user.click(getByTestId("ignore-changes"));
    // Assert
    expect(props.onLeave).toHaveBeenCalled();
  });
  it("closes when keep editing is clicked", async () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };
    const user = userEvent.setup();
    // Act
    const { getByTestId } = render(<ExitFormDialog {...props} />);

    await user.click(getByTestId("back"));
    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });
});
