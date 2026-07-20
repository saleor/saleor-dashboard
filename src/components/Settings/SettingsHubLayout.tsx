import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type ReactNode } from "react";

import { useScrollToSettingsHash } from "./useScrollToSettingsHash";

interface SettingsHubLayoutProps {
  title: ReactNode;
  backHref: string;
  children: ReactNode;
}

/**
 * Shared shell for Configuration settings hubs (Orders & fulfillment, Refunds & returns, …).
 * Full-width single column; TopNav/Content use gridColumn="full" (macaw defaults to span 8).
 */
export const SettingsHubLayout = ({
  title,
  backHref,
  children,
}: SettingsHubLayoutProps): JSX.Element => {
  useScrollToSettingsHash();

  return (
    <DetailPageLayout gridTemplateColumns={1} width="100%">
      <TopNav href={backHref} title={title} gridColumn="full" />
      <DetailPageLayout.Content gridColumn="full" width="100%">
        {children}
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
