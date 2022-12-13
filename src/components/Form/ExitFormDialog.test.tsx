import { render } from "@testing-library/react";
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
  DialogHeader: jest.fn(() => () => <></>),
}));

describe("ExitFormDialog", () => {
  it("closes when ignore changes is clicked", () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };

    // Act
    const { getByTestId } = render(<ExitFormDialog {...props} />);
    const button = getByTestId("ignore-changes");
    button.click();

    // Assert
    expect(props.onLeave).toHaveBeenCalled();
  });
  it("closes when keep editing is clicked", () => {
    // Arrange
    const props = {
      onClose: jest.fn(),
      onLeave: jest.fn(),
      isOpen: true,
    };

    // Act
    const { getByTestId } = render(<ExitFormDialog {...props} />);
    const button = getByTestId("keep-editing");
    button.click();

    // Assert
    expect(props.onClose).toHaveBeenCalled();
  });
});
