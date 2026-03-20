import { type ApolloClient } from "@apollo/client";
import { type GlobalIdFilterInput } from "@dashboard/graphql";

import { type Handler, LegacyChannelHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

type OrderChannelFilterQueryPart = {
  channelId?: GlobalIdFilterInput;
};

export class OrderChannelQueryVarsBuilder extends BaseMappableQueryVarsBuilder<OrderChannelFilterQueryPart> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "channels";
  }

  createOptionFetcher(client: ApolloClient<unknown>, inputValue: string): Handler {
    return new LegacyChannelHandler(client, inputValue);
  }

  protected getQueryFieldName(): string {
    return "channelId";
  }
}
