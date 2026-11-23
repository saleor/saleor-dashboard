import { type ReactElement } from "react";
import { type IntlShape, type MessageDescriptor, useIntl } from "react-intl";

import { localizeFilterCondition, localizeStaticFilterLabel } from "./displayMessages";
import { FilterEventEmitter } from "./UI/EventEmitter";
import { RightOperator } from "./UI/RightOperator";
import { type RightOperatorOption } from "./UI/types";

const portuguese: Record<string, string> = {
  Price: "Preço",
  "Product type": "Tipo de produto",
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
    // Arrange
    const field = Object.freeze({
      label: "Price",
      type: "price",
      value: "price",
    });

    // Act
    const portugueseLabel = localizeStaticFilterLabel(
      field.label,
      field.type,
      field.value,
      makeIntl(),
    );
    const englishLabel = localizeStaticFilterLabel("Price", "price", "price", makeIntl({}));

    // Assert
    expect(portugueseLabel).toBe("Preço");
    expect(englishLabel).toBe("Price");
    expect(field).toEqual({ label: "Price", type: "price", value: "price" });
  });

  it("shows product fields by their readable names, not their internal keys", () => {
    // Arrange
    const field = { label: "ProductType", type: "productType", value: "productType" };

    // Act
    const englishLabel = localizeStaticFilterLabel(
      field.label,
      field.type,
      field.value,
      makeIntl({}),
    );
    const portugueseLabel = localizeStaticFilterLabel(
      field.label,
      field.type,
      field.value,
      makeIntl(),
    );

    // Assert
    expect(englishLabel).toBe("Product type");
    expect(portugueseLabel).toBe("Tipo de produto");
  });

  it("preserves user-defined attribute labels even when they match a built-in label", () => {
    // Arrange
    const intl = makeIntl();

    // Act
    const attributeLabel = localizeStaticFilterLabel("Price", "DROPDOWN", "custom-price", intl);
    const unknownLabel = localizeStaticFilterLabel("Custom field", "UNKNOWN", "custom", intl);

    // Assert
    expect(attributeLabel).toBe("Price");
    expect(unknownLabel).toBe("Custom field");
  });

  it.each([
    ["is", "é"],
    ["in", "incluído em"],
    ["lower", "menor que"],
    ["greater", "maior que"],
    ["between", "entre"],
    ["contains", "contém"],
  ])("translates the %s operator label and preserves its protocol fields", (label, translated) => {
    // Arrange
    const condition = Object.freeze({
      label,
      type: "number",
      value: "input-1",
    });

    // Act
    const localized = localizeFilterCondition(condition, makeIntl());

    // Assert
    expect(localized).toEqual({
      label: translated,
      type: "number",
      value: "input-1",
    });
    expect(condition.label).toBe(label);
  });

  it("preserves unrecognised operator labels", () => {
    // Arrange
    const condition = {
      label: "custom operator",
      type: "text",
      value: "custom-token",
    };

    // Act
    const localized = localizeFilterCondition(condition, makeIntl());

    // Assert
    expect(localized).toBe(condition);
  });

  it("renders Portuguese boolean options while preserving query values and source options", () => {
    // Arrange
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

    // Act
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

    // Assert
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
