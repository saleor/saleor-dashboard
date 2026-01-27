import { TaxConfigurationFragment } from "@dashboard/graphql";
import { TaxMenu } from "@dashboard/taxes/components/TaxMenu/TaxMenu";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { FormattedMessage, useIntl } from "react-intl";

interface TaxChannelsMenuProps {
  configurations: TaxConfigurationFragment[] | undefined;
  selectedConfigurationId: string;
}

export const TaxChannelsMenu = ({
  configurations,
  selectedConfigurationId,
}: TaxChannelsMenuProps) => {
  const intl = useIntl();

  const items =
    configurations?.map(configuration => ({
      id: configuration.id,
      label: configuration.channel.name,
      href: taxConfigurationListUrl(configuration.id),
      isSelected: configuration.id === selectedConfigurationId,
      "data-test-id": "channels-list-rows",
    })) ?? [];

  return (
    <TaxMenu
      title={intl.formatMessage(taxesMessages.channelList)}
      columnHeader={<FormattedMessage {...taxesMessages.channelNameHeader} />}
      items={items}
    />
  );
};
