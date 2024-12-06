import "@testing-library/jest-dom/extend-expect";

import { fireEvent, render, screen } from "@testing-library/react";

import { SimpleRadioGroupField } from "./SimpleRadioGroupField";

const choices = [
  { label: "Choice 1", value: "choice1" },
  { label: "Choice 2", value: "choice2", disabled: true },
  { label: "Choice 3", value: "choice3" },
];

describe("SimpleRadioGroupField", () => {
  it("renders radio fields correctly", () => {
    // Arrange & Act
    render(
      <SimpleRadioGroupField
        name="testRadioGroup"
        value="choice1"
        onChange={jest.fn()}
        choices={choices}
      />,
    );

    // Assert
    expect(screen.getByText("Choice 1")).toBeInTheDocument();
    expect(screen.getByText("Choice 2")).toBeInTheDocument();
    expect(screen.getByText("Choice 3")).toBeInTheDocument();
  });

  it("calls onChange when a radio button is clicked", () => {
    // Arrange
    const handleChange = jest.fn();

    render(
      <SimpleRadioGroupField
        name="testRadioGroup"
        value="choice1"
        onChange={handleChange}
        choices={choices}
      />,
    );

    // Act
    const radioButton = screen.getByLabelText("Choice 3");

    fireEvent.click(radioButton);

    // Assert
    expect(handleChange).toHaveBeenCalledWith({
      target: { value: "choice3", name: "testRadioGroup" },
    });
  });

  it("doesn't call onChange when `disabled` item is clicked", () => {
    // Arrange
    const handleChange = jest.fn();

    render(
      <SimpleRadioGroupField
        name="testRadioGroup"
        value="choice1"
        onChange={handleChange}
        choices={choices}
      />,
    );

    // Act
    const radioButton = screen.getByLabelText("Choice 2");

    fireEvent.click(radioButton);

    // Assert
    expect(handleChange).not.toHaveBeenCalledWith({
      target: { value: "choice2", name: "testRadioGroup" },
    });
  });

  it("displays the error message when provided", () => {
    // Arrange & Act
    const errorMessage = "Error message";

    render(
      <SimpleRadioGroupField
        name="testRadioGroup"
        value="choice1"
        onChange={jest.fn()}
        choices={choices}
        errorMessage={errorMessage}
        error
      />,
    );

    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
