import { FetchResult } from "@apollo/client";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import { MetadataErrorFragment } from "@saleor/fragments/types/MetadataErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { MetadataInput } from "@saleor/types/globalTypes";
import { arrayDiff } from "@saleor/utils/arrays";

import {
  UpdateMetadata,
  UpdateMetadataVariables
} from "../metadata/types/UpdateMetadata";
import {
  UpdatePrivateMetadata,
  UpdatePrivateMetadataVariables
} from "../metadata/types/UpdatePrivateMetadata";
import { filterMetadataArray } from "./filterMetadataArray";
import { areMetadataArraysEqual } from "./metadataUpdateHelpers";

interface ObjectWithMetadata {
  id: string;
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[];
}

function createMetadataUpdateHandler<TData extends MetadataFormData, TError>(
  initial: ObjectWithMetadata,
  update: (data: TData) => SubmitPromise<TError[]>,
  updateMetadata: (
    variables: UpdateMetadataVariables
  ) => Promise<FetchResult<UpdateMetadata>>,
  updatePrivateMetadata: (
    variables: UpdatePrivateMetadataVariables
  ) => Promise<FetchResult<UpdatePrivateMetadata>>
) {
  return async (
    data: TData
  ): Promise<Array<MetadataErrorFragment | TError>> => {
    const errors = await update(data);

    const hasMetadataChanged = !areMetadataArraysEqual(
      initial.metadata,
      data.metadata
    );
    const hasPrivateMetadataChanged = !areMetadataArraysEqual(
      initial.privateMetadata,
      data.privateMetadata
    );

    if (errors.length > 0) {
      return errors;
    }

    if (errors.length === 0) {
      if (data.metadata && hasMetadataChanged) {
        const initialKeys = initial.metadata.map(m => m.key);
        const modifiedKeys = data.metadata.map(m => m.key);

        const keyDiff = arrayDiff(initialKeys, modifiedKeys);

        const updateMetaResult = await updateMetadata({
          id: initial.id,
          input: filterMetadataArray(data.metadata),
          keysToDelete: keyDiff.removed
        });

        const updateMetaErrors = [
          ...(updateMetaResult.data.deleteMetadata.errors || []),
          ...(updateMetaResult.data.updateMetadata.errors || [])
        ];

        if (updateMetaErrors.length > 0) {
          return updateMetaErrors;
        }
      }

      if (data.privateMetadata && hasPrivateMetadataChanged) {
        const initialKeys = initial.privateMetadata.map(m => m.key);
        const modifiedKeys = data.privateMetadata.map(m => m.key);

        const keyDiff = arrayDiff(initialKeys, modifiedKeys);

        const updatePrivateMetaResult = await updatePrivateMetadata({
          id: initial.id,
          input: filterMetadataArray(data.privateMetadata),
          keysToDelete: keyDiff.removed
        });

        const updatePrivateMetaErrors = [
          ...(updatePrivateMetaResult.data.deletePrivateMetadata.errors || []),
          ...(updatePrivateMetaResult.data.updatePrivateMetadata.errors || [])
        ];

        if (updatePrivateMetaErrors.length > 0) {
          return updatePrivateMetaErrors;
        }
      }
    }

    return [];
  };
}

export default createMetadataUpdateHandler;
