import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import {
  type AttributeValueEditDialogFormData,
  getAttributeData,
} from "@dashboard/attributes/utils/data";
import {
  type AttributeCreateInput,
  AttributeErrorCode,
  type AttributeErrorFragment,
  type PageErrorFragment,
} from "@dashboard/graphql";
import { type CreateMetadataHandlerFunctionResult } from "@dashboard/utils/handlers/metadataCreateHandler";

export interface PageTypeAttributeCreateMutations {
  attributeCreate: (options: { variables: { input: AttributeCreateInput } }) => Promise<{
    data?: {
      attributeCreate?: {
        attribute?: { id: string } | null;
        errors: AttributeErrorFragment[];
      };
    };
  }>;
  assignCreatedAttribute: (options: { variables: { id: string; ids: string[] } }) => Promise<{
    data?: {
      pageAttributeAssign?: {
        errors: PageErrorFragment[];
      };
    };
  }>;
}

export interface PageTypeAttributeCreateParams {
  pageTypeId: string;
  formData: AttributePageFormData;
  values: AttributeValueEditDialogFormData[];
  createFailedMessage: string;
  formatAssignErrors: (errors: PageErrorFragment[]) => string;
}

export interface PageTypeAttributeCreateOutcome
  extends CreateMetadataHandlerFunctionResult<AttributeErrorFragment> {
  assignErrorMessage?: string;
}

export async function executePageTypeAttributeCreate(
  {
    pageTypeId,
    formData,
    values,
    createFailedMessage,
    formatAssignErrors,
  }: PageTypeAttributeCreateParams,
  { attributeCreate, assignCreatedAttribute }: PageTypeAttributeCreateMutations,
): Promise<PageTypeAttributeCreateOutcome> {
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
      id: pageTypeId,
      ids: [attributeId],
    },
  });
  const assignErrors = assignResult.data?.pageAttributeAssign?.errors ?? [];

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
