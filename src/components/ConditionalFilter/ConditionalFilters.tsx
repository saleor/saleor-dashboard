import { Box } from "@saleor/macaw-ui-next";
import { FC, useState } from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";
import { LoadingFiltersArea } from "./LoadingFiltersArea";
import { ErrorEntry, Validator } from "./Validation";

export const ConditionalFilters = ({ onClose }: { onClose: () => void }) => {
  const { valueProvider, containerState } = useConditionalFilterContext();
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
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
    containerState.clear();
    onClose();
  };

  return valueProvider.loading ? (
    <LoadingFiltersArea />
  ) : (
    <Box padding={3} borderBottomLeftRadius={2} borderBottomRightRadius={2}>
      <FiltersArea onConfirm={handleConfirm} errors={errors} onCancel={handleCancel} />
    </Box>
  );
};
