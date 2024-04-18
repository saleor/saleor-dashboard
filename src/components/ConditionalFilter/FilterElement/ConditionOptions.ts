import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { ATTRIBUTE_INPUT_TYPE_CONDITIONS, STATIC_CONDITIONS } from "../constants";

export type StaticElementName = keyof typeof STATIC_CONDITIONS;
export type AttributeInputType = keyof typeof ATTRIBUTE_INPUT_TYPE_CONDITIONS;

export interface ConditionItem {
  type: string;
  label: string;
  value: string;
}

export class ConditionOptions extends Array<ConditionItem> {
  private constructor(options: ConditionItem[] | number) {
    if (Array.isArray(options)) {
      super(...options);
      return;
    }

    super(options);
  }

  public static isStaticName(name: string): name is StaticElementName {
    return name in STATIC_CONDITIONS;
  }

  public static isAttributeInputType(name: string): name is AttributeInputType {
    return name in ATTRIBUTE_INPUT_TYPE_CONDITIONS;
  }

  public static fromAttributeType(inputType: AttributeInputType) {
    const options = ATTRIBUTE_INPUT_TYPE_CONDITIONS[inputType];

    if (!options) {
      throw new Error(`Unsupported attribute input type "${inputType}"`);
    }

    return new ConditionOptions(options);
  }

  public static fromStaticElementName(name: StaticElementName) {
    const options = STATIC_CONDITIONS[name];

    if (!options) {
      throw new Error(`Unsupported static element "${name}"`);
    }

    return new ConditionOptions(options);
  }

  public static fromName(name: AttributeInputType | StaticElementName | AttributeInputTypeEnum) {
    const optionsStatic = this.isStaticName(name) && STATIC_CONDITIONS[name];
    const optionsAttribute =
      this.isAttributeInputType(name) && ATTRIBUTE_INPUT_TYPE_CONDITIONS[name];

    if (optionsStatic) {
      return new ConditionOptions(optionsStatic);
    }

    if (optionsAttribute) {
      return new ConditionOptions(optionsAttribute);
    }

    throw new Error(`Unsupported condition element "${name}"`);
  }

  public static empty() {
    return new ConditionOptions([]);
  }

  public isEmpty() {
    return this.length === 0;
  }

  public findByLabel(label: string) {
    return this.find(f => f.label === label);
  }

  public first() {
    return this[0];
  }
}
