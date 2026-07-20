import { type PermissionEnum } from "@dashboard/graphql";

import { type AppExtensionView } from "../domain/app-extension-manifest-views";
import { type SearchActionContext } from "./resolveSearchActionContext";

/**
 * A single action rendered in the command palette (Cmd+K), contributed either by an
 * installed app (SEARCH_ACTION extension) or by native dashboard code. The palette
 * filters actions by the current view and the user's permissions, then invokes
 * `onSelect` with the resolved context.
 */
export interface ContextualSearchAction {
  id: string;
  label: string;
  /** Group heading under which the action is listed in the palette. */
  section: string;
  /** Views the action is scoped to. Undefined = shown in every view. */
  views?: AppExtensionView[];
  /** Permissions the user must hold for the action to appear. Undefined/empty = always. */
  permissions?: PermissionEnum[];
  /** Optional icon (app logo for extension-provided actions). */
  avatar?: string;
  /** Invoked when the action is activated, receiving the current view + entity context. */
  onSelect: (context: SearchActionContext) => void;
}
