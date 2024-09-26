// @ts-strict-ignore
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { Box, Spinner } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import DeleteButton from "../DeleteButton";
import { DashboardModal } from "../Modal";
import DeleteWarningDialogConsentContent from "./DeleteWarningDialogConsentContent";
import { CommonTypeDeleteWarningMessages, TypeBaseData, TypeDeleteWarningMessages } from "./types";
import { useViewProducts } from "./useViewProducts";

export interface TypeDeleteMessages {
  baseMessages: CommonTypeDeleteWarningMessages;
  singleWithItemsMessages: TypeDeleteWarningMessages;
  singleWithoutItemsMessages: TypeDeleteWarningMessages;
  multipleWithItemsMessages: TypeDeleteWarningMessages;
  multipleWithoutItemsMessages: TypeDeleteWarningMessages;
}

export interface TypeDeleteWarningDialogProps<T extends TypeBaseData> extends TypeDeleteMessages {
  isOpen: boolean;
  deleteButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onDelete: () => void;
  viewAssignedItemsUrl: string;
  typesToDelete: string[];
  assignedItemsCount: number | undefined;
  isLoading?: boolean;
  typesData: T[];
  // temporary, until we add filters to pages list - SALEOR-3279
  showViewAssignedItemsButton?: boolean;
}

function TypeDeleteWarningDialog<T extends TypeBaseData>({
  isLoading = false,
  isOpen,
  baseMessages,
  singleWithItemsMessages,
  singleWithoutItemsMessages,
  multipleWithItemsMessages,
  multipleWithoutItemsMessages,
  onClose,
  onDelete,
  assignedItemsCount,
  viewAssignedItemsUrl,
  typesToDelete,
  typesData,
  showViewAssignedItemsButton = true,
}: TypeDeleteWarningDialogProps<T>) {
  const intl = useIntl();
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const showMultiple = typesToDelete.length > 1;
  const hasAssignedItems = !!assignedItemsCount;
  const selectMessages = () => {
    if (showMultiple) {
      const multipleMessages = hasAssignedItems
        ? multipleWithItemsMessages
        : multipleWithoutItemsMessages;

      return {
        ...multipleMessages,
      };
    }

    const singleMessages = hasAssignedItems ? singleWithItemsMessages : singleWithoutItemsMessages;

    return {
      ...singleMessages,
    };
  };
  const { description, consentLabel } = selectMessages();

  const singleItemSelectedId = typesToDelete[0];
  const singleItemSelectedName = typesData.find(getById(singleItemSelectedId))?.name;
  const shouldShowViewAssignedItemsButton = showViewAssignedItemsButton && hasAssignedItems;

  const { getViewProductsURL } = useViewProducts({
    defaultNavigationLink: viewAssignedItemsUrl,
    productTypeBaseData: typesData[0],
  });

  const productsListOfTypeURL = getViewProductsURL();

  return (
    <DashboardModal open={isOpen} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Title display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(baseMessages.title, {
            selectedTypesCount: typesToDelete.length,
          })}

          <DashboardModal.Close onClose={onClose} />
        </DashboardModal.Title>

        {isLoading ? (
          <Box display="flex" width="100%" justifyContent="center" paddingY={10}>
            <Spinner />
          </Box>
        ) : (
          <>
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

            <DashboardModal.Actions>
              {shouldShowViewAssignedItemsButton && (
                <Link to={productsListOfTypeURL}>
                  <ConfirmButton transitionState="default">
                    {intl.formatMessage(baseMessages.viewAssignedItemsButtonLabel)}
                  </ConfirmButton>
                </Link>
              )}
              <DeleteButton
                onClick={onDelete}
                disabled={hasAssignedItems ? !isConsentChecked : false}
                testId="confirm-delete"
              >
                {intl.formatMessage(buttonMessages.delete)}
              </DeleteButton>
            </DashboardModal.Actions>
          </>
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
}

export default TypeDeleteWarningDialog;
