import React from "react";

import { createPositiveIntegerChangeHandler } from "./utils";

describe("createPositiveIntegerChangeHandler", () => {
  const mockChange = jest.fn();

  beforeEach(() => {
    mockChange.mockClear();
  });

  it("should call change with event when passed a positive integer", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = { target: { value: "12345" } } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).toHaveBeenCalledWith(event);
  });

  it("should not call change when passed a negative integer", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = { target: { value: "-12345" } } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).not.toHaveBeenCalled();
  });

  it("should not call change with event when passed a positive float", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = { target: { value: "123.45" } } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).not.toHaveBeenCalled();
  });

  it("should not call change when passed a negative float", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = { target: { value: "-123.45" } } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).not.toHaveBeenCalled();
  });

  it("should not call change when passed a non-numeric string", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = { target: { value: "abc" } } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).not.toHaveBeenCalled();
  });

  it("should not call change with event when passed a string with just decimal separator", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = { target: { value: "." } } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).not.toHaveBeenCalled();
  });

  it("should not call change when passed a string with more than 9 digits", () => {
    const handler = createPositiveIntegerChangeHandler(mockChange);
    const event = {
      target: { value: "345345345345" },
    } as React.ChangeEvent<any>;

    handler(event);

    expect(mockChange).not.toHaveBeenCalled();
  });
});
