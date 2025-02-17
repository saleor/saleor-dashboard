import { ApolloClient, useApolloClient } from "@apollo/client";
import { CollectionPublished } from "@dashboard/graphql/types.generated";
import { IntlShape, useIntl } from "react-intl";

import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { ChannelHandler, EnumValuesHandler, Handler, NoopValuesHandler } from "../Handler";
import { getFilterElement } from "../utils";

const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
  intl: IntlShape,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType === "published") {
    return new EnumValuesHandler(CollectionPublished, "published", intl);
  }

  if (rowType === "metadata") {
    return new NoopValuesHandler([]);
  }

  if (rowType === "channel") {
    return new ChannelHandler(client, inputValue);
  }

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useCollectionFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, client, inputValue, intl);

    return handler.fetch();
  };
  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};
