import { defaultScenario } from "./default.ts";
import type { Scenario } from "./scenario.ts";

/** Every scenario a spec may ask for by name, via `test.use({ scenario: "..." })`. */
export const SCENARIOS: Record<string, Scenario> = {
  [defaultScenario.name]: defaultScenario,
};

export const scenarioByName = (name: string): Scenario => {
  const scenario = SCENARIOS[name];

  if (!scenario) {
    throw new Error(`unknown scenario "${name}" - known: ${Object.keys(SCENARIOS).join(", ")}`);
  }

  return scenario;
};
