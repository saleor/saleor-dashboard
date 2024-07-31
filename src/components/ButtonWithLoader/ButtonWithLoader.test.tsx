import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ButtonWithLoader } from "./ButtonWithLoader";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

describe("ConfirmButton", () => {
  it("should render a button with confirm label", () => {
    // Arrange & Act
    render(<ButtonWithLoader transitionState="default">Confirm</ButtonWithLoader>);
    // Assert
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Confirm");
  });

  it("should render a button with loading spinner", () => {
    // Arrange & Act
    render(<ButtonWithLoader transitionState="loading" />);
    // Assert
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("button-progress")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    // Arrange
    const onClick = jest.fn();

    // Act
    render(<ButtonWithLoader transitionState="default" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));

    // Assert
    expect(onClick).toHaveBeenCalled();
  });

  it("should render original label after loading state", async () => {
    // Arrange & Act
    const { rerender } = render(
      <ButtonWithLoader transitionState="loading">Confirm</ButtonWithLoader>,
    );

    // Assert
    expect(screen.getByTestId("button-progress")).toBeInTheDocument();

    // Act
    rerender(<ButtonWithLoader transitionState="default">Confirm</ButtonWithLoader>);

    // Assert
    expect(screen.queryByTestId("button-progress")).not.toBeInTheDocument();
  });
});
