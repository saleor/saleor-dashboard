import { type FlagList } from "./availableFlags";

export interface Strategy {
  fetchAll: () => Promise<FlagList>;
}
