import { MetadataInput } from "@saleor/sdk/dist/apollo/types";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";

export interface GenericMetadataInput extends MetadataInput {
  __typename?: string;
}

const removeTypename = ({ __typename, ...input }: GenericMetadataInput) => ({
  ...input,
});

export const areMetadataArraysEqual = (
  before: GenericMetadataInput[],
  after: MetadataInput[],
) => isEqual(sortBy(before.map(removeTypename)), sortBy(after));
