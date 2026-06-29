// @ts-strict-ignore
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { ConfirmButton } from "./ConfirmButton";

describe("ConfirmButton", () => {
  it("should render a button with confirm label", () => {
    render(<ConfirmButton transitionState="default" labels={{ confirm: "Confirm" }} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Confirm");
  });
  it("should render a button with error label", () => {
    render(
      <ConfirmButton
        noTransition
        transitionState="error"
        labels={{ confirm: "Confirm", error: "Error" }}
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Error");
  });
  it("should render a button with loading spinner", () => {
    render(<ConfirmButton noTransition transitionState="loading" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("button-progress")).toBeInTheDocument();
  });
  it("should keep loading button enabled for primary styling and block interaction", () => {
    render(<ConfirmButton noTransition transitionState="loading" onClick={jest.fn()} />);

    const button = screen.getByRole("button");

    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(button).not.toHaveAttribute("disabled");
  });
  it("should not call onClick while loading", () => {
    const onClick = jest.fn();

    render(<ConfirmButton noTransition transitionState="loading" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
  it("should not call onClick while success feedback is shown", () => {
    const onClick = jest.fn();

    render(<ConfirmButton noTransition transitionState="success" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
  it("should call onClick in error state so user can try again", () => {
    const onClick = jest.fn();

    render(<ConfirmButton noTransition transitionState="error" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
  it("should render a button with success", () => {
    render(<ConfirmButton noTransition transitionState="success" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("button-success")).toBeInTheDocument();
  });
  it("should call onClick when clicked", () => {
    const onClick = jest.fn();

    render(<ConfirmButton transitionState="default" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
  it("should render confirm label after success state", async () => {
    const { rerender } = render(
      <ConfirmButton
        transitionState="loading"
        labels={{
          confirm: "Confirm",
          error: "Error",
        }}
      />,
    );

    expect(screen.getByTestId("button-progress")).toBeInTheDocument();
    rerender(
      <ConfirmButton
        transitionState="success"
        labels={{
          confirm: "Confirm",
          error: "Error",
        }}
      />,
    );
    expect(screen.getByTestId("button-success")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByTestId("button-success"), {
      timeout: 5000,
    });
    expect(screen.queryByTestId("button-success")).not.toBeInTheDocument();
  });
  it("should render error label after error state", async () => {
    const { rerender } = render(
      <ConfirmButton
        transitionState="loading"
        labels={{
          confirm: "Confirm",
          error: "Error",
        }}
      />,
    );

    expect(screen.getByTestId("button-progress")).toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    rerender(
      <ConfirmButton
        transitionState="error"
        labels={{
          confirm: "Confirm",
          error: "Error",
        }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("button-progress")).not.toBeInTheDocument();
  });
});
