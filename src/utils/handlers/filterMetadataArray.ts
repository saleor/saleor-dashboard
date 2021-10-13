import { MetadataInput } from "@saleor/types/globalTypes";

export const filterMetadataArray = (metadataInputs: MetadataInput[]) =>
  metadataInputs.filter(input => !!input.key);
