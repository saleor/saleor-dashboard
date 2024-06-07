import { fireEvent, render } from "@testing-library/react";
import * as React from "react";

import BulkSelect, { BulkSelectProps } from "./BulkSelect";

const intersectionObserverMock = () => ({
  observe: () => null,
  unobserve: () => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

describe("ConditionalFilter / UI / BulkSelect", () => {
  const defaultProps: BulkSelectProps = {
    selected: {
      options: [],
      loading: false,
      conditionValue: {
        type: "bulkselect",
        label: "in",
        value: "input-1",
      },
      value: [],
    },
    emitter: {
      type: "changeRightOperator",
      changeRightOperator: jest.fn(),
      addRow: jest.fn(),
      removeRow: jest.fn(),
      changeLeftOperator: jest.fn(),
      focusLeftOperator: jest.fn(),
      blurLeftOperator: jest.fn(),
      focusRightOperator: jest.fn(),
      blurRightOperator: jest.fn(),
      inputChangeLeftOperator: jest.fn(),
      changeCondition: jest.fn(),
      focusCondition: jest.fn(),
      blurCondition: jest.fn(),
      inputChangeRightOperator: jest.fn(),
      dispatchEvent: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    index: 0,
    error: false,
    helperText: "Helper text",
    disabled: false,
  };

  it("renders BulkSelect", () => {
    // Arrange & Act
    const element = render(<BulkSelect {...defaultProps} />);

    // Assert
    expect(element).toMatchSnapshot();
  });

  it("renders options inside the input", () => {
    // Arrange
    const element = render(
      <BulkSelect
        {...defaultProps}
        selected={{
          ...defaultProps.selected,
          value: [
            {
              label: "value1",
              value: "value1",
              slug: "value1",
            },
          ],
        }}
      />,
    );

    // Act & Assert
    expect(element).toMatchSnapshot();
    expect(element.getByText("value1")).toBeInTheDocument();
  });

  it("renders options inside the input with more than 15 characters", () => {
    const element = render(
      <BulkSelect
        {...defaultProps}
        selected={{
          ...defaultProps.selected,
          value: [
            {
              label: "verylongvalueofanid",
              value: "verylongvalueofanid",
              slug: "verylongvalueofanid",
            },
          ],
        }}
      />,
    );

    expect(element).toMatchSnapshot();
    expect(element.getByText("verylong...")).toBeInTheDocument();
  });

  it("removes options when x is clicked", () => {
    // Arrange
    const element = render(
      <BulkSelect
        {...defaultProps}
        selected={{
          ...defaultProps.selected,
          value: [
            {
              label: "value1",
              value: "value1",
              slug: "value1",
            },
          ],
        }}
      />,
    );

    const option = element.getByTestId("selected-option-value1-0");
    const xButton = option.childNodes[1];

    // Act
    fireEvent.click(xButton);

    // Assert
    expect(element.queryByText("value1")).not.toBeInTheDocument();
  });

  it("removes an element when there are multiple options", () => {
    // Arrange
    const element = render(
      <BulkSelect
        {...defaultProps}
        selected={{
          ...defaultProps.selected,
          value: [
            {
              label: "value1",
              value: "value1",
              slug: "value1",
            },
            {
              label: "value2",
              value: "value2",
              slug: "value2",
            },
            {
              label: "value3",
              value: "value3",
              slug: "value3",
            },
          ],
        }}
      />,
    );

    const option = element.getByTestId("selected-option-value2-1");
    const xButton = option.childNodes[1];

    // Act
    fireEvent.click(xButton);

    // Assert
    expect(element.queryByText("value2")).not.toBeInTheDocument();
  });

  it("adds a new element when special keys are clicked", () => {
    // Arrange
    const element = render(<BulkSelect {...defaultProps} />);

    const input = element.getByTestId("right-0");

    // Act
    fireEvent.change(input, { target: { value: "value1" } });
    fireEvent.keyDown(input, { key: "," });

    fireEvent.change(input, { target: { value: "value2" } });
    fireEvent.keyDown(input, { key: " " });

    fireEvent.change(input, { target: { value: "value3" } });
    fireEvent.keyDown(input, { key: "Tab" });

    // Assert
    expect(element.getByText("value1")).toBeInTheDocument();
    expect(element.getByText("value2")).toBeInTheDocument();
    expect(element.getByText("value3")).toBeInTheDocument();
  });

  it("pastes a list of IDs and adds them as options", () => {
    // Arrange
    const element = render(<BulkSelect {...defaultProps} />);

    const input = element.getByTestId("right-0");

    // Act
    fireEvent.paste(input, { clipboardData: { getData: () => "value1, value2, value3" } });

    // Assert
    expect(element.getByText("value1")).toBeInTheDocument();
    expect(element.getByText("value2")).toBeInTheDocument();
    expect(element.getByText("value3")).toBeInTheDocument();
  });
});
