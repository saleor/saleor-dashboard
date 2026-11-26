import { fireEvent, render, screen } from "@testing-library/react";
import { type FormEvent } from "react";

import { AuthButton } from "./AuthButton";

describe("AuthButton", () => {
  it("submits its form when it is a submit button", () => {
    // Arrange
    const onSubmit = jest.fn((event: FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <AuthButton type="submit">Log in</AuthButton>
      </form>,
    );

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("neither submits nor runs its click handler while loading", () => {
    // Arrange
    const onSubmit = jest.fn((event: FormEvent) => event.preventDefault());
    const onClick = jest.fn();

    render(
      <form onSubmit={onSubmit}>
        <AuthButton type="submit" loading onClick={onClick} data-test-id="submit">
          Log in
        </AuthButton>
      </form>,
    );

    // Act
    fireEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByTestId("submit")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("button-progress")).toBeInTheDocument();
  });

  it("shows its badge next to the label", () => {
    // Arrange & Act
    render(<AuthButton badge={<span>Last used</span>}>Log in</AuthButton>);

    // Assert
    expect(screen.getByRole("button")).toHaveTextContent("Log in");
    expect(screen.getByText("Last used")).toBeInTheDocument();
  });
});
