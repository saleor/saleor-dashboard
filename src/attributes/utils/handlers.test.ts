import {
  createAttributeMultiChangeHandler,
  prepareAttributesInput,
} from "@saleor/attributes/utils/handlers";
import {
  AttributeInput,
  AttributeInputData,
} from "@saleor/components/Attributes";
import {
  AttributeInputTypeEnum,
  AttributeValueDetailsFragment,
} from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";

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
}

const createAttribute = ({
  inputType,
  value,
}: CreateAttribute): AttributeInput => ({
  data: {
    entityType: null,
    inputType,
    isRequired: false,
    // those values don't matter
    selectedValues: [],
    values: [],
    unit: null,
  },
  id: ATTR_ID,
  label: "MyAttribute",
  value: value !== null ? [value] : [],
});

const createSelectAttribute = (value: string) =>
  createAttribute({
    inputType: AttributeInputTypeEnum.DROPDOWN,
    value,
  });

const createReferenceAttribute = (value: string) =>
  createAttribute({
    inputType: AttributeInputTypeEnum.REFERENCE,
    value,
  });

const createBooleanAttribute = (value: string) =>
  createAttribute({
    inputType: AttributeInputTypeEnum.BOOLEAN,
    value,
  });

const createPlainTextAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.PLAIN_TEXT, value });

const createRichTextAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.RICH_TEXT, value });

const createDateAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.DATE, value });

const createDateTimeAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.DATE_TIME, value });

const createSwatchAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.SWATCH, value });

const createNumericAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.NUMERIC, value });

const createFileAttribute = (value: string) =>
  createAttribute({ inputType: AttributeInputTypeEnum.FILE, value });

describe("Multiple select change handler", () => {
  it("is able to select value", () => {
    const change = jest.fn();
    const trigger = jest.fn();
    const handler = createAttributeMultiChangeHandler(
      change,
      multipleValueAttributes,
      trigger,
    );

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
    const handler = createAttributeMultiChangeHandler(
      change,
      multipleValueAttributes,
      trigger,
    );

    handler("attr-2", "attr-2-v-3");

    expect(change).toHaveBeenCalledTimes(1);
    expect(change.mock.calls[0][0]).toBe("attr-2");
    expect(change.mock.calls[0][1]).toHaveLength(0);
    expect(trigger).toHaveBeenCalledTimes(1);
  });

  it("is able to add custom value", () => {
    const change = jest.fn();
    const trigger = jest.fn();
    const handler = createAttributeMultiChangeHandler(
      change,
      multipleValueAttributes,
      trigger,
    );

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
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createReferenceAttribute(newAttr);
        const prevAttribute = createReferenceAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, references: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with select attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${["my value"]}
      ${null}       | ${"my value"} | ${[]}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createSelectAttribute(newAttr);
        const prevAttribute = createSelectAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, values: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
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
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createBooleanAttribute(newAttr);
        const prevAttribute = createBooleanAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, boolean: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with plain text attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${undefined}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createPlainTextAttribute(newAttr);
        const prevAttribute = createPlainTextAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, plainText: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with rich text attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${"my value"}
      ${null}       | ${"my value"} | ${undefined}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createRichTextAttribute(newAttr);
        const prevAttribute = createRichTextAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, richText: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with date attributes", () => {
    test.each`
      newAttr         | oldAttr         | expected
      ${null}         | ${null}         | ${null}
      ${"2021-01-01"} | ${"2021-01-01"} | ${null}
      ${"2021-01-01"} | ${null}         | ${"2021-01-01"}
      ${null}         | ${"2021-01-01"} | ${undefined}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createDateAttribute(newAttr);
        const prevAttribute = createDateAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, date: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with date time attributes", () => {
    const dateTime = "2021-01-01T11:00:00+01:00";
    test.each`
      newAttr     | oldAttr     | expected
      ${null}     | ${null}     | ${null}
      ${dateTime} | ${dateTime} | ${null}
      ${dateTime} | ${null}     | ${dateTime}
      ${null}     | ${dateTime} | ${undefined}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createDateTimeAttribute(newAttr);
        const prevAttribute = createDateTimeAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, dateTime: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with swatch attributes", () => {
    test.each`
      newAttr       | oldAttr       | expected
      ${null}       | ${null}       | ${null}
      ${"my value"} | ${"my value"} | ${null}
      ${"my value"} | ${null}       | ${["my value"]}
      ${null}       | ${"my value"} | ${[]}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createSwatchAttribute(newAttr);
        const prevAttribute = createSwatchAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, values: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with numeric attributes", () => {
    test.each`
      newAttr | oldAttr | expected
      ${null} | ${null} | ${null}
      ${"1"}  | ${"1"}  | ${null}
      ${"1"}  | ${null} | ${["1"]}
      ${null} | ${"1"}  | ${[]}
    `(
      "$oldAttr -> $newAttr returns $expected",
      ({ newAttr, oldAttr, expected }) => {
        const attribute = createNumericAttribute(newAttr);
        const prevAttribute = createNumericAttribute(oldAttr);

        const result = prepareAttributesInput({
          attributes: [attribute],
          prevAttributes: [prevAttribute],
          updatedFileAttributes: [],
        });

        const expectedResult =
          expected !== null ? [{ id: ATTR_ID, values: expected }] : [];
        expect(result).toEqual(expectedResult);
      },
    );
  });
  describe("works with file attributes", () => {
    it("removes existing image (img -> null)", () => {
      const attribute = createFileAttribute(null);
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
      const prevAttribute = createNumericAttribute(null);

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
});
