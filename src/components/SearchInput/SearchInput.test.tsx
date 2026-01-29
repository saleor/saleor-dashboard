import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("should render with placeholder", () => {
    // Arrange & Act
    render(<SearchInput value="" onChange={jest.fn()} placeholder="Search..." />);

    // Assert
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should display the current value", () => {
    // Arrange & Act
    render(<SearchInput value="test query" onChange={jest.fn()} placeholder="Search..." />);

    // Assert
    expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
  });

  it("should call onChange when typing", async () => {
    // Arrange
    const onChange = jest.fn();

    render(<SearchInput value="" onChange={onChange} placeholder="Search..." />);

    // Act
    await userEvent.type(screen.getByPlaceholderText("Search..."), "a");

    // Assert
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("should show clear button when value is not empty", () => {
    // Arrange & Act
    render(
      <SearchInput
        value="test"
        onChange={jest.fn()}
        placeholder="Search..."
        data-test-id="search"
      />,
    );

    // Assert
    expect(screen.getByTestId("search-clear")).toBeInTheDocument();
  });

  it("should NOT show clear button when value is empty", () => {
    // Arrange & Act
    render(
      <SearchInput value="" onChange={jest.fn()} placeholder="Search..." data-test-id="search" />,
    );

    // Assert
    expect(screen.queryByTestId("search-clear")).not.toBeInTheDocument();
  });

  it("should call onChange with empty string when clear button is clicked", async () => {
    // Arrange

    const onChange = jest.fn();

    render(
      <SearchInput
        value="test"
        onChange={onChange}
        placeholder="Search..."
        data-test-id="search"
      />,
    );

    // Act
    await userEvent.click(screen.getByTestId("search-clear"));

    // Assert
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("should call onChange with empty string when Escape is pressed", async () => {
    // Arrange
    const onChange = jest.fn();

    render(<SearchInput value="test" onChange={onChange} placeholder="Search..." />);

    // Act
    const input = screen.getByPlaceholderText("Search...");

    await userEvent.type(input, "{Escape}");

    // Assert
    expect(onChange).toHaveBeenCalledWith("");
  });
});
