import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout";
import { ExternalLinkUnstyled } from "@dashboard/extensions/components/ExternalLinkUnstyled/ExternalLinkUnstyled";
import { messages } from "@dashboard/extensions/messages";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { FormattedMessage, useIntl } from "react-intl";

import { previousPagePath } from "../consts";

export const InstallTopNav = ({
  title,
  showDocsLink = true,
}: {
  title: string;
  showDocsLink?: boolean;
}) => {
  const intl = useIntl();

  return (
    <TopNav
      href={previousPagePath}
      hrefIcon={<TopNavDestinationIcon.extensions />}
      hrefTitle={intl.formatMessage(topNavDestinationMessages.extensions)}
      __height="auto"
      title={title}
      subtitle={
        showDocsLink && (
          <FormattedMessage
            {...messages.learnMoreSubheader}
            values={{
              manifestFormatLink: (
                <ExternalLinkUnstyled href={MANIFEST_FORMAT_DOCS_URL} target="_blank">
                  <FormattedMessage {...messages.manifestFormatLink} />
                </ExternalLinkUnstyled>
              ),
            }}
          />
        )
      }
    />
  );
};
