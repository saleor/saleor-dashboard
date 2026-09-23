import { ADMIN, STAFF_PASSWORD } from "../config.ts";
import { manage } from "../lib/docker.ts";
import { step } from "../lib/progress.ts";
import type { Scenario } from "./scenario.ts";

/**
 * The shop every spec starts from: Saleor's own `populatedb` fixture.
 *
 * It is used rather than a hand-written bootstrap because it is maintained by Saleor core
 * (so it follows schema changes for free) and because it is *broad* - channels, categories,
 * collections, products, pages, menus, vouchers, gift cards, orders, customers, promotions,
 * shipping zones, warehouses and tax classes, which is the shape of a dashboard test suite.
 *
 * It also mints the staff users this suite signs in as; see `lib/actors.ts`.
 *
 * `--withoutimages` is deliberate: product media would add minutes to the build and
 * megabytes to every restore, and no dashboard assertion so far depends on a thumbnail.
 */
export const defaultScenario: Scenario = {
  name: "default",
  build: async config => {
    await step("running populatedb", () =>
      manage(config, [
        "populatedb",
        "--createsuperuser",
        "--withoutimages",
        `--superuser_password=${ADMIN.password}`,
        `--staff_password=${STAFF_PASSWORD}`,
        `--user_password=${STAFF_PASSWORD}`,
      ]),
    );
  },
};
