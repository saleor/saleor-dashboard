import { FieldError, FieldErrors } from "react-hook-form";

import { flattenErrors } from "./errors";

describe("flattenErrors", () => {
  it("should return empty array when undefined", () => {
    const errors = undefined;

    expect(flattenErrors(errors)).toEqual([]);
  });
  it("should return empty array when no errors", () => {
    const errors: FieldErrors = {};

    expect(flattenErrors(errors)).toEqual([]);
  });

  it("should extract single level error messages", () => {
    const errors: FieldErrors = {
      name: {
        type: "required",
        message: "Name is required",
      },
      email: {
        type: "pattern",
        message: "Invalid email format",
      },
    };

    expect(flattenErrors(errors)).toEqual(["Name is required", "Invalid email format"]);
  });

  it("should handle nested error objects", () => {
    const errors: FieldErrors = {
      metadata: {
        0: {
          key: {
            type: "required",
            message: "Key is required",
          },
          value: {
            type: "required",
            message: "Value is required",
          },
        },
        1: {
          key: {
            type: "pattern",
            message: "Invalid key format",
          },
        },
      },
    };

    expect(flattenErrors(errors)).toEqual([
      "Key is required",
      "Value is required",
      "Invalid key format",
    ]);
  });

  it("should ignore error objects without message property", () => {
    const errors: FieldErrors = {
      field1: {
        type: "required",
      } as FieldError,
      field2: {
        type: "custom",
        message: "Valid error message",
      },
    };

    expect(flattenErrors(errors)).toEqual(["Valid error message"]);
  });

  it("should handle mixed nested and flat error structure", () => {
    const errors: FieldErrors = {
      name: {
        type: "required",
        message: "Name is required",
      },
      address: {
        street: {
          type: "required",
          message: "Street is required",
        },
        city: {
          type: "required",
          message: "City is required",
        },
      },
    };

    expect(flattenErrors(errors)).toEqual([
      "Name is required",
      "Street is required",
      "City is required",
    ]);
  });
});
