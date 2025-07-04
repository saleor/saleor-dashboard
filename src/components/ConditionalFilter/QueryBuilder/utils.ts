import { AttributeInput } from "../../../graphql";
import { StaticQueryPart } from "./types";

export const mapStaticQueryPartToLegacyVariables = (
  queryPart: StaticQueryPart | AttributeInput,
) => {
  if (typeof queryPart !== "object" || queryPart === null) {
    return queryPart;
  }

  if ("range" in queryPart && queryPart.range) {
    return queryPart.range;
  }

  if ("eq" in queryPart && queryPart.eq) {
    return queryPart.eq;
  }

  if ("oneOf" in queryPart && queryPart.oneOf) {
    return queryPart.oneOf;
  }

  return queryPart;
};
