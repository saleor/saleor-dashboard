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

function createMetadataCreateHandler<T extends MetadataFormData>(
  create: (data: T) => Promise<string>,
  setMetadata: MutationFunction<UpdateMetadata, UpdateMetadataVariables>,
  setPrivateMetadata: MutationFunction<
    UpdatePrivateMetadata,
    UpdatePrivateMetadataVariables
  >
) {
  return async (data: T) => {
    const id = await create(data);

    if (id === null) {
      return null;
    }

    if (data.metadata.length > 0) {
      const updateMetaResult = await setMetadata({
        variables: {
          id,
          input: data.metadata,
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
          input: data.privateMetadata,
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
