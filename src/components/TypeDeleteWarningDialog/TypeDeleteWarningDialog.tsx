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
  viewAssignedItemsUrl: string | null;
  typesToDelete: string[];
  assignedItemsCount: number | undefined;
  typesData: T[];
  isLoading?: boolean;
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
  const shouldShowViewAssignedItemsButton = hasAssignedItems;

  return (
    <DashboardModal open={isOpen} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          {intl.formatMessage(baseMessages.title, {
            selectedTypesCount: typesToDelete.length,
          })}
        </DashboardModal.Header>

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
                <Link
                  to={viewAssignedItemsUrl}
                  style={{ pointerEvents: viewAssignedItemsUrl ? undefined : "none" }}
                >
                  <ConfirmButton transitionState="default" disabled={!viewAssignedItemsUrl}>
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
