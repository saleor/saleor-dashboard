import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { WhereOnlyQueryVarsBuilder } from "./types";

type ArrayNestedFilterQueryPart = {
  transactions?: Array<{
    paymentMethodDetails?: {
      type?: { eq?: string; oneOf?: string[] };
      card?: {
        brand?: { eq?: string; oneOf?: string[] };
      };
    };
  }>;
};

/** Builds query for elements that have nested array structure, e.g.:
 * `transactions` on `order.where`
 * Example:
 * `transactions: [{ paymentMethodDetails: {type: {eq: "CARD"}} }, {paymentMethodDetails: {card: {eq: "SaleorCard"}}}]`
 * is created from two separate inputs for Payment method = "CARD" and Payment method card = "SaleorCard" l*/
export class ArrayNestedFieldQueryVarsBuilder
  implements WhereOnlyQueryVarsBuilder<ArrayNestedFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    const type = element.value.type;

    return type === "transactionsPaymentType" || type === "transactionsCardBrand";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQueryVariables(
    query: Readonly<ArrayNestedFilterQueryPart>,
    element: FilterElement,
  ): ArrayNestedFilterQueryPart {
    const type = element.value.type;
    const conditionValue = QueryVarsBuilderUtils.extractConditionValueFromFilterElement(element);

    if (!conditionValue) {
      return query as ArrayNestedFilterQueryPart;
    }

    const newQuery = { ...query };
    const existingArray = newQuery.transactions || [];

    if (type === "transactionsPaymentType") {
      // Create new array element for transactions.paymentMethodDetails.type
      const newElement = {
        paymentMethodDetails: {
          type: conditionValue as { eq?: string; oneOf?: string[] },
        },
      };

      newQuery.transactions = [...existingArray, newElement];
    } else if (type === "transactionsCardBrand") {
      // Create new array element for transactions.paymentMethodDetails.card.brand
      const newElement = {
        paymentMethodDetails: {
          card: {
            brand: conditionValue as { eq?: string; oneOf?: string[] },
          },
        },
      };

      newQuery.transactions = [...existingArray, newElement];
    }

    return newQuery;
  }
}
