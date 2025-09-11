import { messages } from "@dashboard/extensions/messages";
import { PLUGINS_DOCS_URL } from "@dashboard/links";
import { Box, BoxProps, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export const PluginWarning = ({ color }: { color: BoxProps["color"] }) => {
  return (
    <Box marginTop={4}>
      <Text size={4} fontWeight="medium" color={color} textTransform="uppercase">
        <FormattedMessage {...messages.pluginInfoImportant} />:{" "}
      </Text>
      <Text size={1} color={color}>
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
