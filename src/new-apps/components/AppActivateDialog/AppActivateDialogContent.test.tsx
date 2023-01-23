import { render } from "@testing-library/react";
import React from "react";

import AppActivateDialogContent from "./AppActivateDialogContent";
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

describe("Apps AppActivateDialogContent", () => {
  it("displays action text with app name when app name passed", () => {
    // Arrange
    const name = "Test App";

    // Act
    render(<AppActivateDialogContent name={name} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.activateNamedApp,
      }),
    );

    // Act
    const text = render(mockMessageComponent.mock.calls[0][0].values.name);

    // Assert
    expect(text.container).toHaveTextContent(name);
  });

  it("displays action text without app name when app name is empty", () => {
    // Act
    render(<AppActivateDialogContent name={""} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.activateApp,
      }),
    );
  });

  it("displays action text without app name when app name is null", () => {
    // Act
    render(<AppActivateDialogContent name={null} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.activateApp,
      }),
    );
  });
});
