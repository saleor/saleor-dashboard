import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { AuthField } from "./AuthField";

describe("AuthField", () => {
  it("ties the label and the error message to the input", () => {
    // Arrange & Act
    render(<AuthField id="password" label="Password" error helperText="Password is required" />);

    // Assert
    const input = screen.getByLabelText("Password");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "password-helper");
    expect(screen.getByText("Password is required")).toHaveAttribute("id", "password-helper");
  });

  it("shows and hides the password with the toggle", async () => {
    // Arrange
    render(
      <AuthField
        id="password"
        label="Password"
        showPasswordToggle
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
      />,
    );

    const input = screen.getByLabelText("Password");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));

    // Assert
    expect(input).toHaveAttribute("type", "text");

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));

    // Assert
    expect(input).toHaveAttribute("type", "password");
  });

  it("disables the toggle together with the input", () => {
    // Arrange & Act
    render(<AuthField id="password" label="Password" showPasswordToggle disabled />);

    // Assert
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();
  });
});
