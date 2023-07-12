import { FlagList } from "./availableFlags";

export interface Strategy {
  fetchAll: () => Promise<FlagList>;
}

export interface PersistableStrategy extends Strategy {
  store?: (flags: FlagList) => Promise<void>;
}
