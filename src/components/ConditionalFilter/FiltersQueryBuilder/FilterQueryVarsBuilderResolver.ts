import { FilterElement } from "../FilterElement";
import {
  AttributeQueryVarsBuilder,
  AttributeTypeQueryVarsBuilder,
  CollectionPublishedQueryVarsBuilder,
  CustomerNumberOfOrdersQueryVarsBuilder,
  DefaultQueryVarsBuilder,
  MetadataFilterQueryVarsBuilder,
  ProductTypeQueryVarsBuilder,
  StaffMemberStatusQueryVarsBuilder,
  StaticBooleanQueryVarsBuilder,
  StaticQueryVarsBuilder,
  VoucherStatusQueryVarsBuilder,
  VoucherTimesUsedQueryVarsBuilder,
} from "./queryVarsBuilders";
import { FilterQuery, QueryVarsBuilder } from "./queryVarsBuilders/types";

export class FilterQueryVarsBuilderResolver<TQuery extends FilterQuery> {
  private queryVarsBuilders: Array<QueryVarsBuilder<TQuery>>;

  constructor(availableQueryVarsBuilders: Array<QueryVarsBuilder<TQuery>>) {
    this.queryVarsBuilders = availableQueryVarsBuilders;
  }

  /**
   * This is a place to register all available definitions.
   * Returns the default set of filter definitions in the correct order.
   * The order is important, as the first matching definition will be used.
   * DefaultDefinition should be last as it handles any unmatched element.
   */
  public static getDefaultQueryVarsBuilders() {
    return [
      new AttributeQueryVarsBuilder(),
      new AttributeTypeQueryVarsBuilder(),
      new CollectionPublishedQueryVarsBuilder(),
      new CustomerNumberOfOrdersQueryVarsBuilder(),
      new MetadataFilterQueryVarsBuilder(),
      new ProductTypeQueryVarsBuilder(),
      new StaffMemberStatusQueryVarsBuilder(),
      new StaticBooleanQueryVarsBuilder(),
      new StaticQueryVarsBuilder(),
      new VoucherStatusQueryVarsBuilder(),
      new VoucherTimesUsedQueryVarsBuilder(),
      new DefaultQueryVarsBuilder(),
    ];
  }

  public static getDefaultResolver() {
    return new FilterQueryVarsBuilderResolver(
      FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders(),
    );
  }

  public resolve(element: FilterElement): QueryVarsBuilder<TQuery> {
    const definition = this.queryVarsBuilders.find(def => def.canHandle(element));

    if (!definition) {
      throw new Error(`No definition found for filter element: "${element.value.value}"`);
    }

    return definition;
  }
}
