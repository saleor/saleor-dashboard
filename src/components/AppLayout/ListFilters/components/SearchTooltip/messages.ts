import { defineMessages } from "react-intl";

export const messages = defineMessages({
  searchSyntaxTitle: {
    id: "vitgwA",
    defaultMessage: "Search syntax",
  },
  prefixMatching: {
    id: "mBSBtn",
    defaultMessage: "Prefix matching",
  },
  prefixMatchingDesc: {
    id: "8VDOUy",
    defaultMessage: 'Matches "coffee", "coffeehouse", etc.',
  },
  andOperator: {
    id: "9kF+go",
    defaultMessage: "AND (implicit)",
  },
  andOperatorDesc: {
    id: "cEoeGG",
    defaultMessage: "Both terms must match",
  },
  andExplicitOperator: {
    id: "JotAJ3",
    defaultMessage: "AND (explicit)",
  },
  andExplicitOperatorDesc: {
    id: "V2JtVu",
    defaultMessage: "Same as implicit AND, using explicit keyword",
  },
  orOperator: {
    id: "INlWvJ",
    defaultMessage: "OR",
  },
  orOperatorDesc: {
    id: "6sr5Sp",
    defaultMessage: "Either term matches",
  },
  notOperator: {
    id: "jOgiMP",
    defaultMessage: "NOT",
  },
  notOperatorDesc: {
    id: "sZ4enl",
    defaultMessage: "Excludes results matching the term",
  },
  exactPhrase: {
    id: "XyURe6",
    defaultMessage: "Exact phrase",
  },
  exactPhraseDesc: {
    id: "Fyd+zC",
    defaultMessage: "Matches the exact phrase only",
  },
  operatorHeader: {
    id: "3yf2ND",
    defaultMessage: "Operator",
  },
  exampleHeader: {
    id: "xrCRnH",
    defaultMessage: "Example",
  },
  descriptionHeader: {
    id: "Q8Qw5B",
    defaultMessage: "Description",
  },
});
