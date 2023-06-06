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
  constructor(
    public options: ConditionOption[],
    public selected: ConditionSelected,
  ) {}
}



export class FilterElement {
  private constructor(
    public value: string,
    public type: number,
    public condition: Condition
  ) {}


  public updateLeftOperator (leftOperator: string) {
    this.value = leftOperator
    this.type = 1
    this.condition.options = STATIC_CONDITIONS[leftOperator]
    this.condition.selected = {
      conditionValue: this.condition.options[0].value,
      value: [],
      options: [
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
      ]
    }
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
}