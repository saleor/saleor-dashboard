// @ts-strict-ignore
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type ProductWhereInput } from "@dashboard/graphql";
import { type Container, type FetchMoreProps } from "@dashboard/types";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { AssignProductPickerList } from "./AssignProductPickerList";
import { AssignProductPickerToolbar } from "./AssignProductPickerToolbar";
import { messages } from "./messages";
import { type Products, type SelectedChannel } from "./types";
import {
  ASSIGN_PRODUCT_PICKER_SCROLL_ID,
  useAssignProductPicker,
  type UseAssignProductPickerProps,
} from "./useAssignProductPicker";

interface AssignProductDialogMultiProps
  extends FetchMoreProps,
    Pick<
      UseAssignProductPickerProps,
      "backfillResetKey" | "excludeProduct" | "selectAllMode" | "onMaxSelectionReached"
    > {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  onClose: () => void;
  labels?: {
    confirmBtn?: string;
  };
  open: boolean;
  skipFetchOnOpen?: boolean;
}

export const AssignProductDialogMulti = (props: AssignProductDialogMultiProps) => {
  const { labels, open, ...pickerProps } = props;
  const intl = useIntl();
  const picker = useAssignProductPicker({ ...pickerProps, open });

  return (
    <DashboardModal onChange={picker.handleClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader toolbar={<AssignProductPickerToolbar picker={picker} />}>
          <FormattedMessage {...messages.assignVariantDialogHeader} />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill id={ASSIGN_PRODUCT_PICKER_SCROLL_ID}>
          <AssignProductPickerList
            picker={picker}
            scrollableTargetId={ASSIGN_PRODUCT_PICKER_SCROLL_ID}
          />
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={picker.handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={!picker.hasSelectionChanged}
            transitionState={picker.confirmButtonState}
            type="submit"
            onClick={picker.handleSubmit}
          >
            {picker.selectedCount > 0
              ? intl.formatMessage(messages.assignCountedButton, {
                  label:
                    labels?.confirmBtn ?? intl.formatMessage(messages.assignProductDialogButton),
                  count: picker.selectedCount,
                })
              : (labels?.confirmBtn ?? (
                  <FormattedMessage {...messages.assignProductDialogButton} />
                ))}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
