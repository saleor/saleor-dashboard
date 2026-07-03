import { Box } from "@saleor/macaw-ui-next";
import { type FC, useEffect, useRef, useState } from "react";

import { useConditionalFilterContext } from "./context";
import { type FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";
import { LoadingFiltersArea } from "./LoadingFiltersArea";
import { type ConditionalFiltersLayout } from "./UI";
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
  const handleConfirm = (value: FilterContainer) => {
    const validator = new Validator(value);

    if (validator.isValid()) {
      valueProvider.persist(value);
      onClose();

      return;
    }

    setErrors(validator.getErrors());
  };
  const handleCancel = () => {
    valueProvider.clear();
    containerState.resetToProvider();
    onClose();
  };

  const isInline = layout === "inline";

  return showLoading ? (
    <LoadingFiltersArea layout={layout} />
  ) : (
    <Box
      padding={isInline ? undefined : 3}
      borderBottomLeftRadius={isInline ? undefined : 2}
      borderBottomRightRadius={isInline ? undefined : 2}
    >
      <FiltersArea
        layout={layout}
        onConfirm={handleConfirm}
        errors={errors}
        onCancel={handleCancel}
      />
    </Box>
  );
};
