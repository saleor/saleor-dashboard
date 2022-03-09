import { MetadataInput } from "@saleor/graphql";

export const filterMetadataArray = (metadataInputs: MetadataInput[]) =>
  metadataInputs.filter(input => !!input.key);
