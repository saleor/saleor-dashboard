import React from "react";

import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField/SingleAutocompleteSelectFieldContent";

interface ChoiceProviderProps {
  children: (props: {
    choices: SingleAutocompleteChoiceType[];
    hasMore: boolean;
    loading: boolean;
    fetchChoices: (value: string) => void;
    fetchMore: () => void;
  }) => React.ReactElement<any>;
  choices: SingleAutocompleteChoiceType[];
}
interface ChoiceProviderState {
  choices: SingleAutocompleteChoiceType[];
  filteredChoices: SingleAutocompleteChoiceType[];
  first: number;
  loading: boolean;
  timeout: any;
}

const step = 5;

export class ChoiceProvider extends React.Component<
  ChoiceProviderProps,
  ChoiceProviderState
> {
  state = {
    choices: [],
    filteredChoices: [],
    first: step,
    loading: false,
    timeout: null
  };

  handleChange = (inputValue: string) => {
    if (!!this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    const timeout = setTimeout(() => this.fetchChoices(inputValue), 500);
    this.setState({
      loading: true,
      timeout
    });
  };

  handleFetchMore = () => {
    if (!!this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    const timeout = setTimeout(this.fetchMore, 500);
    this.setState({
      loading: true,
      timeout
    });
  };

  fetchMore = () =>
    this.setState(prevState => ({
      filteredChoices: prevState.choices.slice(0, prevState.first + step),
      first: prevState.first + step,
      loading: false,
      timeout: null
    }));

  fetchChoices = (inputValue: string) => {
    const choices = this.props.choices.filter(
      suggestion =>
        !inputValue ||
        suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
    );
    this.setState({
      choices,
      filteredChoices: choices.slice(0, step),
      first: step,
      loading: false,
      timeout: null
    });
  };

  render() {
    return this.props.children({
      choices: this.state.filteredChoices,
      fetchChoices: this.handleChange,
      fetchMore: this.handleFetchMore,
      hasMore: this.state.choices.length > this.state.filteredChoices.length,
      loading: this.state.loading
    });
  }
}
