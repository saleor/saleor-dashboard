import { type ReactElement } from "react";
import { type IntlShape, type MessageDescriptor, useIntl } from "react-intl";

import { localizeFilterCondition, localizeStaticFilterLabel } from "./displayMessages";
import { FilterEventEmitter } from "./UI/EventEmitter";
import { RightOperator } from "./UI/RightOperator";
import { type RightOperatorOption } from "./UI/types";

const portuguese: Record<string, string> = {
  Price: "Preço",
  is: "é",
  in: "incluído em",
  lower: "menor que",
  greater: "maior que",
  between: "entre",
  contains: "contém",
  Yes: "Sim",
  No: "Não",
};

// Match the repository's react-intl mock while exercising real localisation helpers.
const makeIntl = (messages: Record<string, string> = portuguese) =>
  ({
    locale: "pt",
    formatMessage: ({ defaultMessage }: MessageDescriptor) =>
      (typeof defaultMessage === "string" ? messages[defaultMessage] : undefined) ?? defaultMessage,
  }) as IntlShape;

describe("filter display localisation", () => {
  it("translates static labels without changing the canonical field definition", () => {
    const field = Object.freeze({
      label: "Price",
      type: "price",
      value: "price",
    });

    expect(localizeStaticFilterLabel(field.label, field.type, field.value, makeIntl())).toBe(
      "Preço",
    );
    expect(field).toEqual({ label: "Price", type: "price", value: "price" });
    expect(localizeStaticFilterLabel("Price", "price", "price", makeIntl({}))).toBe("Price");
  });

  it("preserves user-defined attribute labels even when they match a built-in label", () => {
    expect(localizeStaticFilterLabel("Price", "DROPDOWN", "custom-price", makeIntl())).toBe(
      "Price",
    );
    expect(localizeStaticFilterLabel("Custom field", "UNKNOWN", "custom", makeIntl())).toBe(
      "Custom field",
    );
  });

  it.each([
    ["is", "é"],
    ["in", "incluído em"],
    ["lower", "menor que"],
    ["greater", "maior que"],
    ["between", "entre"],
    ["contains", "contém"],
  ])("translates the %s operator label and preserves its protocol fields", (label, translated) => {
    const condition = Object.freeze({
      label,
      type: "number",
      value: "input-1",
    });

    expect(localizeFilterCondition(condition, makeIntl())).toEqual({
      label: translated,
      type: "number",
      value: "input-1",
    });
    expect(condition.label).toBe(label);
  });

  it("preserves unrecognised operator labels", () => {
    const condition = {
      label: "custom operator",
      type: "text",
      value: "custom-token",
    };

    expect(localizeFilterCondition(condition, makeIntl())).toBe(condition);
  });

  it("renders Portuguese boolean options while preserving query values and source options", () => {
    (useIntl as jest.Mock).mockReturnValueOnce(makeIntl());

    const options = [
      Object.freeze({ label: "Yes", value: "true", slug: "true" }),
      Object.freeze({ label: "No", value: "false", slug: "false" }),
      Object.freeze({
        label: "Yes",
        value: "custom-choice-id",
        slug: "user-choice",
      }),
    ];

    // RightOperator only calls the mocked useIntl hook. Inspect its Select props
    // without mounting the surrounding filter tree or interacting with a browser.
    const element = RightOperator({
      index: 0,
      selected: {
        conditionValue: { type: "select", label: "is", value: "input-1" },
        value: options[0],
        options,
      },
      emitter: new FilterEventEmitter(),
      error: false,
      helperText: "",
      disabled: false,
    }) as ReactElement<{
      options: RightOperatorOption[];
      value: RightOperatorOption;
    }>;

    expect(element.props.options).toEqual([
      { label: "Sim", value: "true", slug: "true" },
      { label: "Não", value: "false", slug: "false" },
      { label: "Yes", value: "custom-choice-id", slug: "user-choice" },
    ]);
    expect(element.props.value).toEqual({
      label: "Sim",
      value: "true",
      slug: "true",
    });
    expect(options.map(option => option.label)).toEqual(["Yes", "No", "Yes"]);
  });
});
