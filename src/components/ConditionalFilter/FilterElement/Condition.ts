import { InitialOrderStateResponse } from "../API/initialState/orders/InitialOrderState";
import { InitialStateResponse } from "../API/InitialStateResponse";
import { LeftOperand } from "../LeftOperandsProvider";
import { UrlToken } from "./../ValueProvider/UrlToken";
import { ConditionOptions, StaticElementName } from "./ConditionOptions";
import { ConditionSelected } from "./ConditionSelected";
import { ItemOption } from "./ConditionValue";

export class Condition {
  public constructor(
    public options: ConditionOptions,
    public selected: ConditionSelected,
    public loading: boolean,
  ) {}

  public enableLoading() {
    this.loading = true;
  }

  public disableLoading() {
    this.loading = false;
  }

  public isLoading() {
    return this.loading;
  }

  public isEmpty() {
    return this.options.isEmpty() || this.selected.isEmpty();
  }

  public static createEmpty() {
    return new Condition(ConditionOptions.empty(), ConditionSelected.empty(), false);
  }

  public static emptyFromSlug(slug: StaticElementName) {
    const options = ConditionOptions.fromName(slug);

    return new Condition(options, ConditionSelected.fromConditionItem(options.first()), false);
  }

  public static emptyFromLeftOperand(operand: LeftOperand) {
    const options = ConditionOptions.fromName(operand.type);

    return new Condition(options, ConditionSelected.fromConditionItem(options.first()), false);
  }

  public static fromUrlToken(
    token: UrlToken,
    response: InitialStateResponse | InitialOrderStateResponse,
  ) {
    if (ConditionOptions.isStaticName(token.name)) {
      const staticOptions = ConditionOptions.fromStaticElementName(token.name);
      const selectedOption = staticOptions.findByLabel(token.conditionKind);
      const valueItems = response.filterByUrlToken(token) as ItemOption[];

      const isMultiSelect = selectedOption?.type === "multiselect" && valueItems.length > 0;
      const isBulkSelect = selectedOption?.type === "bulkselect" && valueItems.length > 0;
      const isDate = ["created", "updatedAt", "startDate", "endDate"].includes(token.name);

      const value = isMultiSelect || isDate || isBulkSelect ? valueItems : valueItems[0];

      if (!selectedOption) {
        return Condition.createEmpty();
      }

      return new Condition(
        staticOptions,
        ConditionSelected.fromConditionItemAndValue(selectedOption, value),
        false,
      );
    }

    if (token.isAttribute()) {
      const attribute = (response as InitialStateResponse).attributeByName(token.name);
      const options = ConditionOptions.fromAttributeType(attribute.inputType);
      const option = options.find(item => item.label === token.conditionKind)!;
      const value = response.filterByUrlToken(token);

      return new Condition(
        options,
        ConditionSelected.fromConditionItemAndValue(option, value),
        false,
      );
    }

    return Condition.createEmpty();
  }
}
