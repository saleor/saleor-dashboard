import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { createProductExportQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import {
  ExportInfoInput,
  ExportProductsInput as ExportProductsInputType,
  ExportScope,
  FileTypesEnum,
  InputMaybe,
  ProductFilterInput,
  Scalars,
} from "@dashboard/graphql";

export class ProductsExportParameters {
  private readonly exportInfo?: InputMaybe<ExportInfoInput>;

  private readonly fileType: FileTypesEnum;

  private readonly filter?: InputMaybe<ProductFilterInput>;

  private readonly ids?: InputMaybe<Array<Scalars["ID"]>>;

  private readonly scope: ExportScope;

  constructor({ exportInfo, fileType, filter, ids, scope }: ExportProductsInputType) {
    this.exportInfo = exportInfo;
    this.fileType = fileType;
    this.filter = filter;
    this.ids = ids;
    this.scope = scope;
  }

  static fromFilters({
    exportData,
    filterContainer,
    searchQuery,
  }: {
    exportData: Omit<ExportProductsInputType, "filter"> & { scope: ExportScope };
    filterContainer: FilterContainer;
    searchQuery?: string;
  }): ProductsExportParameters {
    const exportInput: ExportProductsInputType = { ...exportData };

    // Include filter when exporting filtered products
    if (exportData.scope === ExportScope.FILTER) {
      const filter = createProductExportQueryVariables(filterContainer);
      const hasConditionalFilters =
        filter && typeof filter === "object" && Object.keys(filter).length > 0;
      const hasSearchQuery = searchQuery;

      if (!hasConditionalFilters && !hasSearchQuery) {
        // Fall back to exporting all when no filters or search query are applied
        exportInput.scope = ExportScope.ALL;
      } else {
        // Build complete filter with both conditional filters and search query
        exportInput.filter = {
          ...(hasConditionalFilters ? filter : {}),
          ...(hasSearchQuery ? { search: searchQuery } : {}),
        };
      }
    }

    return new ProductsExportParameters(exportInput);
  }

  asExportProductsInput() {
    return {
      exportInfo: this.exportInfo,
      fileType: this.fileType,
      filter: this.filter,
      ids: this.ids,
      scope: this.scope,
    } satisfies ExportProductsInputType;
  }
}
