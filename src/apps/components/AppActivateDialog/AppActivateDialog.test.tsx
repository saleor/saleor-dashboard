import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import React from "react";

import AppActivateDialog from "./AppActivateDialog";
import msgs from "./messages";

describe("Apps AppActivateDialog", () => {
  it("displays action text with app name when app name passed", () => {
    // Arrange
    const name = "Test App";
    render(
      <Wrapper>
        <AppActivateDialog
          confirmButtonState="default"
          open={true}
          name={name}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );
    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.activateNamedApp.defaultMessage.replace("{name}", name);
    expect(dialogContent).toHaveTextContent(expectedText);
  });
  it("displays action text without app name when app name is empty", () => {
    // Arrange
    render(
      <Wrapper>
        <AppActivateDialog
          confirmButtonState="default"
          open={true}
          name={""}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );
    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.activateApp.defaultMessage;
    expect(dialogContent).toHaveTextContent(expectedText);
  });
  it("displays action text without app name when app name is null", () => {
    // Arrange
    render(
      <Wrapper>
        <AppActivateDialog
          confirmButtonState="default"
          open={true}
          name={null}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );
    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.activateApp.defaultMessage;
    expect(dialogContent).toHaveTextContent(expectedText);
  });
});
