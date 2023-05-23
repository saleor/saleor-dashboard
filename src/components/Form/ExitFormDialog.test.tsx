import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ExitFormDialog from "./ExitFormDialog";

vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn(x => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
}));

vi.mock("@saleor/macaw-ui", () => ({
  useStyles: vi.fn(() => () => ({})),
  makeStyles: vi.fn(() => () => ({})),
  DialogHeader: vi.fn(() => () => <></>),
}));

describe("ExitFormDialog", () => {
  it("closes when ignore changes is clicked", async () => {
    // Arrange
    const props = {
      onClose: vi.fn(),
      onLeave: vi.fn(),
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
      onClose: vi.fn(),
      onLeave: vi.fn(),
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
