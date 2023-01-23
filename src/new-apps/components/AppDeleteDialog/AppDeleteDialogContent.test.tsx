import { render } from "@testing-library/react";
import React from "react";

import AppDeleteDialogContent from "./AppDeleteDialogContent";
import msgs from "./messages";

const mockMessageComponent = jest.fn();

jest.mock("react-intl", () => ({
  defineMessages: jest.fn(x => x),
  FormattedMessage: props => {
    mockMessageComponent(props);
    return <></>;
  },
}));

beforeEach(() => {
  mockMessageComponent.mockClear();
});

describe("Apps AppDeleteDialogContent", () => {
  it("displays external app action text with app name when external app with app name passed", () => {
    // Arrange
    const name = "Test App";

    render(<AppDeleteDialogContent name={name} type="EXTERNAL" />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteNamedApp,
      }),
    );
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteAppQuestion,
      }),
    );

    // Act
    const text = render(mockMessageComponent.mock.calls[0][0].values.name);

    // Assert
    expect(text.container).toHaveTextContent(name);
  });

  it("displays custom app action text with app name when custom app with app name passed", () => {
    // Arrange
    const name = "Test App";

    // Act
    render(<AppDeleteDialogContent name={name} type="CUSTOM" />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteLocalNamedApp,
      }),
    );
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteAppQuestion,
      }),
    );

    // Act
    const text = render(mockMessageComponent.mock.calls[0][0].values.name);

    // Assert
    expect(text.container).toHaveTextContent(name);
  });

  it("displays external action text without app name when external app name is empty", () => {
    // Act
    render(<AppDeleteDialogContent name={""} type="EXTERNAL" />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteApp,
      }),
    );
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteAppQuestion,
      }),
    );
  });

  it("displays custom action text without app name when custom app name is empty", () => {
    // Act
    render(<AppDeleteDialogContent name={""} type="CUSTOM" />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteLocalApp,
      }),
    );
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteAppQuestion,
      }),
    );
  });

  it("displays external action text without app name when external app name is null", () => {
    // Act
    render(<AppDeleteDialogContent name={null} type="EXTERNAL" />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteApp,
      }),
    );
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteAppQuestion,
      }),
    );
  });

  it("displays custom action text without app name when custom app name is null", () => {
    // Act
    render(<AppDeleteDialogContent name={null} type="CUSTOM" />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteLocalApp,
      }),
    );
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deleteAppQuestion,
      }),
    );
  });
});
