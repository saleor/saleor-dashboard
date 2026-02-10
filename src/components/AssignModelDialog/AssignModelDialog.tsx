import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { PageWhereInput, SearchPagesQuery } from "@dashboard/graphql";
import { Container, DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { FormattedMessage } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import {
  InitialPageConstraints,
  ModalPageFilterProvider,
} from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { AssignModelDialogMulti } from "./AssignModelDialogMulti";
import { AssignModelDialogSingle } from "./AssignModelDialogSingle";
import { messages } from "./messages";

interface AssignModelDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  loading: boolean;
  onFilterChange?: (filterVariables: PageWhereInput, query: string) => void;
  onSubmit: (data: Container[]) => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  excludedFilters?: string[];
  initialConstraints?: InitialPageConstraints;
}

const AssignModelDialog = (props: AssignModelDialogProps) => {
  const { selectionMode = "multiple", excludedFilters, initialConstraints, ...restProps } = props;

  const { open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const dialogContent = (
    <>
      <DashboardModal.Header>
        <FormattedMessage {...messages.assignModelDialogHeader} />
      </DashboardModal.Header>

      {selectionMode === "single" ? (
        <AssignModelDialogSingle {...restProps} />
      ) : (
        <AssignModelDialogMulti {...restProps} />
      )}
    </>
  );

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <ModalPageFilterProvider
          excludedFilters={excludedFilters}
          initialConstraints={initialConstraints}
        >
          {dialogContent}
        </ModalPageFilterProvider>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignModelDialog.displayName = "AssignModelDialog";
export default AssignModelDialog;
