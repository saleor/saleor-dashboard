import { MetadataFormData } from "@saleor/components/Metadata/types";
import { MutationFunction } from "react-apollo";

import {
  UpdateMetadata,
  UpdateMetadataVariables
} from "../metadata/types/UpdateMetadata";
import {
  UpdatePrivateMetadata,
  UpdatePrivateMetadataVariables
} from "../metadata/types/UpdatePrivateMetadata";
import { filterMetadataArray } from "./filterMetadataArray";

export interface CreateMetadataHandlerFunctionResult<TError> {
  id?: string;
  errors?: TError[];
}

function createMetadataCreateHandler<T extends MetadataFormData, TError>(
  create: (data: T) => Promise<CreateMetadataHandlerFunctionResult<TError>>,
  setMetadata: MutationFunction<UpdateMetadata, UpdateMetadataVariables>,
  setPrivateMetadata: MutationFunction<
    UpdatePrivateMetadata,
    UpdatePrivateMetadataVariables
  >
) {
  return async (data: T) => {
    const { id, errors } = await create(data);

    if (id === null || !!errors?.length) {
      return errors;
    }

    if (data.metadata.length > 0) {
      const updateMetaResult = await setMetadata({
        variables: {
          id,
          input: filterMetadataArray(data.metadata),
          keysToDelete: []
        }
      });
      const updateMetaErrors = [
        ...(updateMetaResult.data.deleteMetadata.errors || []),
        ...(updateMetaResult.data.updateMetadata.errors || [])
      ];

      if (updateMetaErrors.length > 0) {
        return updateMetaErrors;
      }
    }

    if (data.privateMetadata.length > 0) {
      const updatePrivateMetaResult = await setPrivateMetadata({
        variables: {
          id,
          input: filterMetadataArray(data.privateMetadata),
          keysToDelete: []
        }
      });

      const updatePrivateMetaErrors = [
        ...(updatePrivateMetaResult.data.deletePrivateMetadata.errors || []),
        ...(updatePrivateMetaResult.data.updatePrivateMetadata.errors || [])
      ];

      if (updatePrivateMetaErrors.length > 0) {
        return updatePrivateMetaErrors;
      }
    }

    return [];
  };
}

export default createMetadataCreateHandler;
