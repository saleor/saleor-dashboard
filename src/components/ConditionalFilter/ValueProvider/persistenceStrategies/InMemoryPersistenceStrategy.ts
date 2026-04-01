import { FilterContainer } from "../../FilterElement";
import { PersistenceStrategy } from "../FilterValueController";

export interface InMemoryPersistenceStrategyConfig {
  /**
   * Initial state for the in-memory storage.
   * If not provided, starts with an empty FilterContainer
   */
  initialState?: FilterContainer;

  /**
   * Callback when state changes in memory
   */
  onStateChange?: (state: FilterContainer) => void;
}
/**
 * TODO:
 * - Use internal state to store FilterContainer
 * - Support initial state from config
 * - Call onStateChange callback when state updates
 * - Ensure proper cleanup
 */
export class InMemoryPersistenceStrategy implements PersistenceStrategy {
  constructor(private config: InMemoryPersistenceStrategyConfig) {}

  persist(_value: FilterContainer): void {
    // TODO: Implementation in subtask 1.3
    throw new Error("InMemoryPersistenceStrategy.persist: Not implemented yet");
  }

  clear(): void {
    // TODO: Implementation in subtask 1.3
    throw new Error("InMemoryPersistenceStrategy.clear: Not implemented yet");
  }
}
