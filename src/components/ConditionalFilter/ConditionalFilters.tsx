import { Box } from "@saleor/macaw-ui-next";
import { type FC, useEffect, useRef, useState } from "react";

import { useConditionalFilterContext } from "./context/consumer";
import { type FilterContainer } from "./FilterElement/FilterElement";
import { FiltersArea } from "./FiltersArea";
import { LoadingFiltersArea } from "./LoadingFiltersArea";
import { type ConditionalFiltersLayout, isFlatFilterLayout } from "./UI";
import { type ErrorEntry, Validator } from "./Validation";

interface ConditionalFiltersProps {
  onClose: () => void;
  layout?: ConditionalFiltersLayout;
}

export const ConditionalFilters: FC<ConditionalFiltersProps> = ({
  onClose,
  layout = "popover",
}) => {
  const { valueProvider, containerState } = useConditionalFilterContext();
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    if (!valueProvider.loading) {
      hasLoadedOnceRef.current = true;
    }
  }, [valueProvider.loading]);

  const showLoading = valueProvider.loading && !hasLoadedOnceRef.current;
  const handleConfirm = (value: FilterContainer): boolean => {
    const validator = new Validator(value);

    if (!validator.isValid()) {
      setErrors(validator.getErrors());

      return false;
    }

    valueProvider.persist(value);
    onClose();

    return true;
  };
  const handleClear = () => {
    valueProvider.clear();
    containerState.resetToProvider();
    onClose();
  };
  const handleCancel = () => {
    containerState.resetToProvider();
    onClose();
  };

  const isInline = isFlatFilterLayout(layout);

  return showLoading ? (
    <LoadingFiltersArea layout={layout} />
  ) : (
    <Box
      padding={isInline ? undefined : 3}
      borderBottomLeftRadius={isInline ? undefined : 2}
      borderBottomRightRadius={isInline ? undefined : 2}
      width="100%"
      __minWidth="0"
    >
      <FiltersArea
        layout={layout}
        onConfirm={handleConfirm}
        errors={errors}
        onClear={handleClear}
        onCancel={handleCancel}
      />
    </Box>
  );
};
