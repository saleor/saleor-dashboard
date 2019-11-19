import { DocumentNode } from "graphql";
import { useState } from "react";

import Debounce from "../components/Debounce";
import { UseQueryResult } from "./makeQuery";

export interface SearchQueryVariables {
  after?: string;
  first: number;
  query: string;
}

function makeSearch<TData, TVariables extends SearchQueryVariables>(
  query: DocumentNode,
  loadMoreFn: (result: UseQueryResult<TData, TVariables>) => void
): UseSearchHook<TData, TVariables> {
  const [searchQuery, setSearchQuery] = useState("");
}
