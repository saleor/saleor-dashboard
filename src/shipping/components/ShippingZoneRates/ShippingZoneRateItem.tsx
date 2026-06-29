import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { formatMoneyAmount, formatMoneyRange } from "@dashboard/components/Money";
import { Title2 } from "@dashboard/components/Title2/Title2";
import WeightRange from "@dashboard/components/WeightRange";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { buttonMessages } from "@dashboard/intl";
import { translationsButtonMessages } from "@dashboard/translations/components/TranslationsButton/messages";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Pencil, Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { shippingZoneMethodsMessages } from "./messages";
import { ShippingZoneRateChannelTable } from "./ShippingZoneRateChannelTable";
import {
  getConfiguredChannelCount,
  getPriceSpan,
  type ShippingRate,
  type ZoneChannel,
} from "./utils";

interface ShippingZoneRateItemProps {
  rate: ShippingRate;
  zoneChannels: ZoneChannel[];
  variant: "price" | "weight";
  disabled: boolean;
  getRateEditHref: (id: string) => string;
  getRateChannelSetupHref: (rateId: string, channelId: string) => string;
  getRateTranslationHref?: (id: string) => string;
  onRateRemove: (id: string) => void;
}

const formatPriceAmount = (amount: number, currency: string, locale: string) =>
  `${currency} ${formatMoneyAmount({ amount, currency }, locale)}`;

export const ShippingZoneRateItem = ({
  rate,
  zoneChannels,
  variant,
  disabled,
  getRateEditHref,
  getRateChannelSetupHref,
  getRateTranslationHref,
  onRateRemove,
}: ShippingZoneRateItemProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const navigate = useNavigator();
  const configuredCount = getConfiguredChannelCount(rate, zoneChannels);
  const missingCount = zoneChannels.length - configuredCount;
  const priceSpan = getPriceSpan(rate, zoneChannels);

  return (
    <DetailGroupBox
      groupId={rate.id}
      dataTestId="shipping-method-row"
      headerStart={<Title2>{rate.name}</Title2>}
      headerEnd={
        <Box display="flex" alignItems="center" gap={4}>
          {variant === "weight" && (
            <Text size={2} color="default2">
              <WeightRange
                from={rate.minimumOrderWeight ?? undefined}
                to={rate.maximumOrderWeight ?? undefined}
              />
            </Text>
          )}
          {zoneChannels.length > 0 && (
            <Text size={2} color="default2">
              <FormattedMessage
                {...shippingZoneMethodsMessages.channelsPriced}
                values={{
                  configured: configuredCount,
                  total: zoneChannels.length,
                }}
              />
            </Text>
          )}
          {missingCount > 0 && (
            <Text size={2} color="warning1">
              <FormattedMessage
                {...shippingZoneMethodsMessages.channelsMissingPricing}
                values={{ count: missingCount }}
              />
            </Text>
          )}
          {priceSpan && (
            <Text size={2} fontWeight="medium">
              {priceSpan.min === priceSpan.max
                ? formatPriceAmount(priceSpan.min, priceSpan.currency, locale)
                : formatMoneyRange(
                    { amount: priceSpan.min, currency: priceSpan.currency },
                    { amount: priceSpan.max, currency: priceSpan.currency },
                    locale,
                  )}
            </Text>
          )}
          <Box display="flex" gap={1} alignItems="center" __marginRight="-8px">
            {getRateTranslationHref && (
              <Button
                disabled={disabled}
                variant="tertiary"
                icon={<TranslationsIcon />}
                onClick={event => {
                  event.stopPropagation();
                  navigate(getRateTranslationHref(rate.id));
                }}
                data-test-id="translate-button"
                title={intl.formatMessage(translationsButtonMessages.openTranslations)}
              />
            )}
            <Button
              disabled={disabled}
              variant="tertiary"
              icon={<Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              onClick={event => {
                event.stopPropagation();
                navigate(getRateEditHref(rate.id));
              }}
              title={intl.formatMessage(buttonMessages.edit)}
            />
            <Button
              disabled={disabled}
              variant="tertiary"
              icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              onClick={event => {
                event.stopPropagation();
                onRateRemove(rate.id);
              }}
              data-test-id="delete-button"
              title={intl.formatMessage(buttonMessages.delete)}
            />
          </Box>
        </Box>
      }
    >
      {zoneChannels.length === 0 ? (
        <Box padding={5}>
          <Text color="default2">
            <FormattedMessage {...shippingZoneMethodsMessages.assignChannelsHint} />
          </Text>
        </Box>
      ) : (
        <ShippingZoneRateChannelTable
          rate={rate}
          zoneChannels={zoneChannels}
          variant={variant}
          disabled={disabled}
          getRateChannelSetupHref={getRateChannelSetupHref}
        />
      )}
    </DetailGroupBox>
  );
};

ShippingZoneRateItem.displayName = "ShippingZoneRateItem";
