import { shouldShowAssignPickerListLoading } from "@dashboard/components/AssignPickerListLoading/shouldShowAssignPickerListLoading";

export const useAssignPickerListDisplayState = (
  loading: boolean,
  itemCount: number,
): {
  showEmptyState: boolean;
  showListLoading: boolean;
} => {
  const showListLoading = shouldShowAssignPickerListLoading(loading, itemCount);
  const showEmptyState = !loading && itemCount === 0;

  return { showListLoading, showEmptyState };
};
