import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Button } from "@saleor/macaw-ui-next";
import { ExternalLink } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

import styles from "./ExternalLinkAdornment.module.css";
import { isHttpUrl } from "./isHttpUrl";

const messages = defineMessages({
  openLink: {
    id: "mK1JpE",
    defaultMessage: "Open link in a new tab",
    description: "icon button next to a text attribute input whose value is a URL",
  },
});

interface ExternalLinkAdornmentProps {
  value: string | null | undefined;
}

export const ExternalLinkAdornment = ({ value }: ExternalLinkAdornmentProps): React.ReactNode => {
  const intl = useIntl();
  const url = value?.trim();

  if (!url || !isHttpUrl(url)) {
    return null;
  }

  const label = intl.formatMessage(messages.openLink);

  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variant="tertiary"
      size="small"
      className={styles.button}
      title={label}
      aria-label={label}
      data-test-id="external-link-adornment"
      icon={<ExternalLink size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
    />
  );
};
