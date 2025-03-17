import { extensionCategory } from "@dashboard/extensions/messages";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

interface ExtensionsGroupProps {
  title: string;
  children: React.ReactNode;
}

const getCategoryTranslation = (group: string, intl: IntlShape) => {
  switch (group) {
    case "payment":
      return intl.formatMessage(extensionCategory.payment);
    case "taxes":
      return intl.formatMessage(extensionCategory.taxes);
    case "cms":
      return intl.formatMessage(extensionCategory.cms);
    default:
      return group;
  }
};

export const ExtensionsGroup = ({ children, title }: ExtensionsGroupProps) => {
  const intl = useIntl();

  return (
    <Box marginBottom={12}>
      <Text as="h4" size={6} fontWeight="bold" marginBottom={4}>
        {getCategoryTranslation(title, intl)}
      </Text>

      <Box display="grid" __gridTemplateColumns="repeat(auto-fill, minmax(375px, 1fr))" gap={6}>
        {children}
      </Box>
    </Box>
  );
};
