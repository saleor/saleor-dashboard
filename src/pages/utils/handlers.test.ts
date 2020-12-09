import { AttributeInputData } from "@saleor/components/Attributes";
import { FormsetData } from "@saleor/hooks/useFormset";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";

import { createAttributeMultiChangeHandler } from "./handlers";

const attributes: FormsetData<AttributeInputData, string[]> = [
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
          slug: "attr-1-v-1"
        }
      ]
    },
    id: "attr-1",
    label: "Attribute 1",
    value: []
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
          slug: "attr-2-v-1"
        },
        {
          __typename: "AttributeValue",
          file: null,
          id: "attrv-3",
          name: "Attribute 2 Value 2",
          slug: "attr-2-v-2"
        },
        {
          __typename: "AttributeValue",
          file: null,
          id: "attrv-4",
          name: "Attribute 2 Value 3",
          slug: "attr-2-v-3"
        }
      ]
    },
    id: "attr-2",
    label: "Attribute 2",
    value: ["attr-2-v-3"]
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
            url: "some-non-existing-url"
          },
          id: "gdghdgdhkkdae",
          name: "File First Value",
          slug: "file-first-value"
        }
      ]
    },
    id: "ifudbgidfsb",
    label: "File Attribute",
    value: []
  }
];

describe("Multiple select", () => {
  it("is able to select value", () => {
    const change = jest.fn();
    const trigger = jest.fn();
    const handler = createAttributeMultiChangeHandler(
      change,
      attributes,
      trigger
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
      attributes,
      trigger
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
      attributes,
      trigger
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
