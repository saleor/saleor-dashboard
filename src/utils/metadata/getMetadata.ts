import { type MetadataFormData } from "@dashboard/components/Metadata/types";

function getMetadata(
  data: MetadataFormData,
  isMetadataModified: boolean,
  isPrivateMetadataModified: boolean,
) {
  return {
    metadata: isMetadataModified ? data.metadata : undefined,
    privateMetadata: isPrivateMetadataModified ? data.privateMetadata : undefined,
  };
}

export default getMetadata;
