import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";

import styles from "./ContextualHelpIcon.module.css";

const CONTEXTUAL_LINK_EVENT = "contextual_link_clicked";

interface ContextualHelpIconProps {
  href: string;
  label: string;
  analyticsType: string;
  dataTestId?: string;
}

export const ContextualHelpIcon = ({
  href,
  label,
  analyticsType,
  dataTestId,
}: ContextualHelpIconProps): JSX.Element => {
  const { trackEvent } = useAnalytics();

  return (
    <span className={styles.root}>
      <Tooltip>
        <Tooltip.Trigger>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label={label}
            data-test-id={dataTestId}
            onClick={() => {
              trackEvent(CONTEXTUAL_LINK_EVENT, { type: analyticsType });
            }}
          >
            <CircleHelp size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </a>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="end">
          <Tooltip.Arrow />
          {label}
        </Tooltip.Content>
      </Tooltip>
    </span>
  );
};
