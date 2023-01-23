import { render } from "@testing-library/react";
import React from "react";

import AppDeactivateDialogContent from "./AppDeactivateDialogContent";
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

describe("Apps AppDeactivateDialogContent", () => {
  it("displays action text with app name when app name passed", () => {
    // Arrange
    const name = "Test App";

    // Act
    render(<AppDeactivateDialogContent name={name} thirdParty={false} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deactivateNamedApp,
      }),
    );

    // Act
    const text = render(mockMessageComponent.mock.calls[0][0].values.name);

    // Assert
    expect(text.container).toHaveTextContent(name);
  });

  it("displays action text without app name when app name is empty", () => {
    // Act
    render(<AppDeactivateDialogContent name={""} thirdParty={false} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deactivateApp,
      }),
    );
  });

  it("displays action text without app name when app name is null", () => {
    // Act
    render(<AppDeactivateDialogContent name={null} thirdParty={false} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deactivateApp,
      }),
    );
  });

  it("displays billing warning when app is marked explicitly as third-party", () => {
    // Arrange
    const name = "Test App";

    // Act
    render(<AppDeactivateDialogContent name={name} thirdParty={true} />);

    // Assert
    expect(mockMessageComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deactivateAppBillingInfo,
      }),
    );
  });

  it("doesn't display billing warning when app is marked explicitly as not third-party", () => {
    // Arrange
    const name = "Test App";

    // Act
    render(<AppDeactivateDialogContent name={name} thirdParty={false} />);

    // Assert
    expect(mockMessageComponent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        ...msgs.deactivateAppBillingInfo,
      }),
    );
  });
});
