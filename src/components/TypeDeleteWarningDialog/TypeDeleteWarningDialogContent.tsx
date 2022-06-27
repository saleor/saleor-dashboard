import { CardContent } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import ConfirmButton from "@saleor/components/ConfirmButton";
import useNavigator from "@saleor/hooks/useNavigator";
import React, { useState } from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import DeleteButton from "../DeleteButton";
import DeleteWarningDialogConsentContent from "./DeleteWarningDialogConsentContent";
import { useTypeDeleteWarningDialogStyles as useStyles } from "./styles";

interface TypeDeleteWarningDialogContentProps {
  singleItemSelectedName?: string;
  viewAssignedItemsButtonLabel: MessageDescriptor;
  description: MessageDescriptor;
  consentLabel: MessageDescriptor;
  viewAssignedItemsUrl: string;
  hasAssignedItems: boolean;
  assignedItemsCount: number | undefined;
  onDelete: () => void;
  // temporary, until we add filters to pages list - SALEOR-3279
  showViewAssignedItemsButton?: boolean;
}

const TypeDeleteWarningDialogContent: React.FC<TypeDeleteWarningDialogContentProps> = ({
  description,
  consentLabel,
  viewAssignedItemsUrl,
  viewAssignedItemsButtonLabel,
  singleItemSelectedName,
  hasAssignedItems,
  assignedItemsCount,
  onDelete,
  showViewAssignedItemsButton,
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const navigate = useNavigator();

  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const handleViewAssignedItems = () => navigate(viewAssignedItemsUrl);

  const isDisbled = hasAssignedItems ? !isConsentChecked : false;

  const shouldShowViewAssignedItemsButton =
    showViewAssignedItemsButton && hasAssignedItems;

  return (
    <CardContent>
      <DeleteWarningDialogConsentContent
        description={intl.formatMessage(description, {
          typeName: singleItemSelectedName,
          assignedItemsCount,
          b: (...chunks) => <b>{chunks}</b>,
        })}
        consentLabel={consentLabel && intl.formatMessage(consentLabel)}
        isConsentChecked={isConsentChecked}
        onConsentChange={setIsConsentChecked}
      />
      <CardSpacer />
      <div className={classes.buttonsSection}>
        {shouldShowViewAssignedItemsButton && (
          <>
            <ConfirmButton
              onClick={handleViewAssignedItems}
              transitionState="default"
            >
              {intl.formatMessage(viewAssignedItemsButtonLabel)}
            </ConfirmButton>
            <HorizontalSpacer spacing={3} />
          </>
        )}
        <DeleteButton
          onClick={onDelete}
          disabled={isDisbled}
          testId="confirm-delete"
        />
      </div>
    </CardContent>
  );
};

export default TypeDeleteWarningDialogContent;
