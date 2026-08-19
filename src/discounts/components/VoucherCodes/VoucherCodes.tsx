import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type UseListSettings } from "@dashboard/hooks/useListSettings";
import { type LocalPagination } from "@dashboard/hooks/useLocalPaginator";

import { VoucherCodesCard } from "../VoucherCodesCard/VoucherCodesCard";
import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { type GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";

/** @deprecated Prefer `VoucherCodesCard` — kept for existing tests. */
export interface VoucherCodesProps {
  codes: VoucherCode[];
  loading?: boolean;
  disabled?: boolean;
  selectedCodesIds: string[];
  voucherCodesPagination: LocalPagination;
  settings: UseListSettings["settings"];
  deleteCodesTransitionState: ConfirmButtonTransitionState;
  onDeleteCodes: () => Promise<boolean>;
  onSelectedCodesChange: (ids: string[]) => void;
  onSettingsChange: UseListSettings["updateListSettings"];
  onMultiCodesGenerate: (data: GenerateMultipleVoucherCodeFormData) => void;
  onCustomCodeGenerate: (code: string) => void;
}

export const VoucherCodes = (props: VoucherCodesProps): JSX.Element => (
  <VoucherCodesCard {...props} />
);
