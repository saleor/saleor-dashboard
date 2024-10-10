import { ExportScope, FileTypesEnum, ProductFieldEnum } from "@dashboard/graphql";
import { ExportInfoInput } from "@saleor/sdk/dist/apollo/types";

import { ProductsExportParameters } from "./export";
import { getFilterVariables } from "./filters";

const exportParams = {
  exportInfo: {
    attributes: [],
    warehouses: ["warehouse1"],
    channels: ["Q2hhbm5lbDoyMjQ0"],
    fields: [ProductFieldEnum.CHARGE_TAXES],
  } satisfies ExportInfoInput,
  fileType: FileTypesEnum.CSV,
  filter: undefined,
  ids: [],
  scope: ExportScope.ALL,
};

const mock = {
  ...exportParams,
  ids: [],
};

const mockWithOverflow = {
  ...mock,
  ...getFilterVariables({
    filterContainer: [],
    queryParams: {
      categories: undefined,
    },
  }),
};

describe("Passing input to product export", () => {
  it("should return the correct export parameters", () => {
    const productExportParams = new ProductsExportParameters(mock);

    expect(productExportParams.asExportProductsInput()).toStrictEqual(mock);
  });
  it("should return the correct export parameters despite overflow of data", () => {
    const productExportParams = new ProductsExportParameters(mockWithOverflow);

    expect(productExportParams.asExportProductsInput()).toStrictEqual(mock);
    expect(productExportParams.asExportProductsInput()).not.toHaveProperty("where");
  });
});
