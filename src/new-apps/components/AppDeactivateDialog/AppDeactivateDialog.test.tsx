import { ActionDialogProps } from "@dashboard/components/ActionDialog";
import { buttonMessages } from "@dashboard/intl";
import { render } from "@testing-library/react";
import React from "react";

import AppDeactivateDialog from "./AppDeactivateDialog";
import { AppDeactivateDialogContentProps } from "./AppDeactivateDialogContent";
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

jest.mock("./AppDeactivateDialogContent", () => props => {
  mockContentComponent(props);
  return <></>;
});

beforeEach(() => {
  mockDialogComponent.mockClear();
  mockContentComponent.mockClear();
});

describe("Apps AppDeactivateDialog", () => {
  it("displays dialog with app name when third-party app name passed", () => {
    // Arrange
    const name = "Test App";
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    // Act
    render(
      <AppDeactivateDialog
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
      confirmButtonLabel: buttonMessages.deactivate.defaultMessage,
      confirmButtonState: "default",
      title: msgs.deactivateAppTitle.defaultMessage,
      open: true,
      variant: "delete",
      onClose,
      onConfirm,
    } as ActionDialogProps);
    expect(mockContentComponent).toHaveBeenCalledWith({
      name,
      thirdParty: true,
    } as AppDeactivateDialogContentProps);
  });
});
