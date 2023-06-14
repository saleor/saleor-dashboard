import { UrlToken } from "./ValueProvider/UrlToken"
import { CONTROL_DEFAULTS } from "./controlsType"
import { STATIC_CONDITIONS } from "./staticConditions"

interface ConditionOption {
  type: string
  label: string
  value: string
}

interface ConditionSelected {
  value: string | string[]
  conditionValue: string,
  options?: { value: string, label: string }[]
}

class Condition {
  private constructor(
    public options: ConditionOption[],
    public selected: ConditionSelected,
  ) {}

  public static emptyFromName (operandName: string) {
    const staticOptions = STATIC_CONDITIONS[operandName]
    const firstOption = staticOptions[0]
    const defaults = CONTROL_DEFAULTS[firstOption.type]
    const selected: ConditionSelected = {
      conditionValue: firstOption.value,
      value: defaults.value
    }

    if (defaults.options) {
      selected.options = [
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
      ]
      // selected.options = defaults.options
    }

    return new Condition(staticOptions, selected)
  }

  public static fromUrlToken (token: UrlToken, response: unknown) {
    if (!token.isStatic()) return null

    const staticOptions = STATIC_CONDITIONS[token.name]
    const selectedOption = staticOptions.find(el => el.label === token.conditionKind)

    const selected: ConditionSelected = {
      conditionValue: selectedOption.value,
      value: token.value,
      options: [] // response
    }

    return new Condition(staticOptions, selected)
  }
}



export class FilterElement {
  private constructor(
    public value: string,
    public type: number | string,
    public condition: Condition
  ) {}


  public updateLeftOperator (leftOperator: string) {
    this.value = leftOperator
    this.type = 1
    this.condition = Condition.emptyFromName(leftOperator)    
  }

  public updateCondition (conditionValue: string) {
    this.condition.selected.conditionValue = conditionValue
  }

  public updateRightOperator (value: string | string[]) {
    this.condition.selected.value = value
  }
  
  public isEmpty () {
    return this.type === 0
  }

  public isStatic () {
    return this.type === 1
  }

  public isAttribute () {
    return this.type === 2
  }

  public static fromValueEntry (valueEntry: any) {
    return new FilterElement(
      valueEntry.value,
      valueEntry.type,
      valueEntry.condition
    )
  }

  public static createEmpty () {
    const emptyCondition = {
      options: [],
      selected: {
        value: "",
        conditionValue: ""
      }
    }
    return new FilterElement(
      "",
      0,
      emptyCondition
    )
  }

  public static fromUrlToken (token: UrlToken, response: unknown) {
    return new FilterElement(
      token.name,
      token.type,
      Condition.fromUrlToken(token, response)
    )
  }
}