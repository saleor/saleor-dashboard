import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField/SingleAutocompleteSelectFieldContent";
import { FetchMoreProps } from "@saleor/types";
import React from "react";

interface ChoiceProviderProps {
  children: (
    props: FetchMoreProps & {
      choices: SingleAutocompleteChoiceType[];
      fetchChoices: (value: string) => void;
    }
  ) => React.ReactElement;
  choices: SingleAutocompleteChoiceType[];
}

const step = 5;
const loadingTime = 400;

export interface UseMockChoiceProviderOpts extends FetchMoreProps {
  fetchChoices: (value: string) => void;
}
export type UseMockChoiceProvider = [
  SingleAutocompleteChoiceType[],
  UseMockChoiceProviderOpts
];
export function useMockChoiceProvider(
  choices: SingleAutocompleteChoiceType[]
): UseMockChoiceProvider {
  const [filteredChoices, setFilteredChoices] = React.useState(
    choices.slice(0, step)
  );
  const [loading, setLoading] = React.useState(false);
  const [first, setFirst] = React.useState(step);
  const timeout = React.useRef(null);

  React.useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  const handleChange = (value: string) => {
    if (!!timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => fetchChoices(value), loadingTime);
  };

  const fetchChoices = (value: string) => {
    const filteredChoices = choices.filter(
      suggestion =>
        !value ||
        suggestion.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

    setLoading(true);

    timeout.current = setTimeout(() => {
      setFilteredChoices(filteredChoices);
      setLoading(false);
      setFirst(step);
    }, loadingTime);
  };

  const handleFetchMore = () => {
    setLoading(true);

    timeout.current = setTimeout(() => {
      setFilteredChoices(choices.slice(0, first + step));
      setLoading(false);
      setFirst(first + step);
    }, loadingTime);
  };

  return [
    filteredChoices,
    {
      fetchChoices: handleChange,
      hasMore: choices.length > filteredChoices.length,
      loading,
      onFetchMore: handleFetchMore
    }
  ];
}

export const ChoiceProvider: React.FC<ChoiceProviderProps> = ({
  children,
  choices
}) => {
  const [filteredChoices, opts] = useMockChoiceProvider(choices);

  return children({
    choices: filteredChoices,
    ...opts
  });
};
