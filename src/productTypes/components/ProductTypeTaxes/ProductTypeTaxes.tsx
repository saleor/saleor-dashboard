import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { TaxClassCombobox } from "@dashboard/taxes/components/TaxClassCombobox/TaxClassCombobox";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxClassesListUrl } from "@dashboard/taxes/urls";
import { type FetchMoreProps } from "@dashboard/types";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductTypeTaxesProps {
  data: {
    taxClassId: string;
  };
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

export const ProductTypeTaxes = ({
  data,
  disabled,
  taxClasses,
  taxClassDisplayName,
  onChange,
  onFetchMore,
}: ProductTypeTaxesProps) => {
  const intl = useIntl();

  return (
    <DetailSettingsCard
      title={intl.formatMessage(sectionNames.taxes)}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage
            {...messages.intro}
            values={{
              taxSettingsLink: (
                <MicrocopyLink to={taxClassesListUrl()}>
                  {intl.formatMessage(taxesMessages.taxSettingsLink)}
                </MicrocopyLink>
              ),
            }}
          />
        </Text>
      }
    >
      <TaxClassCombobox
        value={data.taxClassId}
        displayName={taxClassDisplayName}
        taxClasses={taxClasses}
        disabled={disabled}
        onChange={onChange}
        onFetchMore={onFetchMore}
      />
    </DetailSettingsCard>
  );
};

ProductTypeTaxes.displayName = "ProductTypeTaxes";
