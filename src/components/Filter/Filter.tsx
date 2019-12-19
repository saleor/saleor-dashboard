import ButtonBase from "@material-ui/core/ButtonBase";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { IFilter, IFilterElement } from "./types";
import useFilter from "./useFilter";
import { FilterContent } from ".";

export interface FilterProps<TFilterKeys extends string = string> {
  currencySymbol: string;
  menu: IFilter<TFilterKeys>;
  onFilterAdd: (filter: Array<IFilterElement<string>>) => void;
}

const useStyles = makeStyles(
  theme => ({
    addFilterButton: {
      "&$filterButton": {
        "&:hover, &:focus": {
          backgroundColor: fade(theme.palette.primary.main, 0.1)
        },
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}`,
        cursor: "pointer",
        marginBottom: 0,
        marginRight: theme.spacing(2),
        marginTop: 0,
        transition: theme.transitions.duration.short + "ms"
      }
    },
    addFilterButtonActive: {
      "&$addFilterButton": {
        backgroundColor: fade(theme.palette.primary.main, 0.1)
      }
    },
    addFilterIcon: {
      transition: theme.transitions.duration.short + "ms"
    },
    addFilterText: {
      color: theme.palette.primary.main,
      fontSize: 14,
      fontWeight: 600 as 600,
      marginRight: 4,
      textTransform: "uppercase"
    },
    filterButton: {
      alignItems: "center",
      backgroundColor: fade(theme.palette.primary.main, 0.6),
      borderRadius: "4px",
      display: "flex",
      height: 40,
      justifyContent: "space-around",
      margin: theme.spacing(2, 1),
      marginLeft: 0,
      padding: theme.spacing(0, 2),
      position: "relative"
    },
    paper: {
      "& p": {
        paddingBottom: 10
      },
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      width: 240
    },
    popover: {
      width: 376,
      zIndex: 3
    },
    rotate: {
      transform: "rotate(180deg)"
    }
  }),
  { name: "Filter" }
);
const Filter: React.FC<FilterProps> = props => {
  const { currencySymbol, menu, onFilterAdd } = props;
  const classes = useStyles(props);

  const anchor = React.useRef<HTMLDivElement>();
  const [isFilterMenuOpened, setFilterMenuOpened] = React.useState(false);
  const [data, dispatch, reset] = useFilter(menu);

  return (
    <div ref={anchor}>
      <ButtonBase
        className={classNames(classes.filterButton, classes.addFilterButton, {
          [classes.addFilterButtonActive]: isFilterMenuOpened
        })}
        onClick={() => setFilterMenuOpened(!isFilterMenuOpened)}
      >
        <Typography className={classes.addFilterText}>
          <FormattedMessage defaultMessage="Add Filter" description="button" />
        </Typography>
        <ArrowDropDownIcon
          color="primary"
          className={classNames(classes.addFilterIcon, {
            [classes.rotate]: isFilterMenuOpened
          })}
        />
      </ButtonBase>
      <Popper
        className={classes.popover}
        open={isFilterMenuOpened}
        anchorEl={anchor.current}
        transition
        disablePortal
        placement="bottom-start"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom"
            }}
          >
            <FilterContent
              currencySymbol={currencySymbol}
              filters={data}
              onClear={reset}
              onFilterPropertyChange={dispatch}
              onSubmit={() => {
                onFilterAdd(data);
                setFilterMenuOpened(false);
              }}
            />
          </Grow>
        )}
      </Popper>
    </div>
  );
};
Filter.displayName = "Filter";
export default Filter;
