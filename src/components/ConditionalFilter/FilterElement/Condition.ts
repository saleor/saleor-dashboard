import { errorTracker } from "@dashboard/services/errorTracking";

import { InitialProductStateResponse } from "../API/initialState/product/InitialProductStateResponse";
import { LeftOperand } from "../LeftOperandsProvider";
import { InitialResponseType } from "../types";
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

  public static fromUrlToken(token: UrlToken, response: InitialResponseType) {
    if (ConditionOptions.isStaticName(token.name)) {
      const staticOptions = ConditionOptions.fromStaticElementName(token.name);
      const selectedOption = staticOptions.findByLabel(token.conditionKind);
      const responseValue = response.filterByUrlToken(token);

      // Check if this is a metadata field that uses text.double (tuple input)
      const isMetadataField = selectedOption?.type === "text.double";

      if (isMetadataField) {
        // For metadata fields, preserve the tuple structure from URL
        // responseValue should be [key, value] array for text.double fields
        const value = responseValue;

        return new Condition(
          staticOptions,
          ConditionSelected.fromConditionItemAndValue(selectedOption, value),
          false,
        );
      }

      // Handle other fields as ItemOption arrays
      const valueItems = responseValue as ItemOption[];
      const isMultiSelect = selectedOption?.type === "multiselect" && valueItems.length > 0;
      const isBulkSelect = selectedOption?.type === "bulkselect" && valueItems.length > 0;
      const isPriceField = ["totalGross", "totalNet"].includes(token.name);
      const isNumericField = ["number", "linesCount", "numberOfOrders", "timesUsed"].includes(
        token.name,
      );
      const isDate = [
        "created",
        "createdAt",
        "updatedAt",
        "startDate",
        "endDate",
        "started",
        "invoicesCreatedAt",
        "dateJoined",
      ].includes(token.name);

      // TODO: This doesn't make sense:
      // it's a hack to rehydrate state in input from URL
      // it's NOT used for building query (this works correctly regardless of this)
      // for some reason for some fields if we don't do this, value in input is not set when user re-opens filters
      const value =
        isMultiSelect || isBulkSelect || isPriceField || isNumericField || isDate
          ? valueItems
          : valueItems[0];

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
      const attribute = (response as InitialProductStateResponse).attributeByName(token.name);

      if (!attribute) {
        const error = new Error(
          `Attribute "${token.name}" not found when parsing URL filter token. This may indicate a race condition or invalid URL parameter.`,
        );

        console.error(error.message, { token, response });
        errorTracker.captureException(error);

        return Condition.createEmpty();
      }

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
