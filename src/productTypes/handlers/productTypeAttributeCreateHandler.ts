import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  type AttributeValueEditDialogFormData,
  getAttributeData,
} from "@dashboard/attributes/utils/data";
import {
  type AttributeCreateInput,
  AttributeErrorCode,
  type AttributeErrorFragment,
  type ProductAttributeType,
  type ProductErrorFragment,
} from "@dashboard/graphql";
import { type CreateMetadataHandlerFunctionResult } from "@dashboard/utils/handlers/metadataCreateHandler";

export interface ProductTypeAttributeCreateMutations {
  attributeCreate: (options: { variables: { input: AttributeCreateInput } }) => Promise<{
    data?: {
      attributeCreate?: {
        attribute?: { id: string } | null;
        errors: AttributeErrorFragment[];
      };
    };
  }>;
  assignCreatedAttribute: (options: {
    variables: {
      id: string;
      operations: Array<{ id: string; type: ProductAttributeType }>;
    };
  }) => Promise<{
    data?: {
      productAttributeAssign?: {
        errors: ProductErrorFragment[];
      };
    };
  }>;
}

export interface ProductTypeAttributeCreateParams {
  productTypeId: string;
  productAttributeType: ProductAttributeType;
  formData: AttributePageFormData;
  values: AttributeValueEditDialogFormData[];
  createFailedMessage: string;
  formatAssignErrors: (errors: ProductErrorFragment[]) => string;
}

export interface ProductTypeAttributeCreateOutcome
  extends CreateMetadataHandlerFunctionResult<AttributeErrorFragment> {
  assignErrorMessage?: string;
}

export async function executeProductTypeAttributeCreate(
  {
    productTypeId,
    productAttributeType,
    formData,
    values,
    createFailedMessage,
    formatAssignErrors,
  }: ProductTypeAttributeCreateParams,
  { attributeCreate, assignCreatedAttribute }: ProductTypeAttributeCreateMutations,
): Promise<ProductTypeAttributeCreateOutcome> {
  const createResult = await attributeCreate({
    variables: {
      input: getAttributeData(formData, values) as AttributeCreateInput,
    },
  });
  const createErrors = createResult.data?.attributeCreate?.errors ?? [];

  if (createErrors.length > 0) {
    return { errors: createErrors };
  }

  const attributeId = createResult.data?.attributeCreate?.attribute?.id;

  if (!attributeId) {
    return {
      errors: [
        {
          __typename: "AttributeError",
          code: AttributeErrorCode.INVALID,
          field: null,
          message: createFailedMessage,
        },
      ],
    };
  }

  const assignResult = await assignCreatedAttribute({
    variables: {
      id: productTypeId,
      operations: [{ id: attributeId, type: productAttributeType }],
    },
  });
  const assignErrors = assignResult.data?.productAttributeAssign?.errors ?? [];

  if (assignErrors.length > 0) {
    const assignErrorMessage = formatAssignErrors(assignErrors);

    return {
      errors: [
        {
          __typename: "AttributeError",
          code: AttributeErrorCode.INVALID,
          field: null,
          message: assignErrorMessage,
        },
      ],
      assignErrorMessage,
    };
  }

  return { id: attributeId, errors: [] };
}
