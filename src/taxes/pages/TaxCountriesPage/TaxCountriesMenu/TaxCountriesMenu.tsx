import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { TaxCountryConfigurationFragment } from "@dashboard/graphql";
import { TaxMenu } from "@dashboard/taxes/components/TaxMenu/TaxMenu";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxCountriesListUrl } from "@dashboard/taxes/urls";
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

interface TaxCountriesMenuProps {
  configurations: TaxCountryConfigurationFragment[] | undefined;
  selectedCountryId: string;
  onCountryDelete: (countryId: string) => void;
  onCountryAdd: () => void;
}

const TaxCountriesMenu = ({
  configurations,
  selectedCountryId,
  onCountryDelete,
  onCountryAdd,
}: TaxCountriesMenuProps) => {
  const intl = useIntl();

  const items =
    configurations?.map(config => ({
      id: config.country.code,
      label: config.country.country,
      href: taxCountriesListUrl(config.country.code),
      isSelected: config.country.code === selectedCountryId,
      "data-test-id": "countries-list-rows",
      action: (
        <Button
          icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          variant="tertiary"
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            onCountryDelete(config.country.code);
          }}
        />
      ),
    })) ?? [];

  return (
    <TaxMenu
      title={intl.formatMessage(taxesMessages.countryList)}
      columnHeader={<FormattedMessage {...taxesMessages.countryNameHeader} />}
      items={items}
      placeholder={<FormattedMessage {...taxesMessages.noCountriesAssigned} />}
      toolbar={
        <Button onClick={onCountryAdd} variant="secondary" data-test-id="add-country-button">
          <FormattedMessage {...taxesMessages.addCountryLabel} />
        </Button>
      }
    />
  );
};

export { TaxCountriesMenu };
