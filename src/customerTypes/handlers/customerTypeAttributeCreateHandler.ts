import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  type AttributeValueEditDialogFormData,
  getAttributeData,
} from "@dashboard/attributes/utils/data";
import {
  type AttributeCreateInput,
  AttributeErrorCode,
  type AttributeErrorFragment,
  type CustomerTypeAssignAttributesErrorFragment,
} from "@dashboard/graphql";
import { type CreateMetadataHandlerFunctionResult } from "@dashboard/utils/handlers/metadataCreateHandler";

export interface CustomerTypeAttributeCreateMutations {
  attributeCreate: (options: { variables: { input: AttributeCreateInput } }) => Promise<{
    data?: {
      attributeCreate?: {
        attribute?: { id: string } | null;
        errors: AttributeErrorFragment[];
      };
    };
  }>;
  assignCreatedAttribute: (options: {
    variables: { customerTypeId: string; attributeIds: string[] };
  }) => Promise<{
    data?: {
      customerTypeAssignAttributes?: {
        errors: CustomerTypeAssignAttributesErrorFragment[];
      };
    };
  }>;
}

export interface CustomerTypeAttributeCreateParams {
  customerTypeId: string;
  formData: AttributePageFormData;
  values: AttributeValueEditDialogFormData[];
  createFailedMessage: string;
  formatAssignErrors: (errors: CustomerTypeAssignAttributesErrorFragment[]) => string;
}

export interface CustomerTypeAttributeCreateOutcome
  extends CreateMetadataHandlerFunctionResult<AttributeErrorFragment> {
  assignErrorMessage?: string;
}

export async function executeCustomerTypeAttributeCreate(
  {
    customerTypeId,
    formData,
    values,
    createFailedMessage,
    formatAssignErrors,
  }: CustomerTypeAttributeCreateParams,
  { attributeCreate, assignCreatedAttribute }: CustomerTypeAttributeCreateMutations,
): Promise<CustomerTypeAttributeCreateOutcome> {
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
      customerTypeId,
      attributeIds: [attributeId],
    },
  });
  const assignErrors = assignResult.data?.customerTypeAssignAttributes?.errors ?? [];

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
