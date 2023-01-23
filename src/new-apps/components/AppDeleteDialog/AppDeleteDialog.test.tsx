import { ActionDialogProps } from "@dashboard/components/ActionDialog";
import { render } from "@testing-library/react";
import React from "react";

import AppDeleteDialog from "./AppDeleteDialog";
import { AppDeleteDialogContentProps } from "./AppDeleteDialogContent";
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

jest.mock("./AppDeleteDialogContent", () => props => {
  mockContentComponent(props);
  return <></>;
});

beforeEach(() => {
  mockDialogComponent.mockClear();
  mockContentComponent.mockClear();
});

describe("Apps AppDeleteDialog", () => {
  it("displays app dialog with app name when external app with app name passed", () => {
    // Arrange
    const name = "Test App";
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    // Act
    render(
      <AppDeleteDialog
        confirmButtonState="default"
        open={true}
        name={name}
        type="EXTERNAL"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    // Assert
    expect(mockDialogComponent).toHaveBeenCalledWith({
      children: expect.anything(),
      confirmButtonState: "default",
      title: msgs.deleteAppTitle.defaultMessage,
      open: true,
      variant: "delete",
      onClose,
      onConfirm,
    } as ActionDialogProps);
    expect(mockContentComponent).toHaveBeenCalledWith({
      name,
      type: "EXTERNAL",
    } as AppDeleteDialogContentProps);
  });
});
