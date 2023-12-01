import { intialConditionValues } from "@dashboard/discounts/components/DiscountCreatePage/initialFormValues";
import { ConditionType, Rule } from "@dashboard/discounts/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../../../messages";
import { FetchOptions, RuleConditionRow } from "../RuleConditionRow";
import { initialDiscountConditionType } from "../RuleConditionRow/initialDiscountConditionType";
import { useCategorieSearch } from "./hooks/useCategorieSearch";
import { useCollectionSearch } from "./hooks/useCollectionSearch";
import { useProductSearch } from "./hooks/useProductSearch";
import { useVariantSearch } from "./hooks/useVariantSearch";

interface RuleConditionsProps {
  disabled?: boolean;
}

export const RuleConditions = ({ disabled = false }: RuleConditionsProps) => {
  const intl = useIntl();

  const { watch } = useFormContext<Rule>();

  const { append, remove } = useFieldArray<Rule, "conditions">({
    name: "conditions",
  });

  const conditionsList = watch("conditions");

  const productSearch = useProductSearch();
  const collectionSearch = useCollectionSearch();
  const categorySearch = useCategorieSearch();
  const variantSearch = useVariantSearch();

  const typeToFetchMap: Record<ConditionType, FetchOptions> = {
    product: productSearch,
    collection: collectionSearch,
    category: categorySearch,
    variant: variantSearch,
  };

  const allConditionsSelected =
    conditionsList.length === initialDiscountConditionType.length;

  const isConditionTypeSelected = (conditionType: string) =>
    conditionsList.some(condition => condition.type === conditionType);

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text>{intl.formatMessage(messages.conditions)}</Text>

      <Box display="flex" flexDirection="column" gap={4}>
        {conditionsList.map((condition, conditionIndex) => (
          <RuleConditionRow
            disabled={disabled}
            fetchOptions={typeToFetchMap[condition.type]}
            isConditionTypeSelected={isConditionTypeSelected}
            key={condition.type}
            conditionIndex={conditionIndex}
            onRemove={() => {
              remove(conditionIndex);
            }}
          />
        ))}
      </Box>

      {!allConditionsSelected && (
        <Button
          variant="secondary"
          size="small"
          alignSelf="end"
          disabled={disabled}
          onClick={() => append({ ...intialConditionValues })}
        >
          Add condition
        </Button>
      )}
    </Box>
  );
};
