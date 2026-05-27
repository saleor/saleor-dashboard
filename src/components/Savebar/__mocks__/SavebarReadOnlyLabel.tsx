import type * as React from "react";

export const ReadOnlyLabel = ({ children }: { children?: React.ReactNode }) => (
  <div data-test-id="savebar-read-only">{children ?? "Read-only"}</div>
);
