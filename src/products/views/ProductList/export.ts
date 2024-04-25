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
