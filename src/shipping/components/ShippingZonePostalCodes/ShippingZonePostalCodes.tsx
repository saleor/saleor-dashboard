// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import { Title2 } from "@dashboard/components/Title2/Title2";
import {
  PostalCodeRuleInclusionTypeEnum,
  type ShippingMethodTypeFragment,
} from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./ShippingZonePostalCodes.module.css";

interface ShippingZonePostalCodesProps {
  disabled: boolean;
  initialExpanded?: boolean;
  inclusionType?: PostalCodeRuleInclusionTypeEnum;
  postalCodes: ShippingMethodTypeFragment["postalCodeRules"] | undefined;
  onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
  onPostalCodeDelete: (code: ShippingMethodTypeFragment["postalCodeRules"][0]) => void;
  onPostalCodeRangeAdd: () => void;
}

const ShippingZonePostalCodes = ({
  disabled,
  initialExpanded = true,
  inclusionType,
  postalCodes,
  onPostalCodeDelete,
  onPostalCodeInclusionChange,
  onPostalCodeRangeAdd,
}: ShippingZonePostalCodesProps) => {
  const intl = useIntl();
  const selectedInclusionType =
    inclusionType ?? postalCodes?.[0]?.inclusionType ?? PostalCodeRuleInclusionTypeEnum.EXCLUDE;
  const onInclusionRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const postalType =
      value === "EXCLUDE"
        ? PostalCodeRuleInclusionTypeEnum.EXCLUDE
        : PostalCodeRuleInclusionTypeEnum.INCLUDE;

    onPostalCodeInclusionChange(postalType);
  };
  const getPostalCodeRangeLabel = (
    postalCodeRange: ShippingMethodTypeFragment["postalCodeRules"][0],
  ) => {
    if (!postalCodeRange?.start) {
      return <Skeleton />;
    }

    if (postalCodeRange?.end) {
      return `${postalCodeRange.start} - ${postalCodeRange.end}`;
    }

    return postalCodeRange.start;
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "FcTTvh",
            defaultMessage: "Postal codes",
            description: "postal codes, header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            onClick={onPostalCodeRangeAdd}
            data-test-id="add-postal-code-range"
            variant="secondary"
          >
            <FormattedMessage
              id="1lk/oS"
              defaultMessage="Add postal code range"
              description="button"
            />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <RadioGroupField
          alignTop
          innerContainerClassName={styles.radioGroup}
          choices={[
            {
              label: (
                <Box className={styles.radioOption}>
                  <Text size={4} fontWeight="regular">
                    <FormattedMessage
                      id="YpLVVc"
                      defaultMessage="Exclude postal codes"
                      description="action"
                    />
                  </Text>
                  <Text color="default2" size={2} fontWeight="light" display="block">
                    <FormattedMessage
                      id="/DCKjx"
                      defaultMessage="Leave the list empty to apply this rate to all postal codes. Added ranges will be excluded."
                      description="exclude postal codes helper"
                    />
                  </Text>
                </Box>
              ),
              value: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
            },
            {
              label: (
                <Box className={styles.radioOption}>
                  <Text size={4} fontWeight="regular">
                    <FormattedMessage
                      id="7qsOwa"
                      defaultMessage="Include postal codes"
                      description="action"
                    />
                  </Text>
                  <Text color="default2" size={2} fontWeight="light" display="block">
                    <FormattedMessage
                      id="wKbeLZ"
                      defaultMessage="Leave the list empty to apply this rate to all postal codes. Only matching added ranges can use it."
                      description="include postal codes helper"
                    />
                  </Text>
                </Box>
              ),
              value: PostalCodeRuleInclusionTypeEnum.INCLUDE,
            },
          ]}
          name="includePostalCodes"
          value={selectedInclusionType}
          onChange={onInclusionRadioChange}
        />
        {postalCodes === undefined ? (
          <Box marginTop={4}>
            <Skeleton />
          </Box>
        ) : postalCodes.length === 0 ? (
          <Box marginTop={4}>
            <Placeholder>
              <FormattedMessage
                id="Pyjarj"
                defaultMessage="This shipping rate has no postal codes assigned"
              />
            </Placeholder>
          </Box>
        ) : (
          <DetailGroupBox
            groupId="postal-codes-list"
            dataTestId="postal-codes-list"
            defaultExpanded={initialExpanded}
            marginTop={4}
            headerStart={
              <Title2>
                {selectedInclusionType === PostalCodeRuleInclusionTypeEnum.INCLUDE ? (
                  <FormattedMessage
                    id="r/sk/h"
                    defaultMessage="{number, plural, one {# included postal code range} other {# included postal code ranges}}"
                    description="number of included postal code ranges"
                    values={{
                      number: postalCodes.length,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="mX5Y6A"
                    defaultMessage="{number, plural, one {# excluded postal code range} other {# excluded postal code ranges}}"
                    description="number of excluded postal code ranges"
                    values={{
                      number: postalCodes.length,
                    }}
                  />
                )}
              </Title2>
            }
          >
            <Box>
              {postalCodes.map(postalCodeRange => (
                <Box
                  key={postalCodeRange?.id}
                  className={styles.postalCodeRow}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingY={3}
                  paddingLeft={5}
                  paddingRight={2}
                  data-test-id="assigned-postal-codes-rows"
                >
                  <Text size={2}>{getPostalCodeRangeLabel(postalCodeRange)}</Text>
                  <Button
                    disabled={disabled}
                    variant="tertiary"
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                    onClick={event => {
                      event.stopPropagation();
                      onPostalCodeDelete(postalCodeRange);
                    }}
                    data-test-id={`delete-postal-code-${postalCodeRange?.id}`}
                    title={intl.formatMessage(buttonMessages.delete)}
                  />
                </Box>
              ))}
            </Box>
          </DetailGroupBox>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingZonePostalCodes.displayName = "ShippingZonePostalCodes";
export default ShippingZonePostalCodes;
