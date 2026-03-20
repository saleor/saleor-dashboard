import * as AvailableFlags from "../availableFlags";
import { type Strategy } from "../Strategy";

export class DefaultsStrategy implements Strategy {
  fetchAll(): Promise<AvailableFlags.FlagList> {
    return Promise.resolve(AvailableFlags.asFlagValue());
  }
}
