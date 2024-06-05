import { IMenu } from "@dashboard/utils/menu";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";

import AutocompleteSelectMenu from "./AutocompleteSelectMenu";

describe("AutocompleteSelectMenu", () => {
  const mockOnChange = jest.fn();
  const mockOnInputChange = jest.fn();

  const defaultProps = {
    disabled: false,
    displayValue: "Test",
    error: false,
    helperText: "Helper text",
    label: "Link",
    loading: false,
    name: "id",
    options: [
      {
        label: "Option 1",
        children: [
          {
            label: "Option 1 Child",
            data: {},
            children: [],
          },
        ],
        data: {},
      },
      {
        label: "Option 2",
        children: [
          {
            label: "Option 2 Child",
            data: {},
            children: [],
          },
        ],

        data: {},
      },
      {
        label: "Option 3",
        data: {},
        children: [
          {
            label: "Option 3 Child",
            data: {},
            children: [],
          },
          {
            label: "Option 3 Child 2",
            data: {},
            children: [],
          },
        ],
      },
    ] as IMenu,
    placeholder: "Start typing to begin search...",
    onChange: mockOnChange,
    onInputChange: mockOnInputChange,
    testIds: ["1", "2", "3", "4"],
  };

  it("renders without crashing", () => {
    // Arrange & Act
    const { container } = render(<AutocompleteSelectMenu {...defaultProps} />);
    // Assert
    expect(container).toBeInTheDocument();
  });

  it("renders the input field", () => {
    // Arrange & Act
    const { getByPlaceholderText } = render(
      <AutocompleteSelectMenu {...defaultProps} />,
    );
    const input = getByPlaceholderText(defaultProps.placeholder);
    // Assert
    expect(input).toBeInTheDocument();
  });

  it("calls onInputChange when typing in the input field", async () => {
    // Arrange
    const { getByPlaceholderText } = render(
      <AutocompleteSelectMenu {...defaultProps} />,
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    // Act
    fireEvent.change(input, { target: { value: "Option 2" } });

    // Assert
    await waitFor(() => {
      expect(mockOnInputChange).toHaveBeenCalledWith("Option 2");
    });
  });

  it("shows inner list when option is selected", async () => {
    // Arrange
    const { getByPlaceholderText, getByText } = render(
      <IntlProvider locale="en">
        <AutocompleteSelectMenu {...defaultProps} />
      </IntlProvider>,
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    // Act
    fireEvent.focus(input);
    const option = getByText("Option 1");
    fireEvent.click(option);

    // Assert
    await waitFor(() => {
      expect(getByText("Option 1 Child")).toBeInTheDocument();
    });
  });
});
