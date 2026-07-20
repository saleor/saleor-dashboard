import { Box, Text } from "@saleor/macaw-ui-next";
import { Blocks } from "lucide-react";
import { FormattedMessage } from "react-intl";

import styles from "./HomeEmptyState.module.css";

export const HomeEmptyState = () => (
  <Box display="flex" alignItems="center" justifyContent="center" height="100%" padding={6}>
    <Box
      className={styles.card}
      display="flex"
      alignItems="center"
      gap={5}
      padding={7}
      borderRadius={4}
      borderWidth={1}
      borderColor="default1"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink="0"
        borderRadius={3}
        backgroundColor="default2"
        color="default2"
        __width="48px"
        __height="48px"
      >
        <Blocks size={24} />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Text size={4} fontWeight="bold">
          <FormattedMessage
            id="fTLvHX"
            defaultMessage="Welcome"
            description="empty home page title"
          />
        </Text>
        <Text size={2} color="default2">
          <FormattedMessage
            id="cxUBO1"
            defaultMessage="Install an app that registers a HOMEPAGE_WIDGETS extension to see it here."
            description="empty home page description"
          />
        </Text>
      </Box>
    </Box>
  </Box>
);
