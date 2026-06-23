import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { shippingMethodTypesHelpMessages } from "./shippingMethodTypesHelpMessages";
import styles from "./ShippingMethodTypesHelpTooltip.module.css";

export const ShippingMethodTypesHelpTooltip = () => {
  const intl = useIntl();

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          cursor="pointer"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          aria-label={intl.formatMessage(shippingMethodTypesHelpMessages.tooltipAriaLabel)}
          data-test-id="shipping-method-types-help"
          onClick={event => event.stopPropagation()}
        >
          <CircleHelp size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="start">
        <Tooltip.Arrow />
        <Box className={styles.content} display="flex" flexDirection="column" gap={2}>
          <Text size={2} fontWeight="bold">
            <FormattedMessage {...shippingMethodTypesHelpMessages.tooltipTitle} />
          </Text>
          <Text size={2}>
            <FormattedMessage {...shippingMethodTypesHelpMessages.tooltipIntro} />
          </Text>
          <ul className={styles.list}>
            <li>
              <Text size={2}>
                <FormattedMessage
                  {...shippingMethodTypesHelpMessages.priceBasedDescription}
                  values={{
                    strong: chunks => <Text fontWeight="bold">{chunks}</Text>,
                  }}
                />
              </Text>
            </li>
            <li>
              <Text size={2}>
                <FormattedMessage
                  {...shippingMethodTypesHelpMessages.weightBasedDescription}
                  values={{
                    strong: chunks => <Text fontWeight="bold">{chunks}</Text>,
                  }}
                />
              </Text>
            </li>
          </ul>
          <Text size={2}>
            <FormattedMessage {...shippingMethodTypesHelpMessages.tooltipCheckoutNote} />
          </Text>
          <Text size={2}>
            <FormattedMessage {...shippingMethodTypesHelpMessages.exampleSetup} />
          </Text>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleCartColumn} />
                </th>
                <th>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleResultColumn} />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleRowOneCart} />
                </td>
                <td>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleRowOneResult} />
                </td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleRowTwoCart} />
                </td>
                <td>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleRowTwoResult} />
                </td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleRowThreeCart} />
                </td>
                <td>
                  <FormattedMessage {...shippingMethodTypesHelpMessages.exampleRowThreeResult} />
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};

ShippingMethodTypesHelpTooltip.displayName = "ShippingMethodTypesHelpTooltip";
