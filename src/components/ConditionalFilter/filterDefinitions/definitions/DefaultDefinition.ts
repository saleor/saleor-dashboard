import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableDefinition } from "./BaseMappableDefinition";

export class DefaultDefinition extends BaseMappableDefinition {
  public canHandle(): boolean {
    // Default definition handles all elements that no other definition can handle
    return true;
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(element: FilterElement): string {
    return element.value.value || element.value.label || "unknown";
  }
}
