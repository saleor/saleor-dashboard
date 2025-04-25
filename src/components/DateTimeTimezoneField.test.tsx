import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { DateTimeTimezoneField } from "./DateTimeTimezoneField";

const Wrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <ThemeProvider>
    <IntlProvider locale="en">{children}</IntlProvider>
  </ThemeProvider>
);

describe("DateTimeTimezoneField", () => {
  it("renders without crashing", () => {
    // Arrange & Act
    const { getByTestId } = render(
      <Wrapper>
        <DateTimeTimezoneField name="test" onChange={jest.fn()} value="" />
      </Wrapper>,
    );

    // Assert
    expect(getByTestId("date-time-field")).toBeInTheDocument();
  });

  it("calls onChange when the input value changes", () => {
    // Arrange & Act
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <Wrapper>
        <DateTimeTimezoneField name="test" onChange={handleChange} value="" />
      </Wrapper>,
    );

    fireEvent.change(getByTestId("date-time-field"), { target: { value: "2022-12-31T23:59" } });

    // Assert
    expect(handleChange).toHaveBeenCalledWith("2022-12-31T23:59");
  });

  it("displays an error message when there is an error", () => {
    // Arrange & Act
    const { getByText } = render(
      <Wrapper>
        <DateTimeTimezoneField name="test" onChange={jest.fn()} error="Test error" value="" />
      </Wrapper>,
    );

    // Assert
    expect(getByText("Test error")).toBeInTheDocument();
  });

  it("keeps the time when a valid time is input and the input is blurred", () => {
    // Arrange & Act
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <Wrapper>
        <DateTimeTimezoneField name="test" onChange={handleChange} value="" />
      </Wrapper>,
    );

    const input = getByTestId("date-time-field") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "2022-12-31T23:59" } });
    fireEvent.blur(input);

    // Assert
    expect(input.value).toBe("2022-12-31T23:59");
  });

  it("doesn't save invalid time when the input is blurred (below min)", () => {
    // Arrange & Act
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <Wrapper>
        <DateTimeTimezoneField name="test" onChange={handleChange} value="" />
      </Wrapper>,
    );

    const input = getByTestId("date-time-field") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "1920-12-31T23:59" } });
    fireEvent.blur(input);

    // Assert
    expect(input.value).toBe("");
  });

  it("doesn't save invalid time when the input is blurred (above max)", () => {
    // Arrange & Act
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <Wrapper>
        <DateTimeTimezoneField name="test" onChange={handleChange} value="" />
      </Wrapper>,
    );

    const input = getByTestId("date-time-field") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "11111-12-31T23:59" } });
    fireEvent.blur(input);

    // Assert
    expect(input.value).toBe("");
  });
});
