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
    private loading: boolean
  ) {}

  public enableLoading () {
    this.loading = true
  }

  public disableLoading () {
    this.loading = false
  }


  public isLoading () {
    return this.loading
  }

  public static createEmpty () {
    const selected = {
      value: "",
      conditionValue: ""
    }

    return new Condition([], selected, false)
  }

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

    return new Condition(staticOptions, selected, false)
  }

  public static fromUrlToken (token: UrlToken, response: unknown) {
    return null

    if (!token.isStatic()) return null

    const staticOptions = STATIC_CONDITIONS[token.name]
    const selectedOption = staticOptions.find(el => el.label === token.conditionKind)

    const selected: ConditionSelected = {
      conditionValue: selectedOption.value,
      value: token.value,
      options: [] // response
    }

    return new Condition(staticOptions, selected, false)
  }
}

interface ExpressionValue {
  value: string,
  label: string,
  type: string
}


export class FilterElement {
  private constructor(
    public value: ExpressionValue,
    public condition: Condition,
    private loading: boolean
  ) {}

  public enableLoading () {
    this.loading = true
  }

  public disableLoading () {
    this.loading = false
  }


  public isLoading () {
    return this.loading
  }

  public updateLeftOperator (leftOperator: string) {
    this.value = { value: leftOperator, label: leftOperator, type: "s" }
    this.condition = Condition.emptyFromName(leftOperator)    
  }

  public updateCondition (conditionValue: string) {
    this.condition.selected.conditionValue = conditionValue
  }

  public updateRightOperator (value: string | string[]) {
    this.condition.selected.value = value
  }
  
  public isEmpty () {
    return this.value.type === "e"
  }

  public isStatic () {
    return this.value.type === "s"
  }

  public isAttribute () {
    return this.value.type === "a"
  }

  public static fromValueEntry (valueEntry: any) {
    return new FilterElement(
      valueEntry.value,
      valueEntry.condition,
      false
    )
  }

  public static createEmpty () {
    return new FilterElement(
      { value: "", label: "", type: "s" },
      Condition.createEmpty(),
      false
    )
  }

  public static fromUrlToken (token: UrlToken, response: unknown) {
    if (token.isStatic()) {
      console.log("fromUrlToken", token, response[token.name])

      return new FilterElement(
        { value: token.name, label: response[token.name].label, type: "s" },
        Condition.fromUrlToken(token, response),
        false,
      )
    }

    return null
    return new FilterElement(
      { value: token.name, label: token.name, type: "s" },
      Condition.fromUrlToken(token, response),
      false
    )
  }
}