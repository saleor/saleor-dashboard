import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ExitFormDialog from "./ExitFormDialog";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));
jest.mock("@saleor/macaw-ui", () => ({
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  // eslint-disable-next-line react/display-name
  DialogHeader: jest.fn(() => () => <></>),
}));
describe("ExitFormDialog", () => {
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
    await user.click(getByTestId("keep-editing"));
    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });
});
