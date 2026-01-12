import { ReactNode } from "react";
import { MessageDescriptor } from "react-intl";

export type RippleType = "feature" | "improvement" | "bugfix";

/**
 * Base properties shared by all action types
 */
interface RippleActionBase {
  label: MessageDescriptor;
  /**
   * If true, this action won't be shown in the global "What's New" modal.
   * Useful for actions that open the modal itself (would be redundant).
   */
  hideInModal?: boolean;
}

/**
 * Action with a click handler for in-app actions
 */
interface RippleActionWithOnClick extends RippleActionBase {
  onClick: () => void;
  href?: never;
}

/**
 * Action with an href for external links
 */
interface RippleActionWithHref extends RippleActionBase {
  href: string;
  onClick?: never;
}

/**
 * A ripple action must have either onClick or href, but not both
 */
export type RippleAction = RippleActionWithOnClick | RippleActionWithHref;

// TODO Consider translations
export type Ripple = {
  /**
   * Type of change - used for badge display in the changelog
   */
  type: RippleType;
  /**
   * Date when the Ripple was added to the system. It doesn't have to be accurate, but will be used for sorting.
   * Can be approx date of the release
   */
  dateAdded: Date;
  content: {
    /**
     * Short header-like text for global view
     */
    oneLiner: string;
    /**
     * In global changelog-like list
     */
    global: ReactNode; // React Node / md -> react / md -> html or just plain here
    /**
     * In contextual ripple like tooltip around the element
     */
    contextual: ReactNode; // React Node / md -> react / md -> html or just plain here
  };
  /**
   * After first mount, how long to show the contextual ripple (seconds). In global list it's permanent.
   */
  TTL_seconds: number;
  // A unique ID to reference Ripple when checking it's state in the storage
  ID: string;
  /**
   * Extra buttons rendered apart from the default "OK" button.
   * Each action must have either onClick (for in-app actions) or href (for external links).
   */
  actions?: RippleAction[];
};
