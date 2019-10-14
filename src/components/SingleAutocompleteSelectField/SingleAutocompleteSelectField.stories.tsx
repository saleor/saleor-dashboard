import { storiesOf } from "@storybook/react";
import React from "react";

import Form from "@saleor/components/Form";
import { maybe } from "@saleor/misc";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { ChoiceProvider } from "@saleor/storybook/mock";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { countries } from "./fixtures";
import SingleAutocompleteSelectField, {
  SingleAutocompleteSelectFieldProps
} from "./SingleAutocompleteSelectField";
import SingleAutocompleteSelectFieldContent, {
  SingleAutocompleteSelectFieldContentProps
} from "./SingleAutocompleteSelectFieldContent";

const suggestions = countries.map(c => ({ label: c.name, value: c.code }));

const props: SingleAutocompleteSelectFieldProps = {
  choices: undefined,
  displayValue: undefined,
  label: "Country",
  loading: false,
  name: "country",
  onChange: () => undefined,
  placeholder: "Select country",
  value: suggestions[0].value
};

const Story: React.FC<
  Partial<
    SingleAutocompleteSelectFieldProps & {
      enableLoadMore: boolean;
    }
  >
> = storyProps => {
  const [displayValue, setDisplayValue] = React.useState(suggestions[0].label);

  return (
    <Form initial={{ country: suggestions[0].value }}>
      {({ change, data }) => (
        <ChoiceProvider choices={suggestions}>
          {({ choices, fetchChoices, fetchMore, hasMore, loading }) => {
            const handleSelect = createSingleAutocompleteSelectHandler(
              change,
              setDisplayValue,
              choices
            );

            return (
              <SingleAutocompleteSelectField
                {...props}
                displayValue={displayValue}
                choices={choices}
                fetchChoices={fetchChoices}
                helperText={`Value: ${data.country}`}
                loading={loading}
                onChange={handleSelect}
                value={data.country}
                hasMore={storyProps.enableLoadMore ? hasMore : false}
                onFetchMore={storyProps.enableLoadMore ? fetchMore : undefined}
                {...storyProps}
              />
            );
          }}
        </ChoiceProvider>
      )}
    </Form>
  );
};

const contentProps: SingleAutocompleteSelectFieldContentProps = {
  choices: suggestions.slice(0, 10),
  displayCustomValue: false,
  emptyOption: false,
  getItemProps: () => undefined,
  hasMore: false,
  highlightedIndex: 0,
  inputValue: suggestions[0].label,
  isCustomValueSelected: false,
  loading: false,
  onFetchMore: () => undefined,
  selectedItem: suggestions[0].value
};

storiesOf("Generics / Select with autocomplete", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <SingleAutocompleteSelectFieldContent {...contentProps} />
  ))
  .add("can load more", () => (
    <SingleAutocompleteSelectFieldContent {...contentProps} hasMore={true} />
  ))
  .add("no data", () => (
    <SingleAutocompleteSelectFieldContent {...contentProps} choices={[]} />
  ))
  .add("interactive", () => <Story />)
  .add("interactive with custom option", () => (
    <Story allowCustomValues={true} />
  ))
  .add("interactive with empty option", () => <Story emptyOption={true} />)
  .add("interactive with load more", () => <Story enableLoadMore={true} />);
