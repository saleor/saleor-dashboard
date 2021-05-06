import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import ModalTitle from "@saleor/orders/components/OrderDiscountCommonModal/ModalTitle";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import React from "react";
import { useIntl } from "react-intl";

import { useTypeDeleteWarningDialogStyles as useStyles } from "./styles";
import ProductTypeDeleteWarningDialogContent from "./TypeDeleteWarningDialogContent";
import {
  CommonTypeDeleteWarningMessages,
  TypeDeleteWarningMessages
} from "./types";

export interface BaseTypeDeleteWarningDialogProps {
  isOpen: boolean;
  deleteButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onDelete: () => void;
}

interface TypeBaseData {
  id: string;
  name: string;
}

interface TypeDeleteWarningDialogProps<T extends TypeBaseData>
  extends BaseTypeDeleteWarningDialogProps {
  baseMessages: CommonTypeDeleteWarningMessages;
  singleWithItemsMessages: TypeDeleteWarningMessages;
  singleWithoutItemsMessages: TypeDeleteWarningMessages;
  multipleWithItemsMessages: TypeDeleteWarningMessages;
  multipleWithoutItemsMessages: TypeDeleteWarningMessages;
  viewAssignedItemsUrl: string;
  typesToDelete: string[];
  assignedItemsCount: number | undefined;
  isLoading: boolean;
  typesData: T[];
}

function TypeDeleteWarningDialog<T extends TypeBaseData>({
  isLoading,
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
  typesData
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
        title: baseMessages.multipleTitle,
        ...multipleMessages
      };
    }

    const singleMessages = hasAssignedItems
      ? singleWithItemsMessages
      : singleWithoutItemsMessages;

    return {
      title: baseMessages.singleTitle,
      ...singleMessages
    };
  };

  const { title, description, consentLabel } = selectMessages();

  const singleItemSelectedId = typesToDelete[0];

  const singleItemSelectedName = typesData.find(getById(singleItemSelectedId))
    ?.name;

  return (
    <Modal open={isOpen}>
      <div className={classes.centerContainer}>
        <Card className={classes.content}>
          <ModalTitle
            title={intl.formatMessage(title)}
            withBorder
            onClose={onClose}
          />
          {isLoading ? (
            <CardContent className={classes.centerContainer}>
              <CircularProgress size={16} />
            </CardContent>
          ) : (
            <ProductTypeDeleteWarningDialogContent
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
