import { AttributeInputTypeEnum, MeasurementUnitsEnum } from "@dashboard/graphql";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import AttributeRow from "./AttributeRow";
import { type AttributeInput } from "./Attributes";
import { type AttributeRowProps } from "./types";

jest.mock("react-intl", () => {
  const actual = jest.requireActual("react-intl");

  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
    }),
  };
});

jest.mock("./utils", () => {
  const actual = jest.requireActual("./utils") as typeof import("./utils");

  return {
    ...actual,
    getErrorMessage: (error: { message?: string } | undefined) => error?.message || "",
  };
});

const numericAttribute: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.NUMERIC,
    isRequired: true,
    selectedValues: [],
    unit: MeasurementUnitsEnum.CM,
    values: [],
  },
  id: "numeric-attribute-id",
  label: "EAN",
  value: ["123"],
};

const richTextGetters: RichTextGetters<string> = {
  getDefaultValue: () => ({ blocks: [] }),
  getHandleChange: () => () => undefined,
  getMountEditor: () => () => undefined,
  getShouldMount: () => false,
};

const defaultProps: AttributeRowProps = {
  attribute: numericAttribute,
  attributeValues: [],
  disabled: false,
  error: undefined,
  fetchAttributeValues: jest.fn(),
  fetchMoreAttributeValues: {
    hasMore: false,
    loading: false,
    onFetchMore: jest.fn(),
    totalCount: 0,
  },
  loading: false,
  onChange: jest.fn(),
  onFileChange: jest.fn(),
  onMultiChange: jest.fn(),
  onReferencesAddClick: jest.fn(),
  onReferencesRemove: jest.fn(),
  onReferencesReorder: jest.fn(),
  richTextGetters,
};

describe("AttributeRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders numeric attribute as text input with decimal input mode", () => {
    // Arrange & Act
    render(<AttributeRow {...defaultProps} />);

    // Assert
    const input = screen.getByDisplayValue("123");

    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("inputmode")).toBe("decimal");
    expect(input).toHaveProperty("value", "123");
  });

  it("allows pasting numeric attribute values", async () => {
    // Arrange
    const onChange = jest.fn();
    const NumericAttributeRow = () => {
      const [value, setValue] = useState(numericAttribute.value[0]);

      return (
        <AttributeRow
          {...defaultProps}
          attribute={{ ...numericAttribute, value: [value] }}
          onChange={(id, nextValue) => {
            setValue(String(nextValue));
            onChange(id, nextValue);
          }}
        />
      );
    };
    const user = userEvent.setup();

    render(<NumericAttributeRow />);

    // Act
    const input = screen.getByDisplayValue("123");

    await user.clear(input);
    await user.click(input);
    await user.paste("5901234123457");

    // Assert
    expect(input).toHaveProperty("value", "5901234123457");
    expect(onChange).toHaveBeenLastCalledWith("numeric-attribute-id", "5901234123457");
  });
});
