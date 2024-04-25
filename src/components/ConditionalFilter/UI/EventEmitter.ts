import { RangeValue } from "@saleor/macaw-ui-next";

import {
  ConditionBlurData,
  ConditionChangeData,
  ConditionFocusData,
  LeftOperatorBlurData,
  LeftOperatorChangeData,
  LeftOperatorFocusData,
  LeftOperatorInputValueChangeData,
  LeftOperatorOption,
  RightOperatorBlurData,
  RightOperatorChangeData,
  RightOperatorFocusData,
  RightOperatorInputValueChangeData,
  RightOperatorOption,
  RowAddData,
  RowRemoveData,
} from "./types";

export class FilterEventEmitter extends EventTarget {
  type = "filterChange";

  addRow() {
    this.dispatchEvent(
      new CustomEvent<RowAddData>(this.type, {
        detail: {
          type: "row.add",
          rowType: "1",
        },
      }),
    );
  }

  removeRow(index: number) {
    this.dispatchEvent(
      new CustomEvent<RowRemoveData>(this.type, {
        detail: {
          type: "row.remove",
          path: `${index}`,
          index,
        },
      }),
    );
  }

  changeLeftOperator(index: number, value: LeftOperatorOption, rowType: string | undefined) {
    this.dispatchEvent(
      new CustomEvent<LeftOperatorChangeData>(this.type, {
        detail: {
          type: "leftOperator.onChange",
          path: `${index}`,
          value,
          rowType: rowType ?? "",
          index,
        },
      }),
    );
  }

  focusLeftOperator(index: number) {
    this.dispatchEvent(
      new CustomEvent<LeftOperatorFocusData>(this.type, {
        detail: {
          type: "leftOperator.onFocus",
          path: `${index}`,
          index,
        },
      }),
    );
  }

  blurLeftOperator(index: number) {
    this.dispatchEvent(
      new CustomEvent<LeftOperatorBlurData>(this.type, {
        detail: {
          type: "leftOperator.onBlur",
          path: `${index}`,
          index,
        },
      }),
    );
  }

  inputChangeLeftOperator(index: number, value: string) {
    this.dispatchEvent(
      new CustomEvent<LeftOperatorInputValueChangeData>(this.type, {
        detail: {
          type: "leftOperator.onInputValueChange",
          path: `${index}`,
          value,
          index,
        },
      }),
    );
  }

  changeCondition(index: number, value: ConditionChangeData["value"]) {
    this.dispatchEvent(
      new CustomEvent<ConditionChangeData>(this.type, {
        detail: {
          type: "condition.onChange",
          path: `${index}.condition.selected`,
          value,
          index,
        },
      }),
    );
  }

  focusCondition(index: number) {
    this.dispatchEvent(
      new CustomEvent<ConditionFocusData>(this.type, {
        detail: {
          type: "condition.onFocus",
          path: `${index}.condition.selected`,
          index,
        },
      }),
    );
  }

  blurCondition(index: number) {
    this.dispatchEvent(
      new CustomEvent<ConditionBlurData>(this.type, {
        detail: {
          type: "condition.onBlur",
          path: `${index}.condition.selected`,
          index,
        },
      }),
    );
  }

  changeRightOperator(
    index: number,
    value: string | RightOperatorOption[] | RightOperatorOption | RangeValue,
  ) {
    this.dispatchEvent(
      new CustomEvent<RightOperatorChangeData>(this.type, {
        detail: {
          type: "rightOperator.onChange",
          path: `${index}.condition.selected.value`,
          value,
          index,
        },
      }),
    );
  }

  focusRightOperator(index: number) {
    this.dispatchEvent(
      new CustomEvent<RightOperatorFocusData>(this.type, {
        detail: {
          type: "rightOperator.onFocus",
          path: `${index}.condition.selected.value`,
          index,
        },
      }),
    );
  }

  blurRightOperator(index: number) {
    this.dispatchEvent(
      new CustomEvent<RightOperatorBlurData>(this.type, {
        detail: {
          type: "rightOperator.onBlur",
          path: `${index}.condition.selected.value`,
          index,
        },
      }),
    );
  }

  inputChangeRightOperator(index: number, value: string) {
    this.dispatchEvent(
      new CustomEvent<RightOperatorInputValueChangeData>(this.type, {
        detail: {
          type: "rightOperator.onInputValueChange",
          path: `${index}.condition.selected.value`,
          index,
          value,
        },
      }),
    );
  }
}
