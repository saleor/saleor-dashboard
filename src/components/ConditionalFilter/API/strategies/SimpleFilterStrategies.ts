import { ApolloClient } from "@apollo/client";
import { DecimalFilterInput, StringFilterInput } from "@dashboard/graphql";

import { FilterElement } from "../../FilterElement";
import { isItemOption, isItemOptionArray, isTuple } from "../../FilterElement/ConditionValue";
import {
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  Handler,
  ProductTypeHandler,
} from "../Handler";
import { FilterHandlerStrategy } from "./types";

class AbstractSimpleStrategy {
  buildQueryPart(
    filterElement: FilterElement,
  ): StringFilterInput | DecimalFilterInput | boolean | string {
    const { conditionValue, value } = filterElement.condition.selected;

    if (!conditionValue) return "";

    const { label } = conditionValue;

    if (label === "lower") {
      return { range: { lte: value } } as DecimalFilterInput;
    }

    if (label === "greater") {
      return { range: { gte: value } } as DecimalFilterInput;
    }

    if (isTuple(value) && label === "between") {
      const [gte, lte] = value;

      return { range: { lte, gte } } as DecimalFilterInput;
    }

    if (isItemOption(value) && ["true", "false"].includes(value.value)) {
      return value.value === "true";
    }

    if (isItemOption(value)) {
      return { eq: value.value } as StringFilterInput;
    }

    if (isItemOptionArray(value)) {
      return { oneOf: value.map(x => x.value) } as StringFilterInput;
    }

    if (typeof value === "string") {
      if (["true", "false"].includes(value)) {
        return value === "true";
      }

      return { eq: value } as StringFilterInput;
    }

    if (Array.isArray(value)) {
      return { oneOf: value } as StringFilterInput;
    }

    return value;
  }
}

export class CollectionStrategy extends AbstractSimpleStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return filterElement.rowType() === "collection";
  }

  createHandler(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new CollectionHandler(client, inputValue);
  }
}

export class CategoryStrategy extends AbstractSimpleStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return filterElement.rowType() === "category";
  }

  createHandler(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new CategoryHandler(client, inputValue);
  }
}

export class ProductTypeStrategy extends AbstractSimpleStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return filterElement.rowType() === "productType";
  }

  createHandler(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new ProductTypeHandler(client, inputValue);
  }
}

export class ChannelStrategy extends AbstractSimpleStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return filterElement.rowType() === "channel";
  }

  createHandler(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new ChannelHandler(client, inputValue);
  }
}

export class GenericStaticStrategy extends AbstractSimpleStrategy implements FilterHandlerStrategy {
  canHandle(filterElement: FilterElement): boolean {
    return !filterElement.isAttribute;
  }

  createHandler(): Handler {
    throw new Error("Generic static filters don't support autocomplete");
  }
}
