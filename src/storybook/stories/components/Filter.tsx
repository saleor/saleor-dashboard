import { FilterContent, FilterContentProps } from "@saleor/components/Filter";
import useFilter from "@saleor/components/Filter/useFilter";
import {
  createDateField,
  createOptionsField,
  createPriceField
} from "@saleor/utils/filters/fields";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const props: FilterContentProps = {
  filters: [
    createPriceField("price", "Price", {
      max: "100.00",
      min: "20.00"
    }),
    {
      ...createDateField("createdAt", "Created At", {
        max: "2019-10-23",
        min: "2019-09-09"
      }),
      active: true
    },
    {
      ...createOptionsField("status", "Status", ["val1"], false, [
        {
          label: "Value 1",
          value: "val1"
        },
        {
          label: "Value 2",
          value: "val2"
        },
        {
          label: "Value 3",
          value: "val3"
        }
      ]),
      active: true
    },
    {
      ...createOptionsField(
        "multiplOptions",
        "Multiple Options",
        ["val1", "val2"],
        true,
        [
          {
            label: "Value 1",
            value: "val1"
          },
          {
            label: "Value 2",
            value: "val2"
          },
          {
            label: "Value 3",
            value: "val3"
          }
        ]
      ),
      active: false
    }
  ],
  onClear: () => undefined,
  onFilterPropertyChange: () => undefined,
  onSubmit: () => undefined
};

const InteractiveStory: React.FC = () => {
  const [data, dispatchFilterActions, clear] = useFilter(props.filters);

  return (
    <FilterContent
      {...props}
      filters={data}
      onClear={clear}
      onFilterPropertyChange={dispatchFilterActions}
    />
  );
};

storiesOf("Generics / Filter", module)
  .addDecorator(storyFn => (
    <div style={{ margin: "auto", width: 400 }}>{storyFn()}</div>
  ))
  .addDecorator(Decorator)
  .add("default", () => <FilterContent {...props} />)
  .add("interactive", () => <InteractiveStory />);
