import {
  createAttributeMultiChangeHandler,
  prepareAttributesInput,
} from "@dashboard/attributes/utils/handlers";
import { AttributeInput, AttributeInputData } from "@dashboard/components/Attributes";
import { AttributeInputTypeEnum, AttributeValueDetailsFragment } from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

const multipleValueAttributes: FormsetData<AttributeInputData, string[]> = [
  {
    data: {
      inputType: AttributeInputTypeEnum.DROPDOWN,
      isRequired: false,
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "attrv-1",
          name: "Attribute 1 Value 1",
          reference: null,
          slug: "attr-1-v-1",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
    id: "attr-1",
    label: "Attribute 1",
    value: [],
  },
  {
    data: {
      inputType: AttributeInputTypeEnum.MULTISELECT,
      isRequired: false,
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "attrv-2",
          name: "Attribute 2 Value 1",
          reference: null,
          slug: "attr-2-v-1",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
        {
          __typename: "AttributeValue",
          file: null,
          id: "attrv-3",
          name: "Attribute 2 Value 2",
          reference: null,
          slug: "attr-2-v-2",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
        {
          __typename: "AttributeValue",
          file: null,
          id: "attrv-4",
          name: "Attribute 2 Value 3",
          reference: null,
          slug: "attr-2-v-3",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
    id: "attr-2",
    label: "Attribute 2",
    value: ["attr-2-v-3"],
  },
  {
    data: {
      inputType: AttributeInputTypeEnum.FILE,
      isRequired: false,
      values: [
        {
          __typename: "AttributeValue",
          file: {
            __typename: "File",
            contentType: "image/png",
            url: "some-non-existing-url",
          },
          id: "gdghdgdhkkdae",
          name: "File First Value",
          reference: null,
          slug: "file-first-value",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
    id: "ifudbgidfsb",
    label: "File Attribute",
    value: [],
  },
];
const ATTR_ID = "123" as const;

interface CreateAttribute {
  inputType: AttributeInputTypeEnum;
  initialValue?: AttributeValueDetailsFragment[];
  availableValues?: AttributeValueDetailsFragment[];
  value?: string;
  isRequired?: boolean;
}

const createAttribute = ({
  inputType,
  value,
  isRequired = false,
}: CreateAttribute): AttributeInput => ({
  data: {
    entityType: undefined,
    inputType,
    isRequired,
    // those values don't matter
    selectedValues: [],
    values: [],
    unit: null,
  },
  id: ATTR_ID,
  label: "MyAttribute",
  value: value !== null && value !== undefined ? [value] : [],
});
const createSelectAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({
    inputType: AttributeInputTypeEnum.DROPDOWN,
    value,
    isRequired,
  });
const createReferenceAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({
    inputType: AttributeInputTypeEnum.REFERENCE,
    value,
    isRequired,
  });
const createBooleanAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({
    inputType: AttributeInputTypeEnum.BOOLEAN,
    value,
    isRequired,
  });
const createPlainTextAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.PLAIN_TEXT, value, isRequired });
const createRichTextAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.RICH_TEXT, value, isRequired });
const createDateAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.DATE, value, isRequired });
const createDateTimeAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.DATE_TIME, value, isRequired });
const createSwatchAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.SWATCH, value, isRequired });
const createNumericAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.NUMERIC, value, isRequired });
const createFileAttribute = (value: string, isRequired?: boolean) =>
  createAttribute({ inputType: AttributeInputTypeEnum.FILE, value, isRequired });

describe("Multiple select change handler", () => {
  it("is able to select value", () => {
    const change = jest.fn();
    const trigger = jest.fn();
    const handler = createAttributeMultiChangeHandler(change, multipleValueAttributes, trigger);

    handler("attr-2", "attr-2-v-1");
    expect(change).toHaveBeenCalledTimes(1);
    expect(change.mock.calls[0][0]).toBe("attr-2");
    expect(change.mock.calls[0][1]).toHaveLength(2);
    expect(change.mock.calls[0][1][0]).toBe("attr-2-v-3");
    expect(change.mock.calls[0][1][1]).toBe("attr-2-v-1");
    expect(trigger).toHaveBeenCalledTimes(1);
  });
  it("is able to deselect value", () => {
    const change = jest.fn();
    const trigger = jest.fn();
    const handler = createAttributeMultiChangeHandler(change, multipleValueAttributes, trigger);

    handler("attr-2", "attr-2-v-3");
    expect(change).toHaveBeenCalledTimes(1);
    expect(change.mock.calls[0][0]).toBe("attr-2");
    expect(change.mock.calls[0][1]).toHaveLength(0);
    expect(trigger).toHaveBeenCalledTimes(1);
  });
  it("is able to add custom value", () => {
    const change = jest.fn();
    const trigger = jest.fn();
    const handler = createAttributeMultiChangeHandler(change, multipleValueAttributes, trigger);

    handler("attr-2", "A Value");
    expect(change).toHaveBeenCalledTimes(1);
    expect(change.mock.calls[0][0]).toBe("attr-2");
    expect(change.mock.calls[0][1]).toHaveLength(2);
    expect(change.mock.calls[0][1][0]).toBe("attr-2-v-3");
    expect(change.mock.calls[0][1][1]).toBe("A Value");
    expect(trigger).toHaveBeenCalledTimes(1);
  });
});
describe("Sending only changed attributes", () => {
  // null in expected = attribute not present in output
  describe("works with reference attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${["my value"]}
      ${null}       | ${"my value"} | ${[]}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createReferenceAttribute(newAttr);
      const prevAttribute = createReferenceAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, references: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required reference attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${[]}
      ${"my value"} | ${"my value"} | ${["my value"]}
      ${"my value"} | ${null}       | ${["my value"]}
      ${null}       | ${"my value"} | ${[]}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createReferenceAttribute(newAttr, true);
      const prevAttribute = createReferenceAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, references: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with select attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${["my value"]}
      ${null}       | ${"my value"} | ${[]}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createSelectAttribute(newAttr);
      const prevAttribute = createSelectAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, values: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required select attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${[]}
      ${"my value"} | ${"my value"} | ${["my value"]}
      ${"my value"} | ${null}       | ${["my value"]}
      ${null}       | ${"my value"} | ${[]}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createSelectAttribute(newAttr, true);
      const prevAttribute = createSelectAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, values: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with boolean attributes", () => {
    test.each`
      newAttr    | oldAttr  | expected
      ${null}    | ${null}  | ${null}
      ${"true"}  | ${true}  | ${null}
      ${"true"}  | ${false} | ${true}
      ${"true"}  | ${null}  | ${true}
      ${"false"} | ${false} | ${null}
      ${"false"} | ${true}  | ${false}
      ${"false"} | ${null}  | ${false}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createBooleanAttribute(newAttr);
      const prevAttribute = createBooleanAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, boolean: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required boolean attributes", () => {
    test.each`
      newAttr    | oldAttr  | expected
      ${null}    | ${null}  | ${null}
      ${"true"}  | ${true}  | ${true}
      ${"true"}  | ${false} | ${true}
      ${"true"}  | ${null}  | ${true}
      ${"false"} | ${false} | ${false}
      ${"false"} | ${true}  | ${false}
      ${"false"} | ${null}  | ${false}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createBooleanAttribute(newAttr, true);
      const prevAttribute = createBooleanAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, boolean: expected }]);
    });
  });

  describe("works with plain text attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createPlainTextAttribute(newAttr);
      const prevAttribute = createPlainTextAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, plainText: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required plain text attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${undefined}
      ${"my value"} | ${"my value"} | ${"my value"}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createPlainTextAttribute(newAttr, true);
      const prevAttribute = createPlainTextAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, plainText: expected }]);
    });
  });

  describe("works with rich text attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createRichTextAttribute(newAttr);
      const prevAttribute = createRichTextAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, richText: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required rich text attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${undefined}
      ${"my value"} | ${"my value"} | ${"my value"}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createRichTextAttribute(newAttr, true);
      const prevAttribute = createRichTextAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, richText: expected }]);
    });
  });

  describe("works with date attributes", () => {
    test.each`
      newAttr         | oldAttr         | expected
      ${null}         | ${null}         | ${null}
      ${"2021-01-01"} | ${"2021-01-01"} | ${null}
      ${"2021-01-01"} | ${null}         | ${"2021-01-01"}
      ${null}         | ${"2021-01-01"} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createDateAttribute(newAttr);
      const prevAttribute = createDateAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, date: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required date attributes", () => {
    test.each`
      newAttr         | oldAttr         | expected
      ${null}         | ${null}         | ${undefined}
      ${"2021-01-01"} | ${"2021-01-01"} | ${"2021-01-01"}
      ${"2021-01-01"} | ${null}         | ${"2021-01-01"}
      ${null}         | ${"2021-01-01"} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createDateAttribute(newAttr, true);
      const prevAttribute = createDateAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, date: expected }]);
    });
  });

  describe("works with date time attributes", () => {
    const dateTime = "2021-01-01T11:00:00+01:00";

    test.each`
      newAttr     | oldAttr     | expected
      ${null}     | ${null}     | ${null}
      ${dateTime} | ${dateTime} | ${null}
      ${dateTime} | ${null}     | ${dateTime}
      ${null}     | ${dateTime} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createDateTimeAttribute(newAttr);
      const prevAttribute = createDateTimeAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, dateTime: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required date time attributes", () => {
    const dateTime = "2021-01-01T11:00:00+01:00";

    test.each`
      newAttr     | oldAttr     | expected
      ${null}     | ${null}     | ${undefined}
      ${dateTime} | ${dateTime} | ${dateTime}
      ${dateTime} | ${null}     | ${dateTime}
      ${null}     | ${dateTime} | ${undefined}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createDateTimeAttribute(newAttr, true);
      const prevAttribute = createDateTimeAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, dateTime: expected }]);
    });
  });

  describe("works with swatch attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${""}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createSwatchAttribute(newAttr);
      const prevAttribute = createSwatchAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult =
        expected !== null ? [{ id: ATTR_ID, swatch: { value: expected } }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required swatch attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${""}
      ${"my value"} | ${"my value"} | ${"my value"}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${""}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createSwatchAttribute(newAttr, true);
      const prevAttribute = createSwatchAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, swatch: { value: expected } }]);
    });
  });

  describe("works with numeric attributes", () => {
    test.each`
      newAttr | oldAttr | expected
      ${null} | ${null} | ${null}
      ${"1"}  | ${"1"}  | ${null}
      ${"1"}  | ${null} | ${["1"]}
      ${null} | ${"1"}  | ${[]}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createNumericAttribute(newAttr);
      const prevAttribute = createNumericAttribute(oldAttr);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });
      const expectedResult = expected !== null ? [{ id: ATTR_ID, values: expected }] : [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("works with required numeric attributes", () => {
    test.each`
      newAttr | oldAttr | expected
      ${null} | ${null} | ${[]}
      ${"1"}  | ${"1"}  | ${["1"]}
      ${"1"}  | ${null} | ${["1"]}
      ${null} | ${"1"}  | ${[]}
    `("$oldAttr -> $newAttr returns $expected", ({ newAttr, oldAttr, expected }) => {
      const attribute = createNumericAttribute(newAttr, true);
      const prevAttribute = createNumericAttribute(oldAttr, true);
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [],
      });

      expect(result).toEqual([{ id: ATTR_ID, values: expected }]);
    });
  });

  describe("works with file attributes", () => {
    it("removes existing image (img -> null)", () => {
      const attribute = createFileAttribute("");
      const prevAttribute = createNumericAttribute("bob.jpg");
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [
          { file: undefined, id: ATTR_ID, contentType: undefined, values: [] },
        ],
      });

      // Files are deleted by using AttributeValueDetele mutation
      expect(result).toEqual([]);
    });
    it("adds new image (null -> img)", () => {
      const attribute = createFileAttribute("bob.jpg");
      const prevAttribute = createNumericAttribute("");
      const uploadUrl = "http://some-url.com/media/file_upload/bob.jpg";
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [
          {
            file: uploadUrl,
            id: ATTR_ID,
            contentType: "image/jpeg",
            values: [],
          },
        ],
      });

      expect(result).toEqual([
        {
          id: ATTR_ID,
          file: uploadUrl,
          contentType: "image/jpeg",
        },
      ]);
    });
    it("replaces existing image (bob.jpg -> juice.png)", () => {
      const attribute = createFileAttribute("bob.jpg");
      const prevAttribute = createNumericAttribute("juice.png");
      const uploadUrl = "http://some-url.com/media/file_upload/juice.jpg";
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [
          {
            file: uploadUrl,
            id: ATTR_ID,
            contentType: "image/png",
            values: [],
          },
        ],
      });

      expect(result).toEqual([
        {
          id: ATTR_ID,
          file: uploadUrl,
          contentType: "image/png",
        },
      ]);
    });
  });

  describe("works with required file attributes", () => {
    it("removes existing image (img -> null)", () => {
      const attribute = createFileAttribute("", true);
      const prevAttribute = createNumericAttribute("bob.jpg");
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [
          { file: undefined, id: ATTR_ID, contentType: undefined, values: [] },
        ],
      });

      expect(result).toEqual([
        {
          id: ATTR_ID,
          contentType: undefined,
          file: undefined,
        },
      ]);
    });
    it("adds new image (null -> img)", () => {
      const attribute = createFileAttribute("bob.jpg", true);
      const prevAttribute = createNumericAttribute("");
      const uploadUrl = "http://some-url.com/media/file_upload/bob.jpg";
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [
          {
            file: uploadUrl,
            id: ATTR_ID,
            contentType: "image/jpeg",
            values: [],
          },
        ],
      });

      expect(result).toEqual([
        {
          id: ATTR_ID,
          file: uploadUrl,
          contentType: "image/jpeg",
        },
      ]);
    });
    it("replaces existing image (bob.jpg -> juice.png)", () => {
      const attribute = createFileAttribute("bob.jpg", true);
      const prevAttribute = createNumericAttribute("juice.png");
      const uploadUrl = "http://some-url.com/media/file_upload/juice.jpg";
      const result = prepareAttributesInput({
        attributes: [attribute],
        prevAttributes: [prevAttribute],
        updatedFileAttributes: [
          {
            file: uploadUrl,
            id: ATTR_ID,
            contentType: "image/png",
            values: [],
          },
        ],
      });

      expect(result).toEqual([
        {
          id: ATTR_ID,
          file: uploadUrl,
          contentType: "image/png",
        },
      ]);
    });
  });
});
