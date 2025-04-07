import { TopNav } from "@dashboard/components/AppLayout";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { headerTitles, messages } from "../messages";
import { ExtensionsPaths } from "../urls";

export const InstallCustomExtension = () => {
  const intl = useIntl();

  return (
    <>
      <TopNav
        // TODO: replace url with previous page?
        href={ExtensionsPaths.installedExtensions}
        title={intl.formatMessage(headerTitles.addCustomExtensionManifest)}
        subtitle={
          <FormattedMessage
            {...messages.learnMoreSubheader}
            values={{
              manifestFormatLink: (
                <Box
                  as="a"
                  href={MANIFEST_FORMAT_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  borderBottomStyle="solid"
                  borderWidth={1}
                >
                  <FormattedMessage {...messages.manifestFormatLink} />
                </Box>
              ),
            }}
          />
        }
      ></TopNav>
    </>
  );
};
