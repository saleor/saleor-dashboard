import { type ChangeEvent } from "@dashboard/hooks/useForm";

import { EventDataAction, EventDataField } from "./types";
import { getDataKey, getMetadataTitle, parseEventData } from "./utils";

describe("parseEventData", () => {
  it("parses name field update event", () => {
    // Arrange
    const event: ChangeEvent<string> = {
      target: { name: "name:2", value: "my-key" },
    };

    // Act
    const result = parseEventData(event);

    // Assert
    expect(result).toEqual({
      action: EventDataAction.update,
      field: EventDataField.name,
      fieldIndex: 2,
      value: "my-key",
    });
  });

  it("parses value field update event", () => {
    // Arrange
    const event: ChangeEvent<string> = {
      target: { name: "value:5", value: "my-value" },
    };

    // Act
    const result = parseEventData(event);

    // Assert
    expect(result).toEqual({
      action: EventDataAction.update,
      field: EventDataField.value,
      fieldIndex: 5,
      value: "my-value",
    });
  });

  it("parses add action event", () => {
    // Arrange
    const event: ChangeEvent<string> = {
      target: { name: "add", value: "" },
    };

    // Act
    const result = parseEventData(event);

    // Assert
    expect(result).toEqual({
      action: EventDataAction.add,
      field: null,
      fieldIndex: null,
      value: "",
    });
  });

  it("parses delete action event", () => {
    // Arrange
    const event: ChangeEvent<string> = {
      target: { name: "delete", value: "3" },
    };

    // Act
    const result = parseEventData(event);

    // Assert
    expect(result).toEqual({
      action: EventDataAction.delete,
      field: null,
      fieldIndex: 3,
      value: "",
    });
  });

  it("throws on invalid event action", () => {
    // Arrange
    const event: ChangeEvent<string> = {
      target: { name: "unknown-action", value: "" },
    };

    // Act & Assert
    expect(() => parseEventData(event)).toThrow('Invalid metadata event action: "unknown-action"');
  });
});

describe("getDataKey", () => {
  it("returns 'privateMetadata' when isPrivate is true", () => {
    expect(getDataKey(true)).toBe("privateMetadata");
  });

  it("returns 'metadata' when isPrivate is false", () => {
    expect(getDataKey(false)).toBe("metadata");
  });
});

describe("getMetadataTitle", () => {
  it("returns private metadata message descriptor when isPrivate is true", () => {
    expect(getMetadataTitle(true)).toEqual({
      id: "ETHnjq",
      defaultMessage: "Private Metadata",
      description: "header",
    });
  });

  it("returns metadata message descriptor when isPrivate is false", () => {
    expect(getMetadataTitle(false)).toEqual({
      id: "VcI+Zh",
      defaultMessage: "Metadata",
      description: "header",
    });
  });
});
