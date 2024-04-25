// @ts-strict-ignore
import {
  FilterContent,
  FilterElement,
  FilterErrorMessages,
  IFilter,
  InvalidFilters,
} from "@dashboard/components/Filter";
import useFilter from "@dashboard/components/Filter/useFilter";
import { extractInvalidFilters } from "@dashboard/components/Filter/utils";
import { ClickAwayListener, Grow, Popper } from "@material-ui/core";
import { DropdownButton, sprinkles } from "@saleor/macaw-ui-next";
import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { getSelectedFilterAmount } from "../utils";

export interface FilterProps<TFilterKeys extends string = string> {
  currencySymbol?: string;
  errorMessages?: FilterErrorMessages<TFilterKeys>;
  menu: IFilter<TFilterKeys>;
  onFilterAdd: (filter: Array<FilterElement<TFilterKeys>>) => void;
  onFilterAttributeFocus?: (id?: string) => void;
}

export const FiltersSelect = <TFilterKeys extends string = string>({
  currencySymbol,
  menu,
  onFilterAdd,
  onFilterAttributeFocus,
  errorMessages,
}: FilterProps<TFilterKeys>) => {
  const anchor = React.useRef<HTMLDivElement>();
  const [isFilterMenuOpened, setFilterMenuOpened] = useState(false);
  const [filterErrors, setFilterErrors] = useState<InvalidFilters<string>>({});
  const [data, dispatch, reset] = useFilter(menu);
  const isFilterActive = menu.some(filterElement => filterElement.active);
  const selectedFilterAmount = useMemo(() => getSelectedFilterAmount(menu, data), [data, menu]);
  const handleSubmit = () => {
    const invalidFilters = extractInvalidFilters(data, menu);

    if (Object.keys(invalidFilters).length > 0) {
      setFilterErrors(invalidFilters);

      return;
    }

    setFilterErrors({});
    onFilterAdd(data);
    setFilterMenuOpened(false);
  };
  const handleClear = () => {
    reset();
    setFilterErrors({});
  };

  return (
    <ClickAwayListener
      onClickAway={event => {
        if ((event.target as HTMLElement).getAttribute("role") !== "option") {
          setFilterMenuOpened(false);
        }
      }}
      mouseEvent="onMouseUp"
    >
      <div ref={anchor}>
        <DropdownButton
          data-test-id="show-filters-button"
          onClick={() => setFilterMenuOpened(!isFilterMenuOpened)}
        >
          <FormattedMessage id="FNpv6K" defaultMessage="Filters" description="button" />
          {isFilterActive && selectedFilterAmount > 0 && <>({selectedFilterAmount})</>}
        </DropdownButton>
        <Popper
          className={sprinkles({
            backgroundColor: "default1",
            overflowY: "scroll",
            boxShadow: "defaultModal",
            zIndex: "3",
          })}
          style={{
            width: "376px",
            maxHeight: "450px",
          }}
          open={isFilterMenuOpened}
          anchorEl={anchor.current}
          transition
          disablePortal
          placement="bottom-start"
          modifiers={{
            flip: {
              enabled: false,
            },
            hide: {
              enabled: false,
            },
            preventOverflow: {
              boundariesElement: "scrollParent",
              enabled: false,
            },
          }}
        >
          {() => (
            <Grow>
              <FilterContent
                errorMessages={errorMessages}
                errors={filterErrors}
                dataStructure={menu}
                currencySymbol={currencySymbol}
                filters={data}
                onClear={handleClear}
                onFilterPropertyChange={dispatch}
                onFilterAttributeFocus={onFilterAttributeFocus}
                onSubmit={handleSubmit}
              />
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

FiltersSelect.displayName = "Filter";
