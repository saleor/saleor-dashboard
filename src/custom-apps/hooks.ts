import { useQuery } from "@apollo/client";

import { buildEventsMap, IntrospectionQuery } from "./utils";

export const useAvailableEvents = () => {
  const { data: introspectionData } = useQuery(IntrospectionQuery, {
    fetchPolicy: "network-only",
  });
  const elements = introspectionData?.__schema?.types || [];
  const availableEvents = buildEventsMap(elements);

  return availableEvents;
};
