import Form from "@saleor/components/Form";
import { countries } from "@saleor/fixtures";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { ChoiceProvider } from "@saleor/storybook/mock";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";

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

const Story: React.FC<Partial<
  SingleAutocompleteSelectFieldProps & {
    enableLoadMore: boolean;
  }
>> = ({
  allowCustomValues,
  emptyOption,
  enableLoadMore,
  nakedInput,
  disabled
}) => {
  const [displayValue, setDisplayValue] = React.useState(suggestions[0].label);

  return (
    <Form initial={{ country: suggestions[0].value }}>
      {({ change, data }) => (
        <ChoiceProvider choices={suggestions}>
          {({ choices, fetchChoices, onFetchMore, hasMore, loading }) => {
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
                hasMore={enableLoadMore ? hasMore : false}
                onFetchMore={enableLoadMore ? onFetchMore : undefined}
                allowCustomValues={allowCustomValues}
                emptyOption={emptyOption}
                nakedInput={nakedInput}
                disabled={disabled}
              />
            );
          }}
        </ChoiceProvider>
      )}
    </Form>
  );
};

const contentProps: SingleAutocompleteSelectFieldContentProps = {
  add: undefined,
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

export default {
  title: "Generics / Select with autocomplete",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => (
  <SingleAutocompleteSelectFieldContent {...contentProps} />
);

Default.story = {
  name: "default"
};

export const WithAdd = () => (
  <SingleAutocompleteSelectFieldContent
    {...contentProps}
    add={{
      label: "Add New Collection",
      onClick: () => undefined
    }}
  />
);

WithAdd.story = {
  name: "with add"
};

export const CanLoadMore = () => (
  <SingleAutocompleteSelectFieldContent {...contentProps} hasMore={true} />
);

CanLoadMore.story = {
  name: "can load more"
};

export const NoData = () => (
  <SingleAutocompleteSelectFieldContent {...contentProps} choices={[]} />
);

NoData.story = {
  name: "no data"
};

export const Naked = () => <Story nakedInput />;

Naked.story = {
  name: "naked"
};

export const NakedAndDisabled = () => <Story nakedInput disabled />;

NakedAndDisabled.story = {
  name: "naked and disabled"
};

export const Interactive = () => <Story />;

Interactive.story = {
  name: "interactive"
};

export const InteractiveWithCustomOption = () => (
  <Story allowCustomValues={true} />
);

InteractiveWithCustomOption.story = {
  name: "interactive with custom option"
};

export const InteractiveWithEmptyOption = () => <Story emptyOption={true} />;

InteractiveWithEmptyOption.story = {
  name: "interactive with empty option"
};

export const InteractiveWithLoadMore = () => <Story enableLoadMore={true} />;

InteractiveWithLoadMore.story = {
  name: "interactive with load more"
};

export const Disabled = () => (
  <Story enableLoadMore={true} {...contentProps} disabled />
);

Disabled.story = {
  name: "disabled"
};
