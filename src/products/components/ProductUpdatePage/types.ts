import { RichTextProps } from "@dashboard/attributes/utils/data";
import { AttributeInput } from "@dashboard/components/Attributes";
import { ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import {
  DatagridChangeOpts,
  UseDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@dashboard/components/SingleAutocompleteSelectField";
import {
  MetadataErrorFragment,
  ProductChannelListingUpdateInput,
  ProductFragment,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchWarehousesQuery,
} from "@dashboard/graphql";
import {
  CommonUseFormResultWithHandlers,
  FormChange,
  FormErrors,
  SubmitPromise,
} from "@dashboard/hooks/useForm";
import {
  FormsetAtomicData,
  FormsetChange,
  FormsetData,
} from "@dashboard/hooks/useFormset";
import { UseProductUpdateHandlerError } from "@dashboard/products/views/ProductUpdate/handlers/useProductUpdateHandler";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@dashboard/types";
import { OutputData } from "@editorjs/editorjs";

import { ProductChannelsListingDialogSubmit } from "./ProductChannelsListingsDialog";

export interface ProductUpdateFormData extends MetadataFormData {
  category: string | null;
  taxClassId: string;
  collections: string[];
  isAvailable: boolean;
  name: string;
  rating: number;
  slug: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  trackInventory: boolean;
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
  weight: string;
}
export interface FileAttributeInputData {
  attributeId: string;
  file: File;
}
export type FileAttributeInput = FormsetAtomicData<
  FileAttributeInputData,
  string[]
>;

export interface FileAttributesSubmitData {
  fileAttributes: FileAttributeInput[];
}
export interface ProductUpdateData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  channels: ProductChannelListingUpdateInput;
  description: OutputData;
}
export interface ProductUpdateSubmitData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  channels: ProductChannelListingUpdateInput;
  collections: string[];
  description: OutputData;
  variants: DatagridChangeOpts;
}

export interface ProductUpdateHandlers
  extends Record<
      | "changeMetadata"
      | "selectCategory"
      | "selectCollection"
      | "selectTaxClass",
      FormChange
    >,
    Record<
      "selectAttribute" | "selectAttributeMultiple",
      FormsetChange<string>
    > {
  changeChannels: (id: string, data: ChannelOpts) => void;
  selectAttributeReference: FormsetChange<string[]>;
  selectAttributeFile: FormsetChange<File>;
  reorderAttributeValue: FormsetChange<ReorderEvent>;
  changeVariants: (data: DatagridChangeOpts) => void;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
  updateChannelList: ProductChannelsListingDialogSubmit;
}

export interface UseProductUpdateFormOutput
  extends CommonUseFormResultWithHandlers<
      ProductUpdateData,
      ProductUpdateHandlers
    >,
    RichTextProps {
  datagrid: UseDatagridChangeState;
  formErrors: FormErrors<ProductUpdateSubmitData>;
}

export type UseProductUpdateFormRenderProps = Omit<
  UseProductUpdateFormOutput,
  "datagrid" | "richText"
>;

export interface UseProductUpdateFormOpts
  extends Record<
    "categories" | "collections" | "taxClasses",
    SingleAutocompleteChoiceType[]
  > {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCollections: React.Dispatch<
    React.SetStateAction<MultiAutocompleteChoiceType[]>
  >;
  setSelectedTaxClass: React.Dispatch<React.SetStateAction<string>>;
  selectedCollections: MultiAutocompleteChoiceType[];
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
  hasVariants: boolean;
  referencePages: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  isSimpleProduct: boolean;
}

export type SubmitResult = SubmitPromise<
  Array<UseProductUpdateHandlerError | MetadataErrorFragment>
>;

export interface ProductUpdateFormProps extends UseProductUpdateFormOpts {
  children: (props: UseProductUpdateFormRenderProps) => React.ReactNode;
  product: ProductFragment;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitResult;
  refetch: () => Promise<any>;
  disabled: boolean;
}
