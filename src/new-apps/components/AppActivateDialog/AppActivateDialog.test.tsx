import { ActionDialogProps } from "@dashboard/components/ActionDialog";
import { buttonMessages } from "@dashboard/intl";
import { render } from "@testing-library/react";
import React from "react";

import AppActivateDialog from "./AppActivateDialog";
import { AppActivateDialogContentProps } from "./AppActivateDialogContent";
import msgs from "./messages";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

const mockDialogComponent = jest.fn();

jest.mock("@dashboard/components/ActionDialog", () => props => {
  mockDialogComponent(props);
  return <>{props.children}</>;
});

const mockContentComponent = jest.fn();

jest.mock("./AppActivateDialogContent", () => props => {
  mockContentComponent(props);
  return <></>;
});

beforeEach(() => {
  mockDialogComponent.mockClear();
  mockContentComponent.mockClear();
});

describe("Apps AppActivateDialog", () => {
  it("displays dialog with app name when app name passed", () => {
    // Arrange
    const name = "Test App";
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    // Act
    render(
      <AppActivateDialog
        confirmButtonState="default"
        open={true}
        name={name}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    // Assert
    expect(mockDialogComponent).toHaveBeenCalledWith({
      children: expect.anything(),
      confirmButtonLabel: buttonMessages.activate.defaultMessage,
      confirmButtonState: "default",
      title: msgs.activateAppTitle.defaultMessage,
      open: true,
      variant: "default",
      onClose,
      onConfirm,
    } as ActionDialogProps);
    expect(mockContentComponent).toHaveBeenCalledWith({
      name,
    } as AppActivateDialogContentProps);
  });
});
