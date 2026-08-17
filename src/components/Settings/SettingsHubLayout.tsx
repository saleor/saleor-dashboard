import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type ReactNode } from "react";

import { useScrollToSettingsHash } from "./useScrollToSettingsHash";

interface SettingsHubLayoutProps {
  title: ReactNode;
  backHref: string;
  /** Icon representing the destination of `backHref`. */
  backHrefIcon: ReactNode;
  /** Tooltip / aria-label for the destination of `backHref`. */
  backHrefTitle: string;
  children: ReactNode;
}

/**
 * Shared shell for Configuration settings hubs (Orders & fulfillment, Refunds & returns, …).
 * Full-width single column; TopNav/Content use gridColumn="full" (macaw defaults to span 8).
 */
export const SettingsHubLayout = ({
  title,
  backHref,
  backHrefIcon,
  backHrefTitle,
  children,
}: SettingsHubLayoutProps): JSX.Element => {
  useScrollToSettingsHash();

  return (
    <DetailPageLayout gridTemplateColumns={1} width="100%">
      <TopNav
        href={backHref}
        hrefIcon={backHrefIcon}
        hrefTitle={backHrefTitle}
        title={title}
        gridColumn="full"
      />
      <DetailPageLayout.Content gridColumn="full" width="100%">
        {children}
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};
