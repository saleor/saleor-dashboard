import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { ApiUnreachablePage } from "./ApiUnreachablePage";

describe("ApiUnreachablePage", () => {
  it("names the API it is trying to reach and offers both ways out", () => {
    // Arrange
    const onRetry = jest.fn();
    const onSignIn = jest.fn();

    render(
      <ApiUnreachablePage
        apiHost="api.example.com"
        retrying={false}
        onRetry={onRetry}
        onSignIn={onSignIn}
      />,
      { wrapper: Wrapper },
    );

    // Act
    fireEvent.click(screen.getByTestId("api-unreachable-retry"));
    fireEvent.click(screen.getByTestId("api-unreachable-sign-in"));

    // Assert
    expect(screen.getByText("Can't reach Saleor")).toBeInTheDocument();
    expect(screen.getByText("Saleor API: api.example.com")).toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("can't be retried again while a retry is running", () => {
    // Arrange
    const onRetry = jest.fn();

    render(<ApiUnreachablePage apiHost={null} retrying onRetry={onRetry} onSignIn={jest.fn()} />, {
      wrapper: Wrapper,
    });

    // Act
    fireEvent.click(screen.getByTestId("api-unreachable-retry"));

    // Assert
    expect(onRetry).not.toHaveBeenCalled();
    expect(screen.queryByTestId("api-unreachable-host")).not.toBeInTheDocument();
  });
});
