import { FilterType } from "@saleor/components/Filter";
import {
  FilterFieldBaseProps,
  getIsFilterMultipleChoices,
  useCommonStyles
} from "@saleor/components/Filter/FilterContent/utils";
import FormSpacer from "@saleor/components/FormSpacer";
import React from "react";
import { useIntl } from "react-intl";

import SingleSelectField from "../../SingleSelectField/SingleSelectField";

type FilterSingleSelectFieldProps = FilterFieldBaseProps<string>;

export const FilterSingleSelectField: React.FC<FilterSingleSelectFieldProps> = ({
  filter,
  onFilterPropertyChange
}) => {
  const classes = useCommonStyles({});
  const intl = useIntl();

  return (
    <>
      <SingleSelectField
        data-test="filterRangeTypeChoice"
        choices={getIsFilterMultipleChoices(intl)}
        value={filter.multiple ? FilterType.MULTIPLE : FilterType.SINGULAR}
        InputProps={{
          classes: {
            input: classes.input
          }
        }}
        onChange={event =>
          onFilterPropertyChange({
            payload: {
              name: filter.name,
              update: {
                multiple: event.target.value === FilterType.MULTIPLE
              }
            },
            type: "set-property"
          })
        }
      />
      <FormSpacer />
    </>
  );
};
