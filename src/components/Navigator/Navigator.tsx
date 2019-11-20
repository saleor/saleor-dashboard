import Dialog from "@material-ui/core/Dialog";
import Downshift from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import NavigatorInput from "./NavigatorInput";
import NavigatorSection from "./NavigatorSection";
import { QuickSearchAction } from "./types";
import useQuickSearch from "./useQuickSearch";
import { getViews, hasViews } from "./views";

const navigatorHotkey = "ctrl+m, command+m";

const Navigator: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [query, change, actions] = useQuickSearch(visible);
  const navigate = useNavigator();
  const intl = useIntl();

  React.useEffect(() => {
    hotkeys(navigatorHotkey, () => setVisible(true));

    return () => hotkeys.unbind(navigatorHotkey);
  }, []);

  return (
    <Dialog
      open={visible}
      onClose={() => setVisible(false)}
      fullWidth
      maxWidth="sm"
    >
      <Downshift
        itemToString={(item: QuickSearchAction) => (item ? item.label : "")}
        onSelect={(item: QuickSearchAction) => {
          navigate(item.url);
          setVisible(false);
        }}
        onInputValueChange={value =>
          change({
            target: {
              name: "query",
              value
            }
          })
        }
        defaultHighlightedIndex={0}
      >
        {({ getInputProps, getItemProps, highlightedIndex }) => (
          <div>
            <NavigatorInput
              value={query}
              {...getInputProps({
                value: query
              })}
            />
            {hasViews(actions) && (
              <NavigatorSection
                label={intl.formatMessage({
                  defaultMessage: "Navigate to",
                  description: "navigator section header"
                })}
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                items={getViews(actions)}
                offset={0}
              />
            )}
          </div>
        )}
      </Downshift>
    </Dialog>
  );
};

export default Navigator;
