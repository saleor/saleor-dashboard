import { type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { isSectionDownloadFailure } from "../../sectionDownloadFailure";
import { SectionLoadErrorView } from "./SectionLoadErrorView";

interface SectionDownloadBoundaryProps {
  children: ReactNode;
}

/**
 * Shows "Couldn't open this page" when code loaded outside the app's layout, such as the sign-in
 * screen, can't be downloaded. Other errors pass through as before.
 */
export const SectionDownloadBoundary = ({ children }: SectionDownloadBoundaryProps): ReactNode => (
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => {
      if (!isSectionDownloadFailure(error)) {
        throw error;
      }

      return <SectionLoadErrorView onLeave={resetErrorBoundary} />;
    }}
  >
    {children}
  </ErrorBoundary>
);
