import type { E2eConfig } from "../config.ts";

/**
 * A scenario is a named database state the suite can restore in about a second.
 *
 * It is *built* once per Saleor image - slowly, through `populatedb` and the GraphQL API -
 * and then captured as a data-only dump. Tests never run the build; they restore the dump.
 * That is what lets every test start from a pristine database without paying for it.
 *
 * Build through the API wherever the API can express the state. Reach for raw SQL only
 * where it cannot (a row shaped by an older migration, a stock no mutation would leave
 * behind) - the dump captures both the same way, but SQL is the thing that rots when
 * Saleor's tables change, and this suite deliberately tracks a floating image.
 */
export interface Scenario {
  name: string;
  /**
   * Arranges the state. `adminToken` is a thunk because a scenario building from an
   * empty database has no admin to authenticate as until its own build creates one.
   */
  build: (config: E2eConfig, adminToken: () => Promise<string>) => Promise<void>;
}
