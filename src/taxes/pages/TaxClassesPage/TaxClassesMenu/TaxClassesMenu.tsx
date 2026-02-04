import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { TaxClassFragment } from "@dashboard/graphql";
import { TaxMenu } from "@dashboard/taxes/components/TaxMenu/TaxMenu";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxClassesListUrl } from "@dashboard/taxes/urls";
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

interface TaxClassesMenuProps {
  taxClasses: TaxClassFragment[] | undefined;
  selectedTaxClassId: string;
  onTaxClassDelete: (taxClassId: string) => void;
  onCreateNew: () => void;
}

const TaxClassesMenu = ({
  taxClasses,
  selectedTaxClassId,
  onTaxClassDelete,
  onCreateNew,
}: TaxClassesMenuProps) => {
  const intl = useIntl();
  const isCreatingNew = selectedTaxClassId === "new";

  const items =
    taxClasses?.map(taxClass => ({
      id: taxClass.id,
      label: taxClass.name,
      href: taxClassesListUrl(taxClass.id),
      isSelected: taxClass.id === selectedTaxClassId,
      "data-test-id": "class-list-rows",
      action:
        taxClass.id !== "new" ? (
          <Button
            data-test-id="class-delete-button"
            icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            variant="tertiary"
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              onTaxClassDelete(taxClass.id);
            }}
          />
        ) : undefined,
    })) ?? [];

  return (
    <TaxMenu
      title={intl.formatMessage(taxesMessages.taxClassList)}
      columnHeader={<FormattedMessage {...taxesMessages.taxClassNameHeader} />}
      items={items}
      placeholder={<FormattedMessage {...taxesMessages.noTaxClasses} />}
      toolbar={
        <Button
          variant="secondary"
          onClick={onCreateNew}
          disabled={isCreatingNew}
          data-test-id="create-class-button"
        >
          <FormattedMessage {...taxesMessages.addTaxClassLabel} />
        </Button>
      }
    />
  );
};

export { TaxClassesMenu };
