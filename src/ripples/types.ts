import { ReactNode } from "react";
import { MessageDescriptor } from "react-intl";

export type Ripple = {
  content: {
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
  TTL: number;
  /**
   * Extra buttons rendered apart from the default "OK" button
   */
  actions?: Array<{
    label: MessageDescriptor;
    onClick: () => void;
  }>;
};
