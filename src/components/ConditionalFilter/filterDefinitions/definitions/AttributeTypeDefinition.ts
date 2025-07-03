import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableDefinition } from "./BaseMappableDefinition";

/**
 * `attributeType` needs to be rename to `type` in query
 */
export class AttributeTypeDefinition extends BaseMappableDefinition<{ type: string }> {
  protected readonly queryField = "type";

  public canHandle(element: FilterElement): boolean {
    return element.value.value === "attributeType";
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }
}
