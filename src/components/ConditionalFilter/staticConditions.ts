import { STATIC_CONDITIONS, ATTRIBUTE_INPUT_TYPE_CONDITIONS } from "./constants"

export type StaticElementName = keyof typeof STATIC_CONDITIONS
export type AttributeInputType = keyof typeof ATTRIBUTE_INPUT_TYPE_CONDITIONS

export interface ConditionItem {
  type: string
  label: string
  value: string
}

export class ConditionOptions extends Array<ConditionItem> {
  private constructor(public options: ConditionItem[]) {
    super(...options)
  }

  public findByLabel (label: string) {
    return this.find(f => f.label === label)
  }

  public static empty() {
    return new ConditionOptions([])
  }

  public static isStaticName(name: string): name is StaticElementName {
    return !!STATIC_CONDITIONS[name]
  }

  public static isAttributeInputType(name: string): name is AttributeInputType {
    return !!ATTRIBUTE_INPUT_TYPE_CONDITIONS[name]
  }

  public static fromAtributeType(inputType: AttributeInputType) {
    const options = ATTRIBUTE_INPUT_TYPE_CONDITIONS[inputType]

    if (!options) {
      throw new Error(`Unsupported attribute input type "${inputType}"`)
    }

    return new ConditionOptions(options)
  }
  public static fromStaticElementName(name: StaticElementName) {
    const options = STATIC_CONDITIONS[name]

    if (!options) {
      throw new Error(`Unsupported static element "${name}"`)
    }

    return new ConditionOptions(options)
  }

  public static fromName(name: AttributeInputType | StaticElementName) {
    const optionsStatic = STATIC_CONDITIONS[name]
    const optionsAttribute = ATTRIBUTE_INPUT_TYPE_CONDITIONS[name]

    if (optionsStatic) {
      return new ConditionOptions(optionsStatic)
    }

    if (optionsAttribute) {
      return new ConditionOptions(optionsAttribute)
    }

    throw new Error(`Unsupported condition element "${name}"`)
  }
}