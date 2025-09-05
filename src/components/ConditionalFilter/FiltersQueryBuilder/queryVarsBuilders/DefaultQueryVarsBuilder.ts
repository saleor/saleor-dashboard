import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

/** Class used when other filter definition doesn't support an element
 * it re-uses mapping from BaseMappableDefinition */
export class DefaultQueryVarsBuilder extends BaseMappableQueryVarsBuilder {
  canHandle(): boolean {
    // Default definition handles all elements that no other definition can handle
    return true;
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value || element.value.label || "unknown";
  }
}
