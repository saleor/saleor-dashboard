import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { type CountryFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
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
  onCountryAssign,
  onCountryUnassign,
}: CountryListProps) => {
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

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{title}</DashboardCard.Title>
        {hasCountriesToRender && (
          <DashboardCard.Toolbar>
            <Button
              disabled={disabled}
              onClick={onCountryAssign}
              data-test-id="assign-country"
              variant="secondary"
            >
              <FormattedMessage {...countryListMessages.assignCountries} />
            </Button>
          </DashboardCard.Toolbar>
        )}
      </DashboardCard.Header>
      <DashboardCard.Content>
        {isLoading ? (
          <Skeleton data-test-id="country-list-skeleton" />
        ) : hasCountriesToRender ? (
          <DetailGroupBox
            groupId="countries-list"
            dataTestId="countries-list"
            headerStart={
              <Title2>
                <FormattedMessage
                  {...summaryMessages[summaryContext]}
                  values={{ count: sortedCountries.length }}
                />
              </Title2>
            }
          >
            <Box>
              {sortedLetters.flatMap(letter =>
                groupedCountries[letter].map((country, countryIndex) => (
                  <Box
                    key={country.code}
                    className={styles.countryRow}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingY={3}
                    paddingX={5}
                  >
                    <Box display="flex" alignItems="center" gap={3} minWidth={0}>
                      <Text color="default2" size={2} className={styles.letterColumn}>
                        {countryIndex === 0 ? letter : ""}
                      </Text>
                      <Text size={2}>{country.country}</Text>
                    </Box>
                    <Button
                      disabled={disabled}
                      variant="tertiary"
                      icon={
                        <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                      }
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
          </DetailGroupBox>
        ) : (
          <Box
            className={styles.emptyState}
            borderRadius={4}
            borderColor="default1"
            borderWidth={1}
            padding={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
          >
            <Text size={2} color="default2" textAlign="center">
              {emptyText}
            </Text>
            <Button
              disabled={disabled}
              onClick={onCountryAssign}
              data-test-id="assign-country"
              variant="primary"
            >
              <FormattedMessage {...countryListMessages.assignCountries} />
            </Button>
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CountryList.displayName = "CountryList";
