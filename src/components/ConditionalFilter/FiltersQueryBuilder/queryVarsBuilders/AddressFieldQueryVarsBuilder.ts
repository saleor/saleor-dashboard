import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { WhereOnlyQueryVarsBuilder } from "./types";

type AddressFilterQueryPart = {
  billingAddress?: {
    phoneNumber?: { eq?: string; oneOf?: string[] };
    country?: { eq?: string; oneOf?: string[] };
  };
  shippingAddress?: {
    phoneNumber?: { eq?: string; oneOf?: string[] };
    country?: { eq?: string; oneOf?: string[] };
  };
};

export class AddressFieldQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<AddressFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    const type = element.value.type;

    return (
      type === "billingPhoneNumber" ||
      type === "billingCountry" ||
      type === "shippingPhoneNumber" ||
      type === "shippingCountry"
    );
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<AddressFilterQueryPart>,
    element: FilterElement,
  ): AddressFilterQueryPart {
    const type = element.value.type;
    const conditionValue = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(
      element,
    ) as { eq?: string; oneOf?: string[] } | null;

    if (!conditionValue) {
      return query as AddressFilterQueryPart;
    }

    const newQuery = { ...query };

    if (type === "billingPhoneNumber") {
      newQuery.billingAddress = {
        ...newQuery.billingAddress,
        phoneNumber: conditionValue,
      };
    } else if (type === "billingCountry") {
      newQuery.billingAddress = {
        ...newQuery.billingAddress,
        country: conditionValue,
      };
    } else if (type === "shippingPhoneNumber") {
      newQuery.shippingAddress = {
        ...newQuery.shippingAddress,
        phoneNumber: conditionValue,
      };
    } else if (type === "shippingCountry") {
      newQuery.shippingAddress = {
        ...newQuery.shippingAddress,
        country: conditionValue,
      };
    }

    return newQuery;
  }
}
