import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { Box, Checkbox, Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleHelp } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import { COUNTRY_PRESET_CODES } from "./countryPresets";
import { messages } from "./messages";
import { isPresetFullySelected } from "./presetSelection";
import styles from "./ShippingZoneCountriesAssignDialogQuickPicks.module.css";

const QUICK_PICKS_GROUP_ID = "shipping-zone-country-quick-picks";

interface QuickPickHelpTooltipProps {
  ariaLabel: MessageDescriptor;
  content: MessageDescriptor;
  testId: string;
}

const QuickPickHelpTooltip = ({ ariaLabel, content, testId }: QuickPickHelpTooltipProps) => {
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
          aria-label={intl.formatMessage(ariaLabel)}
          data-test-id={testId}
          onClick={event => event.stopPropagation()}
        >
          <CircleHelp size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" align="start">
        <Tooltip.Arrow />
        <FormattedMessage {...content} />
      </Tooltip.Content>
    </Tooltip>
  );
};

interface QuickPickRowProps {
  checked: boolean;
  help?: {
    testId: string;
    tooltipAriaLabel: MessageDescriptor;
    tooltipContent: MessageDescriptor;
  };
  name: string;
  testId?: string;
  title: ReactNode;
  onToggle: () => void;
}

const QuickPickRow = ({ checked, help, name, testId, title, onToggle }: QuickPickRowProps) => {
  return (
    <div className={styles.row} data-test-id={testId}>
      <Checkbox checked={checked} gap={4} name={name} onCheckedChange={onToggle}>
        {help ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Text className={styles.label}>{title}</Text>
            <QuickPickHelpTooltip
              ariaLabel={help.tooltipAriaLabel}
              content={help.tooltipContent}
              testId={help.testId}
            />
          </Box>
        ) : (
          <Text className={styles.label}>{title}</Text>
        )}
      </Checkbox>
    </div>
  );
};

interface ShippingZoneCountriesAssignDialogQuickPicksProps {
  availableCountryCodes: string[];
  isRestOfTheWorldSelected: boolean;
  selectedCountryIds: string[];
  showRestOfTheWorld: boolean;
  onPresetToggle: (preset: keyof typeof COUNTRY_PRESET_CODES, checked: boolean) => void;
  onRestOfTheWorldToggle: (checked: boolean) => void;
}

export const ShippingZoneCountriesAssignDialogQuickPicks = ({
  availableCountryCodes,
  isRestOfTheWorldSelected,
  selectedCountryIds,
  showRestOfTheWorld,
  onPresetToggle,
  onRestOfTheWorldToggle,
}: ShippingZoneCountriesAssignDialogQuickPicksProps) => {
  const isEuropeanUnionSelected = isPresetFullySelected(
    COUNTRY_PRESET_CODES.eu,
    selectedCountryIds,
    availableCountryCodes,
  );
  const isNorthAmericaSelected = isPresetFullySelected(
    COUNTRY_PRESET_CODES.northAmerica,
    selectedCountryIds,
    availableCountryCodes,
  );
  const showEuropeanUnion = COUNTRY_PRESET_CODES.eu.some(code =>
    availableCountryCodes.includes(code),
  );
  const showNorthAmerica = COUNTRY_PRESET_CODES.northAmerica.some(code =>
    availableCountryCodes.includes(code),
  );

  if (!showEuropeanUnion && !showNorthAmerica && !showRestOfTheWorld) {
    return null;
  }

  return (
    <DetailGroupBox
      dataTestId="quick-picks"
      groupId={QUICK_PICKS_GROUP_ID}
      marginTop={0}
      headerStart={
        <Title2>
          <FormattedMessage {...messages.quickPicksTitle} />
        </Title2>
      }
    >
      <Box display="flex" flexDirection="column" gap={3} paddingX={5} paddingY={4}>
        <Text size={2} color="default2">
          <FormattedMessage {...messages.quickPicksDescription} />
        </Text>
        <Box className={styles.rows}>
          {showEuropeanUnion ? (
            <QuickPickRow
              checked={isEuropeanUnionSelected}
              name="quickPickEuropeanUnion"
              testId="quick-pick-european-union"
              title={
                <FormattedMessage
                  {...messages.europeanUnionTitle}
                  values={{ count: COUNTRY_PRESET_CODES.eu.length }}
                />
              }
              onToggle={() => onPresetToggle("eu", !isEuropeanUnionSelected)}
            />
          ) : null}
          {showNorthAmerica ? (
            <QuickPickRow
              checked={isNorthAmericaSelected}
              name="quickPickNorthAmerica"
              testId="quick-pick-north-america"
              title={<FormattedMessage {...messages.northAmericaTitle} />}
              onToggle={() => onPresetToggle("northAmerica", !isNorthAmericaSelected)}
            />
          ) : null}
          {showRestOfTheWorld ? (
            <QuickPickRow
              checked={isRestOfTheWorldSelected}
              help={{
                testId: "rest-of-the-world-help",
                tooltipAriaLabel: messages.restOfTheWorldTooltipAriaLabel,
                tooltipContent: messages.restOfTheWorldDescription,
              }}
              name="restOfTheWorld"
              testId="rest-of-the-world-row"
              title={<FormattedMessage {...messages.restOfTheWorldTitle} />}
              onToggle={() => onRestOfTheWorldToggle(!isRestOfTheWorldSelected)}
            />
          ) : null}
        </Box>
      </Box>
    </DetailGroupBox>
  );
};
