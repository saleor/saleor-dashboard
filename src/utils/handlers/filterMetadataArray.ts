import { type MetadataInput } from "@dashboard/graphql";

export const filterMetadataArray = (metadataInputs: MetadataInput[]) =>
  metadataInputs.filter(input => !!input.key);
