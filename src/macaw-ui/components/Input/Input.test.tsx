import { fireEvent, render, screen } from "@testing-library/react";

import { Input } from ".";

describe("Input", () => {
  it.each([
    { type: "text", value: "Hello", expected: "Hello" },
    { type: "number", value: "123", expected: 123 },
    { type: "number", value: "Hello", expected: null },
    { type: "number", value: "123.45", expected: 123.45 },
  ] as const)(
    "with type=$type should accept $value and expect $expected",
    ({ type, value, expected }) => {
      render(<Input type={type} />);

      const input = screen.getByRole("input");

      fireEvent.change(input, { target: { value } });

      expect(input).toHaveValue(expected);
    }
  );
});
