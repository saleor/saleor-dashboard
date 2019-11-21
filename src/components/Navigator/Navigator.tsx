import Dialog from "@material-ui/core/Dialog";
import Downshift from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { useIntl } from "react-intl";

import useNavigator from "@saleor/hooks/useNavigator";
import { getActions, hasActions } from "./modes/default";
import { getViews, hasViews } from "./modes/default/views";
import NavigatorInput from "./NavigatorInput";
import NavigatorSection from "./NavigatorSection";
import { QuickSearchAction } from "./types";
import useQuickSearch from "./useQuickSearch";

const navigatorHotkey = "ctrl+m, command+m";

const Navigator: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const input = React.useRef(null);
  const [query, mode, change, actions] = useQuickSearch(visible, input);
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
              mode={mode}
              value={query}
              {...getInputProps({
                value: query
              })}
              ref={input}
            />
            {hasActions(actions) && (
              <NavigatorSection
                label={intl.formatMessage({
                  defaultMessage: "Quick Actions",
                  description: "navigator section header"
                })}
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                items={getActions(actions)}
                offset={0}
              />
            )}
            {hasViews(actions) && (
              <NavigatorSection
                label={intl.formatMessage({
                  defaultMessage: "Navigate to",
                  description: "navigator section header"
                })}
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                items={getViews(actions)}
                offset={getActions(actions).length}
              />
            )}
          </div>
        )}
      </Downshift>
    </Dialog>
  );
};

export default Navigator;
