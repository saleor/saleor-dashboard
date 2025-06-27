import { CollectionFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class CollectionChannelHandler implements SpecialHandler<CollectionFilterInput> {
  private channelValue: string | undefined;

  canHandle(element: FilterElement): boolean {
    return element.value.type === "channel";
  }

  handle(_: unknown, element: FilterElement, resolver: FilterStrategyResolver): boolean {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    if (typeof queryPart === "string") {
      this.channelValue = queryPart;
    }

    return true;
  }

  getChannel(): { eq: string } | undefined {
    return this.channelValue ? { eq: this.channelValue } : undefined;
  }
}
