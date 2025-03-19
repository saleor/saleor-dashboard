import { PLUGINS_DOCS_URL } from "@dashboard/links";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../../messages";

export const PluginWarning = () => {
  return (
    <Box marginTop={4}>
      <Text size={4} fontWeight="medium" color="default2" textTransform="uppercase">
        <FormattedMessage {...messages.pluginInfoImportant} />:{" "}
      </Text>
      <Text size={1} color="default2">
        <FormattedMessage
          {...messages.pluginInfo}
          values={{
            learnMore: (
              <Box
                as="a"
                href={PLUGINS_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                borderBottomStyle="solid"
                borderWidth={1}
                __paddingBottom="1px"
              >
                <FormattedMessage {...messages.learnMore} />
              </Box>
            ),
          }}
        />
      </Text>
    </Box>
  );
};
