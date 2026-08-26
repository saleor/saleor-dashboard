import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";

import { type ItemOption } from "../FilterElement/ConditionValue";
import { type LeftOperand } from "../LeftOperandsProvider";

export const FILTER_CHOICES_PAGE_SIZE = DEFAULT_INITIAL_SEARCH_DATA.first;

export interface FilterChoicesPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface FilterChoicesPage<T = ItemOption> {
  options: T[];
  pageInfo: FilterChoicesPageInfo;
}

export const NO_MORE_CHOICES: FilterChoicesPageInfo = {
  hasNextPage: false,
  endCursor: null,
};

export const emptyChoicesPage = <T = ItemOption>(): FilterChoicesPage<T> => ({
  options: [],
  pageInfo: NO_MORE_CHOICES,
});

export const emptyAttributeChoicesPage = (): FilterChoicesPage<LeftOperand> =>
  emptyChoicesPage<LeftOperand>();

export interface ChoiceFetchState {
  generations: Record<string, number>;
  pageInfo: Record<string, FilterChoicesPageInfo>;
  query: Record<string, string>;
  fetchMoreInFlight: Record<string, boolean>;
}

export const createChoiceFetchState = (): ChoiceFetchState => ({
  generations: {},
  pageInfo: {},
  query: {},
  fetchMoreInFlight: {},
});

export const startReplaceChoiceFetch = (
  state: ChoiceFetchState,
  fetchKey: string,
  inputValue: string,
): number => {
  const generation = (state.generations[fetchKey] ?? 0) + 1;

  state.generations[fetchKey] = generation;
  state.pageInfo[fetchKey] = NO_MORE_CHOICES;
  state.query[fetchKey] = inputValue;
  state.fetchMoreInFlight[fetchKey] = false;

  return generation;
};

export const startAppendChoiceFetch = (
  state: ChoiceFetchState,
  fetchKey: string,
): number | null => {
  const page = state.pageInfo[fetchKey];

  if (!page?.hasNextPage || !page.endCursor || state.fetchMoreInFlight[fetchKey]) {
    return null;
  }

  state.fetchMoreInFlight[fetchKey] = true;

  return state.generations[fetchKey] ?? 0;
};

export const isCurrentChoiceGeneration = (
  state: ChoiceFetchState,
  fetchKey: string,
  generation: number,
): boolean => state.generations[fetchKey] === generation;

export const hasSameChoiceQuery = (
  state: ChoiceFetchState,
  fetchKey: string,
  inputValue: string,
): boolean => state.query[fetchKey] === inputValue;

export const hydrateChoiceCount = (ids: string[]): number => Math.max(ids.length, 1);

export const pageInfoFromConnection = (
  connection?: {
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string | null;
    } | null;
  } | null,
): FilterChoicesPageInfo => ({
  hasNextPage: connection?.pageInfo?.hasNextPage ?? false,
  endCursor: connection?.pageInfo?.endCursor ?? null,
});

export const appendUniqueOptions = <T extends { value: string }>(
  existing: T[],
  incoming: T[],
): T[] => {
  const seen = new Set(existing.map(option => option.value));
  const extra = incoming.filter(option => !seen.has(option.value));

  return extra.length === 0 ? existing : [...existing, ...extra];
};

export const fetchHandlerPage = async <T = ItemOption>(
  handler: {
    fetch: (after?: string | null) => Promise<unknown[]>;
    pageInfo?: FilterChoicesPageInfo;
  },
  after?: string | null,
): Promise<FilterChoicesPage<T>> => {
  const options = (await handler.fetch(after)) as T[];

  return {
    options,
    pageInfo: handler.pageInfo ?? NO_MORE_CHOICES,
  };
};
