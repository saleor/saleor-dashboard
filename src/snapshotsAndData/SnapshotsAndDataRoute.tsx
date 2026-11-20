import { useCloudExtensionsAvailable } from "@dashboard/auth/hooks/useCloudExtensionsAvailable";
import { SnapshotsAndDataPage } from "@dashboard/cloud-extensions";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { sectionNames } from "@dashboard/intl";
import { NotFound } from "@dashboard/NotFound";
import { errorTracker } from "@dashboard/services/errorTracking";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useIntl } from "react-intl";

export const SnapshotsAndDataRoute = (): React.ReactNode => {
  const intl = useIntl();
  const available = useCloudExtensionsAvailable();

  if (!available) {
    return <NotFound />;
  }

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.snapshotsAndData)} />
      <ErrorBoundary fallback={<NotFound />} onError={errorTracker.captureException}>
        <Suspense>
          <SnapshotsAndDataPage />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
