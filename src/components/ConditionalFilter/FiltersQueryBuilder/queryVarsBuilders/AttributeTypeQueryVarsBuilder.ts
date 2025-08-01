import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

/**
 * `attributeType` needs to be renamed to `type` in query
 */
export class AttributeTypeQueryVarsBuilder extends BaseMappableQueryVarsBuilder<{ type?: string }> {
  protected readonly queryField = "type";

  public canHandle(element: FilterElement): boolean {
    return element.value.value === "attributeType";
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(): string {
    return this.queryField;
  }
}
