import { FetchResult } from "@apollo/client";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import {
  MetadataErrorFragment,
  MetadataInput,
  UpdateMetadataMutation,
  UpdateMetadataMutationVariables,
  UpdatePrivateMetadataMutation,
  UpdatePrivateMetadataMutationVariables,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { arrayDiff } from "@dashboard/utils/arrays";

import { filterMetadataArray } from "./filterMetadataArray";
import { areMetadataArraysEqual } from "./metadataUpdateHelpers";

export interface ObjectWithMetadata {
  id: string;
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[];
}

function createMetadataUpdateHandler<TData extends MetadataFormData, TError>(
  initial: ObjectWithMetadata,
  update: (data: TData) => SubmitPromise<TError[] | undefined>,
  updateMetadata: (
    variables: UpdateMetadataMutationVariables,
  ) => Promise<FetchResult<UpdateMetadataMutation>>,
  updatePrivateMetadata: (
    variables: UpdatePrivateMetadataMutationVariables,
  ) => Promise<FetchResult<UpdatePrivateMetadataMutation>>,
) {
  return async (data: TData): Promise<Array<MetadataErrorFragment | TError>> => {
    const errors = await update(data);
    const hasMetadataChanged = !areMetadataArraysEqual(initial.metadata, data.metadata);
    const hasPrivateMetadataChanged = !areMetadataArraysEqual(
      initial.privateMetadata,
      data.privateMetadata,
    );

    if (errors && errors.length > 0) {
      return errors;
    }

    if (errors?.length === 0) {
      if (data.metadata && hasMetadataChanged) {
        const initialKeys = initial.metadata.map(m => m.key);
        const modifiedKeys = data.metadata.map(m => m.key);
        const keyDiff = arrayDiff(initialKeys, modifiedKeys);
        const metadataInput = filterMetadataArray(data.metadata);

        if (metadataInput.length || keyDiff.removed.length) {
          const updateMetaResult = await updateMetadata({
            id: initial.id,
            input: metadataInput,
            keysToDelete: keyDiff.removed,
          });
          const updateMetaErrors = [
            ...(updateMetaResult.data?.deleteMetadata?.errors || []),
            ...(updateMetaResult.data?.updateMetadata?.errors || []),
          ];

          if (updateMetaErrors.length > 0) {
            return updateMetaErrors;
          }
        }
      }

      if (data.privateMetadata && hasPrivateMetadataChanged) {
        const initialKeys = initial.privateMetadata.map(m => m.key);
        const modifiedKeys = data.privateMetadata.map(m => m.key);
        const keyDiff = arrayDiff(initialKeys, modifiedKeys);
        const privateMetadataInput = filterMetadataArray(data.privateMetadata);

        if (privateMetadataInput.length || keyDiff.removed.length) {
          const updatePrivateMetaResult = await updatePrivateMetadata({
            id: initial.id,
            input: privateMetadataInput,
            keysToDelete: keyDiff.removed,
          });
          const updatePrivateMetaErrors = [
            ...(updatePrivateMetaResult.data?.deletePrivateMetadata?.errors || []),
            ...(updatePrivateMetaResult.data?.updatePrivateMetadata?.errors || []),
          ];

          if (updatePrivateMetaErrors.length > 0) {
            return updatePrivateMetaErrors;
          }
        }
      }
    }

    return [];
  };
}

export default createMetadataUpdateHandler;
