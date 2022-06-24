import { Card, CardContent, CircularProgress, Modal } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import ModalTitle from "@saleor/orders/components/OrderDiscountCommonModal/ModalTitle";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import React from "react";
import { useIntl } from "react-intl";

import { useTypeDeleteWarningDialogStyles as useStyles } from "./styles";
import ProductTypeDeleteWarningDialogContent from "./TypeDeleteWarningDialogContent";
import {
  CommonTypeDeleteWarningMessages,
  TypeDeleteWarningMessages,
} from "./types";

export interface TypeBaseData {
  id: string;
  name: string;
}

export interface TypeDeleteMessages {
  baseMessages: CommonTypeDeleteWarningMessages;
  singleWithItemsMessages: TypeDeleteWarningMessages;
  singleWithoutItemsMessages: TypeDeleteWarningMessages;
  multipleWithItemsMessages: TypeDeleteWarningMessages;
  multipleWithoutItemsMessages: TypeDeleteWarningMessages;
}

export interface TypeDeleteWarningDialogProps<T extends TypeBaseData>
  extends TypeDeleteMessages {
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
  const classes = useStyles({});

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

    const singleMessages = hasAssignedItems
      ? singleWithItemsMessages
      : singleWithoutItemsMessages;

    return {
      ...singleMessages,
    };
  };

  const { description, consentLabel } = selectMessages();

  const singleItemSelectedId = typesToDelete[0];

  const singleItemSelectedName = typesData.find(getById(singleItemSelectedId))
    ?.name;

  return (
    <Modal open={isOpen}>
      <div className={classes.centerContainer} data-test-id="warning-dialog">
        <Card className={classes.content}>
          <ModalTitle
            title={intl.formatMessage(baseMessages.title, {
              selectedTypesCount: typesToDelete.length,
            })}
            withBorder
            onClose={onClose}
          />
          {isLoading ? (
            <CardContent className={classes.centerContainer}>
              <CircularProgress size={16} />
            </CardContent>
          ) : (
            <ProductTypeDeleteWarningDialogContent
              showViewAssignedItemsButton={showViewAssignedItemsButton}
              assignedItemsCount={assignedItemsCount}
              hasAssignedItems={hasAssignedItems}
              singleItemSelectedName={singleItemSelectedName}
              viewAssignedItemsUrl={viewAssignedItemsUrl}
              onDelete={onDelete}
              description={description}
              consentLabel={consentLabel}
              viewAssignedItemsButtonLabel={
                baseMessages.viewAssignedItemsButtonLabel
              }
            />
          )}
        </Card>
      </div>
    </Modal>
  );
}

export default TypeDeleteWarningDialog;
