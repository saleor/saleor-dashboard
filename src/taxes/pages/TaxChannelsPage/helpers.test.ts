import { taxConfigurations } from "@dashboard/taxes/fixtures";

import { getSelectedTaxStrategy, getTaxAppId } from "./helpers";

describe("Tax Channels Page helpers", () => {
  describe("getTaxAppId", () => {
    it("should return id of tax app if strategy is not flat rate", () => {
      const result = getTaxAppId("42");

      expect(result).toEqual("42");
    });
    it("should return null if strategy is flat rate", () => {
      const result = getTaxAppId("FLAT_RATES");

      expect(result).toEqual(null);
    });
  });
  describe("getSelectedTaxStrategy", () => {
    const [flatRateConfiguration, taxAppConfiguration] = taxConfigurations;

    it("should return flat app strategy if strategy is one", () => {
      const result = getSelectedTaxStrategy(flatRateConfiguration);

      expect(result).toEqual("FLAT_RATES");
    });
    it("should return id of tax app if strategy is not flat rate", () => {
      const result = getSelectedTaxStrategy(taxAppConfiguration);

      expect(result).toEqual("42");
    });
    it("should return legacy-flow if strategy is not set - UI will show warning", () => {
      const result = getSelectedTaxStrategy({
        ...taxAppConfiguration,
        taxAppId: null,
      });

      expect(result).toEqual("legacy-flow");
    });
  });
});
