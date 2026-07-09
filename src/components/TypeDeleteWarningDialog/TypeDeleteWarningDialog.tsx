// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { Button } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import DeleteWarningDialogConsentContent from "./DeleteWarningDialogConsentContent";
import {
  type CommonTypeDeleteWarningMessages,
  type TypeBaseData,
  type TypeDeleteWarningMessages,
} from "./types";

export interface TypeDeleteMessages {
  baseMessages: CommonTypeDeleteWarningMessages;
  singleWithItemsMessages: TypeDeleteWarningMessages;
  singleWithoutItemsMessages: TypeDeleteWarningMessages;
  multipleWithItemsMessages: TypeDeleteWarningMessages;
  multipleWithoutItemsMessages: TypeDeleteWarningMessages;
}

interface TypeDeleteWarningDialogProps<T extends TypeBaseData> extends TypeDeleteMessages {
  isOpen: boolean;
  deleteButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onDelete: () => void;
  viewAssignedItemsUrl: string | null;
  typesToDelete: string[];
  assignedItemsCount: number | undefined;
  typesData: T[];
}

function TypeDeleteWarningDialog<T extends TypeBaseData>({
  isOpen,
  baseMessages,
  singleWithItemsMessages,
  singleWithoutItemsMessages,
  multipleWithItemsMessages,
  multipleWithoutItemsMessages,
  deleteButtonState,
  onClose,
  onDelete,
  assignedItemsCount,
  viewAssignedItemsUrl,
  typesToDelete,
  typesData,
}: TypeDeleteWarningDialogProps<T>) {
  const intl = useIntl();
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const isSubmitting = deleteButtonState === "loading";

  useEffect(() => {
    if (!isOpen) {
      setIsConsentChecked(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const showMultiple = typesToDelete.length > 1;
  const hasKnownNoAssignedModelItems =
    !showMultiple &&
    typesData.length === 1 &&
    "hasPages" in typesData[0] &&
    typesData[0].hasPages === false;
  const isCountPending = assignedItemsCount === undefined && !hasKnownNoAssignedModelItems;
  const hasAssignedItems =
    !isCountPending && !hasKnownNoAssignedModelItems && (assignedItemsCount ?? 0) > 0;
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
  const singleItemSelectedName =
    typesData.find(getById(singleItemSelectedId))?.name ??
    (typesData.length === 1 ? typesData[0]?.name : undefined);
  const shouldShowViewAssignedItemsButton = hasAssignedItems;
  const descriptionContent = intl.formatMessage(description, {
    typeName: singleItemSelectedName,
    assignedItemsCount,
    b: (...chunks) => <strong>{chunks}</strong>,
  });
  const resolvedConsentLabel = consentLabel ? intl.formatMessage(consentLabel) : null;

  return (
    <DashboardModal open={isOpen} onChange={handleClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header subtitle={descriptionContent}>
          {intl.formatMessage(baseMessages.title, {
            selectedTypesCount: typesToDelete.length,
          })}
        </DashboardModal.Header>

        {resolvedConsentLabel && (
          <DashboardModal.Body>
            <DashboardModal.Inset>
              <DeleteWarningDialogConsentContent
                consentLabel={resolvedConsentLabel}
                isConsentChecked={isConsentChecked}
                onConsentChange={setIsConsentChecked}
              />
            </DashboardModal.Inset>
          </DashboardModal.Body>
        )}

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          {shouldShowViewAssignedItemsButton && (
            <Link
              to={viewAssignedItemsUrl ?? "#"}
              style={{ pointerEvents: viewAssignedItemsUrl ? undefined : "none" }}
            >
              <Button variant="secondary" disabled={!viewAssignedItemsUrl || isSubmitting}>
                {intl.formatMessage(baseMessages.viewAssignedItemsButtonLabel)}
              </Button>
            </Link>
          )}
          <ConfirmButton
            data-test-id="confirm-delete"
            disabled={
              isCountPending || (hasAssignedItems ? !isConsentChecked : false) || isSubmitting
            }
            onClick={onDelete}
            transitionState={deleteButtonState}
            variant="error"
          >
            {intl.formatMessage(buttonMessages.delete)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
}

export default TypeDeleteWarningDialog;
