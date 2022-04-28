import { countries } from "@saleor/fixtures";
import useMultiAutocomplete from "@saleor/hooks/useMultiAutocomplete";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { ChoiceProvider } from "@saleor/storybook/mock";
import React from "react";

import MultiAutocompleteSelectField, {
  MultiAutocompleteSelectFieldProps
} from "./MultiAutocompleteSelectField";
import MultiAutocompleteSelectFieldContent, {
  MultiAutocompleteSelectFieldContentProps
} from "./MultiAutocompleteSelectFieldContent";

const suggestions = countries.map(c => ({ label: c.name, value: c.code }));

const props: MultiAutocompleteSelectFieldProps = {
  choices: undefined,
  displayValues: [],
  label: "Country",
  loading: false,
  name: "country",
  onChange: () => undefined,
  placeholder: "Select country",
  value: undefined
};

const Story: React.FC<Partial<
  MultiAutocompleteSelectFieldProps & {
    enableLoadMore: boolean;
  }
>> = ({ enableLoadMore, ...rest }) => {
  const { change, data: countries } = useMultiAutocomplete([suggestions[0]]);

  return (
    <ChoiceProvider choices={suggestions}>
      {({ choices, fetchChoices, onFetchMore, hasMore, loading }) => (
        <MultiAutocompleteSelectField
          {...props}
          displayValues={countries}
          choices={choices}
          fetchChoices={fetchChoices}
          helperText={`Value: ${countries
            .map(country => country.value)
            .join(", ")}`}
          onChange={event => change(event, choices)}
          value={countries.map(country => country.value)}
          loading={loading}
          hasMore={enableLoadMore ? hasMore : false}
          onFetchMore={enableLoadMore ? onFetchMore : undefined}
          {...rest}
        />
      )}
    </ChoiceProvider>
  );
};

const contentProps: MultiAutocompleteSelectFieldContentProps = {
  choices: suggestions.slice(0, 10),
  displayCustomValue: false,
  displayValues: [suggestions[0]],
  getItemProps: () => undefined,
  hasMore: false,
  highlightedIndex: 0,
  inputValue: suggestions[0].label,
  loading: false,
  onFetchMore: () => undefined
};

export default {
  title: "Generics / Multiple select with autocomplete",
  decorators: [CardDecorator, Decorator]
};

export const Default = () => (
  <MultiAutocompleteSelectFieldContent {...contentProps} />
);

Default.story = {
  name: "default"
};

export const CanLoadMore = () => (
  <MultiAutocompleteSelectFieldContent {...contentProps} hasMore={true} />
);

CanLoadMore.story = {
  name: "can load more"
};

export const NoData = () => (
  <MultiAutocompleteSelectFieldContent {...contentProps} choices={[]} />
);

NoData.story = {
  name: "no data"
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

export const InteractiveWithLoadMore = () => <Story enableLoadMore={true} />;

InteractiveWithLoadMore.story = {
  name: "interactive with load more"
};

export const InteractiveWithError = () => <Story error={true} />;

InteractiveWithError.story = {
  name: "interactive with error"
};
