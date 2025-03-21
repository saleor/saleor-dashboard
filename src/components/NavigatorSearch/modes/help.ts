import { IntlShape } from "react-intl";

import { QuickSearchAction, QuickSearchMode } from "../types";
import messages from "./messages";

function getHelpModeActions(
  query: string,
  intl: IntlShape,
  setMode: (mode: QuickSearchMode) => void,
): QuickSearchAction[] {
  if (query !== "") {
    return [
      {
        label: intl.formatMessage(messages.noResults),
        searchValue: query,
        onClick: () => true,
        type: "action",
      },
    ];
  }

  return [
    {
      label: intl.formatMessage(messages.helpDefaultMode),
      searchValue: "",
      onClick: () => {
        setMode("default");

        return true;
      },
      symbol: "...",
      type: "action",
    },
    {
      label: intl.formatMessage(messages.helpCommandsMode),
      searchValue: "",
      onClick: () => {
        setMode("commands");

        return true;
      },
      symbol: ">",
      type: "action",
    },
    {
      label: intl.formatMessage(messages.helpOrdersMode),
      searchValue: "",
      onClick: () => {
        setMode("orders");

        return true;
      },
      symbol: "#",
      type: "action",
    },
    {
      label: intl.formatMessage(messages.helpCustomersMode),
      searchValue: "",
      onClick: () => {
        setMode("customers");

        return true;
      },
      symbol: "@",
      type: "action",
    },
    {
      label: intl.formatMessage(messages.helpCatalogMode),
      searchValue: "",
      onClick: () => {
        setMode("catalog");

        return true;
      },
      symbol: "$",
      type: "action",
    },
    {
      label: intl.formatMessage(messages.helpMode),
      searchValue: "",
      onClick: () => {
        setMode("help");

        return true;
      },
      symbol: "?",
      type: "action",
    },
  ];
}

export default getHelpModeActions;
