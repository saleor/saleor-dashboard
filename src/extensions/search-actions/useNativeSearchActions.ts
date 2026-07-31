import { type ContextualSearchAction } from "./types";

/**
 * Central aggregator for native (non-extension) command-palette actions.
 *
 * Feature modules contribute contextual actions here by spreading their own action
 * arrays into the returned list. Being a hook, contributors may use `useIntl`,
 * `useNavigator`, permissions, etc. when building their actions.
 *
 * Actions are filtered by view + permissions in {@link useSearchActions}, so authors
 * only need to declare `views`/`permissions` — no manual gating required.
 */
export const useNativeSearchActions = (): ContextualSearchAction[] => {
  return [];
};
