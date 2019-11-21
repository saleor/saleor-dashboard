import { IntlShape } from "react-intl";

import { QuickSearchAction } from "../../types";
import searchInViews from "./views";

const threshold = 0.05;
const maxActions = 10;

function getDefaultModeActions(
  query: string,
  intl: IntlShape
): QuickSearchAction[] {
  return [...searchInViews(query, intl)]
    .filter(action => action.score >= threshold)
    .sort((a, b) => (a.score <= b.score ? 1 : -1))
    .slice(0, maxActions);
}

export default getDefaultModeActions;
