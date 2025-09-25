import { ReactNode } from "react";
import { MessageDescriptor } from "react-intl";

// TODO Consider translations
export type Ripple = {
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
   * Extra buttons rendered apart from the default "OK" button
   */
  actions?: Array<{
    label: MessageDescriptor;
    onClick: () => void;
  }>;
};
