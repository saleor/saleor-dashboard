import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import React from "react";

import AppDeactivateDialog from "./AppDeactivateDialog";
import msgs from "./messages";

describe("Apps AppDeactivateDialog", () => {
  it("displays action text with app name when third-party app name passed", () => {
    // Arrange
    const name = "Test App";

    render(
      <Wrapper>
        <AppDeactivateDialog
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
    const expectedActionText = msgs.deactivateNamedApp.defaultMessage.replace("{name}", name);
    const expectedBillingWarning = msgs.deactivateAppBillingInfo.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedActionText);
    expect(dialogContent).toHaveTextContent(expectedBillingWarning);
  });
  it("displays action text without app name when third-party app name is empty", () => {
    // Arrange
    render(
      <Wrapper>
        <AppDeactivateDialog
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
    const expectedText = msgs.deactivateApp.defaultMessage;
    const expectedBillingWarning = msgs.deactivateAppBillingInfo.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedBillingWarning);
  });
  it("displays action text without app name when third-party app name is null", () => {
    // Arrange
    render(
      <Wrapper>
        <AppDeactivateDialog
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
    const expectedText = msgs.deactivateApp.defaultMessage;
    const expectedBillingWarning = msgs.deactivateAppBillingInfo.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedBillingWarning);
  });
  it("displays billing warning when app is marked explicitly as third-party", () => {
    // Arrange
    const name = "Test App";

    render(
      <Wrapper>
        <AppDeactivateDialog
          confirmButtonState="default"
          open={true}
          name={name}
          thirdParty={true}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedBillingWarning = msgs.deactivateAppBillingInfo.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedBillingWarning);
  });
  it("doesn't display billing warning when app is marked explicitly as not third-party", () => {
    // Arrange
    const name = "Test App";

    render(
      <Wrapper>
        <AppDeactivateDialog
          confirmButtonState="default"
          open={true}
          name={name}
          thirdParty={false}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const notExpectedBillingWarning = msgs.deactivateAppBillingInfo.defaultMessage;

    expect(dialogContent).not.toHaveTextContent(notExpectedBillingWarning);
  });
});
