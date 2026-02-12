import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ProductWhereInput, SearchProductsQuery } from "@dashboard/graphql";
import { Container, DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { FormattedMessage } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import {
  InitialConstraints,
  ModalProductFilterProvider,
} from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignVariantDialogMulti } from "./AssignVariantDialogMulti";
import { AssignVariantDialogSingle } from "./AssignVariantDialogSingle";
import { messages } from "./messages";

interface AssignVariantDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onSubmit: (data: Container[]) => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  excludedFilters?: string[];
  initialConstraints?: InitialConstraints;
}

const AssignVariantDialog = (props: AssignVariantDialogProps) => {
  const { selectionMode = "multiple", excludedFilters, initialConstraints, ...restProps } = props;

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const dialogContent = (
    <>
      <DashboardModal.Header>
        <FormattedMessage {...messages.assignVariantDialogHeader} />
      </DashboardModal.Header>

      {selectionMode === "single" ? (
        <AssignVariantDialogSingle {...restProps} />
      ) : (
        <AssignVariantDialogMulti {...restProps} />
      )}
    </>
  );

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <ModalProductFilterProvider
          excludedFilters={excludedFilters}
          initialConstraints={initialConstraints}
        >
          {dialogContent}
        </ModalProductFilterProvider>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignVariantDialog.displayName = "AssignVariantDialog";
export default AssignVariantDialog;
