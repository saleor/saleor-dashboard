import { TopNav } from "@dashboard/components/AppLayout";
import { InputWithPlaceholder } from "@dashboard/components/InputWithPlaceholder/InputWithPlaceholder";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { Box, Input, SearchInput, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { headerTitles, messages } from "../messages";
import { ExtensionsPaths } from "../urls";

const PLACEHOLDER_MANIFEST_URL = "https://example.com/app-manifest.json";

const EL_ID_MANIFEST_INPUT_LABEL = "manifest-input-label";

export const InstallCustomExtension = () => {
  const intl = useIntl();
  const [manifestUrl, setManifestUrl] = useState("");

  return (
    <>
      <TopNav
        // TODO: replace url with previous page?
        href={ExtensionsPaths.installedExtensions}
        __height="auto"
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
      <Box marginX={6} marginTop={10} display="flex" gap={3} flexDirection="column" __width="380px">
        <Text size={5} fontWeight="medium" id={EL_ID_MANIFEST_INPUT_LABEL}>
          Provide Manifest URL
        </Text>
        <InputWithPlaceholder
          value={manifestUrl}
          onChange={event => setManifestUrl(event.currentTarget.value)}
          aria-labelledby={EL_ID_MANIFEST_INPUT_LABEL}
          placeholder={PLACEHOLDER_MANIFEST_URL}
        />
      </Box>
    </>
  );
};
