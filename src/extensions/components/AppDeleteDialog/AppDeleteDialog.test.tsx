import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import AppDeleteDialog from "./AppDeleteDialog";
import msgs from "./messages";

describe("Apps AppDeleteDialog", () => {
  it("displays external app action text with app name when external app with app name passed", () => {
    // Arrange
    const name = "Test App";

    render(
      <Wrapper>
        <AppDeleteDialog
          confirmButtonState="default"
          open={true}
          name={name}
          type="EXTERNAL"
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.deleteNamedApp.defaultMessage.replace("{name}", name);
    const expectedQuestion = msgs.deleteAppQuestion.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedQuestion);
  });
  it("displays custom app action text with app name when custom app with app name passed", () => {
    // Arrange
    const name = "Test App";

    render(
      <Wrapper>
        <AppDeleteDialog
          confirmButtonState="default"
          open={true}
          name={name}
          type="CUSTOM"
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.deleteLocalNamedApp.defaultMessage.replace("{name}", name);
    const expectedQuestion = msgs.deleteAppQuestion.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedQuestion);
  });
  it("displays external action text without app name when external app name is empty", () => {
    // Arrange
    render(
      <Wrapper>
        <AppDeleteDialog
          confirmButtonState="default"
          open={true}
          name={""}
          type="EXTERNAL"
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.deleteApp.defaultMessage;
    const expectedQuestion = msgs.deleteAppQuestion.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedQuestion);
  });
  it("displays custom action text without app name when custom app name is empty", () => {
    // Arrange
    render(
      <Wrapper>
        <AppDeleteDialog
          confirmButtonState="default"
          open={true}
          name={""}
          type="CUSTOM"
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.deleteLocalApp.defaultMessage;
    const expectedQuestion = msgs.deleteAppQuestion.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedQuestion);
  });
  it("displays external action text without app name when external app name is null", () => {
    // Arrange
    render(
      <Wrapper>
        <AppDeleteDialog
          confirmButtonState="default"
          open={true}
          name={null}
          type="EXTERNAL"
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.deleteApp.defaultMessage;
    const expectedQuestion = msgs.deleteAppQuestion.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedQuestion);
  });
  it("displays custom action text without app name when custom app name is null", () => {
    // Arrange
    render(
      <Wrapper>
        <AppDeleteDialog
          confirmButtonState="default"
          open={true}
          name={null}
          type="CUSTOM"
          onClose={jest.fn()}
          onConfirm={jest.fn()}
        />
      </Wrapper>,
    );

    const dialogContent = screen.getByTestId("dialog-content");
    // Assert
    const expectedText = msgs.deleteLocalApp.defaultMessage;
    const expectedQuestion = msgs.deleteAppQuestion.defaultMessage;

    expect(dialogContent).toHaveTextContent(expectedText);
    expect(dialogContent).toHaveTextContent(expectedQuestion);
  });
});
