import { defaultScenario } from "./default.ts";
import { ordersScenario } from "./orders.ts";
import { productMediaTranslationsScenario } from "./productMediaTranslations.ts";
import type { Scenario } from "./scenario.ts";

/** Every scenario a spec may ask for by name, via `test.use({ scenario: "..." })`. */
export const SCENARIOS: Record<string, Scenario> = {
  [defaultScenario.name]: defaultScenario,
  [ordersScenario.name]: ordersScenario,
  [productMediaTranslationsScenario.name]: productMediaTranslationsScenario,
};

export const scenarioByName = (name: string): Scenario => {
  const scenario = SCENARIOS[name];

  if (!scenario) {
    throw new Error(`unknown scenario "${name}" - known: ${Object.keys(SCENARIOS).join(", ")}`);
  }

  return scenario;
};
