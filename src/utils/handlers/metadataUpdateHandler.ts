import { MetadataFormData } from "@saleor/components/Metadata/types";
import { MetadataErrorFragment } from "@saleor/fragments/types/MetadataErrorFragment";
import { MetadataInput } from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";
import { MutationFetchResult } from "react-apollo";

import {
  UpdateMetadata,
  UpdateMetadataVariables
} from "../metadata/types/UpdateMetadata";
import {
  UpdatePrivateMetadata,
  UpdatePrivateMetadataVariables
} from "../metadata/types/UpdatePrivateMetadata";

interface ObjectWithMetadata {
  id: string;
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[];
}

function createMetadataUpdateHandler<TData extends MetadataFormData, TError>(
  initial: ObjectWithMetadata,
  update: (data: TData) => Promise<TError[]>,
  updateMetadata: (
    variables: UpdateMetadataVariables
  ) => Promise<MutationFetchResult<UpdateMetadata>>,
  updatePrivateMetadata: (
    variables: UpdatePrivateMetadataVariables
  ) => Promise<MutationFetchResult<UpdatePrivateMetadata>>
) {
  return async (
    data: TData
  ): Promise<Array<MetadataErrorFragment | TError>> => {
    const errors = await update(data);

    if (errors.length > 0) {
      return errors;
    }

    if (errors.length === 0) {
      if (data.metadata) {
        const metaDiff = diff(
          initial.metadata,
          data.metadata,
          (a, b) => a.key === b.key
        );

        const updateMetaResult = await updateMetadata({
          id: initial.id,
          input: data.metadata,
          keysToDelete: metaDiff.removed.map(meta => meta.key)
        });
        const updateMetaErrors = [
          ...(updateMetaResult.data.deleteMetadata.errors || []),
          ...(updateMetaResult.data.updateMetadata.errors || [])
        ];

        if (updateMetaErrors.length > 0) {
          return updateMetaErrors;
        }
      }
      if (data.privateMetadata) {
        const privateMetaDiff = diff(
          initial.privateMetadata,
          data.privateMetadata,
          (a, b) => a.key === b.key
        );

        const updatePrivateMetaResult = await updatePrivateMetadata({
          id: initial.id,
          input: data.privateMetadata,
          keysToDelete: privateMetaDiff.removed.map(meta => meta.key)
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
