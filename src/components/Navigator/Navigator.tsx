import Dialog from "@material-ui/core/Dialog";
import Downshift from "downshift";
import hotkeys from "hotkeys-js";
import React from "react";
import { useIntl } from "react-intl";

import { getActions, getViews, hasActions, hasViews } from "./modes/utils";
import NavigatorInput from "./NavigatorInput";
import NavigatorSection from "./NavigatorSection";
import { QuickSearchAction } from "./types";
import useQuickSearch from "./useQuickSearch";

const navigatorHotkey = "ctrl+m, command+m";

const Navigator: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const input = React.useRef(null);
  const [query, mode, change, actions] = useQuickSearch(visible, input);
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
          setVisible(false);
          item.onClick();
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
          </div>
        )}
      </Downshift>
    </Dialog>
  );
};

export default Navigator;
