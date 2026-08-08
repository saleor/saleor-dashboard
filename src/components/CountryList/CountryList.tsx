import { Callout } from "@dashboard/components/Callout/Callout";
import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type CountryFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Plus, Trash2 } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./CountryList.module.css";
import { countryListMessages } from "./messages";
import { groupCountriesByStartingLetter } from "./utils";

type CountryListSummaryContext = "shipping-zone" | "voucher";

interface CountryListProps {
  countries?: CountryFragment[] | null;
  disabled: boolean;
  emptyText: ReactNode;
  summaryContext: CountryListSummaryContext;
  title: ReactNode;
  /** Optional subtitle under the title (e.g. voucher limit hint). */
  description?: ReactNode;
  /** Section-level error (e.g. voucher country assign failure). */
  errorMessage?: string;
  onCountryAssign: () => void;
  onCountryUnassign: (country: string) => void;
}

const sortCountries = (countries: CountryFragment[]): CountryFragment[] =>
  [...countries].sort((a, b) => a.country.localeCompare(b.country));

const summaryMessages: Record<
  CountryListSummaryContext,
  (typeof countryListMessages)[keyof typeof countryListMessages]
> = {
  "shipping-zone": countryListMessages.shippingZoneSummary,
  voucher: countryListMessages.voucherSummary,
};

export const CountryList = ({
  countries,
  disabled,
  emptyText,
  summaryContext,
  title,
  description,
  errorMessage,
  onCountryAssign,
  onCountryUnassign,
}: CountryListProps): JSX.Element => {
  const intl = useIntl();
  const sortedCountries = useMemo(
    () =>
      sortCountries(
        (countries ?? []).filter((country): country is CountryFragment => country != null),
      ),
    [countries],
  );
  const groupedCountries = useMemo(
    () => groupCountriesByStartingLetter(sortedCountries),
    [sortedCountries],
  );
  const sortedLetters = useMemo(() => Object.keys(groupedCountries).sort(), [groupedCountries]);
  const isLoading = countries === undefined;
  const hasCountriesToRender = !isLoading && sortedCountries.length > 0;

  const assignButton = (
    <Button
      disabled={disabled}
      onClick={onCountryAssign}
      data-test-id="assign-country"
      variant="secondary"
      size="small"
      aria-label={intl.formatMessage(countryListMessages.assignCountries)}
    >
      <Plus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      <FormattedMessage {...buttonMessages.assign} />
    </Button>
  );

  const headerStart = (
    <Box display="flex" flexDirection="column" gap={1} minWidth={0}>
      <Text size={5} fontWeight="bold" as="h2" className={styles.title}>
        {title}
      </Text>
      {isLoading ? null : hasCountriesToRender ? (
        <Text size={3} color="default2">
          <FormattedMessage
            {...summaryMessages[summaryContext]}
            values={{ count: sortedCountries.length }}
          />
        </Text>
      ) : description ? (
        <Text size={3} color="default2">
          {description}
        </Text>
      ) : null}
    </Box>
  );

  if (isLoading) {
    return (
      <Box className={styles.card} data-test-id="country-list">
        <Box className={styles.cardHeader}>
          {headerStart}
          {assignButton}
        </Box>
        <Box className={styles.cardBody}>
          <Skeleton data-test-id="country-list-skeleton" />
        </Box>
      </Box>
    );
  }

  return (
    <DetailGroupBox
      variant="card"
      groupId="countries-list"
      dataTestId="country-list"
      defaultExpanded={!hasCountriesToRender}
      headerStart={headerStart}
      headerEnd={assignButton}
    >
      {errorMessage ? (
        <Box paddingX={6} paddingY={4} data-test-id="country-list-error">
          <Callout type="error" title={errorMessage} />
        </Box>
      ) : null}
      {hasCountriesToRender ? (
        <Box data-test-id="countries-list">
          {sortedLetters.flatMap(letter =>
            groupedCountries[letter].map((country, countryIndex) => (
              <Box
                key={country.code}
                className={styles.countryRow}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                paddingY={3}
                paddingX={6}
              >
                <Box display="flex" alignItems="center" gap={3} minWidth={0}>
                  <Text color="default2" size={2} className={styles.letterColumn}>
                    {countryIndex === 0 ? letter : ""}
                  </Text>
                  <Text size={2}>{country.country}</Text>
                </Box>
                <Button
                  className={styles.deleteAction}
                  disabled={disabled}
                  variant="tertiary"
                  icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
                  onClick={event => {
                    event.stopPropagation();
                    onCountryUnassign(country.code);
                  }}
                  data-test-id="delete-icon"
                  title={intl.formatMessage(buttonMessages.delete)}
                />
              </Box>
            )),
          )}
        </Box>
      ) : (
        <Box
          className={styles.emptyState}
          borderRadius={3}
          borderColor="default1"
          borderWidth={1}
          margin={6}
          padding={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={4}
        >
          <Text size={2} color="default2" textAlign="center">
            {emptyText}
          </Text>
        </Box>
      )}
    </DetailGroupBox>
  );
};

CountryList.displayName = "CountryList";
