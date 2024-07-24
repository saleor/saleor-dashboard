// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { useProductVariantListQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  languageEntityUrl,
  productVariantUrl,
  TranslatableEntities,
} from "@dashboard/translations/urls";
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList as Menu,
  Paper,
  Popper,
} from "@material-ui/core";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ProductContextSwitcherProps {
  productId: string;
  selectedId: string;
  languageCode: string;
}

const useStyles = makeStyles(
  theme => ({
    arrow: {
      color: theme.palette.primary.main,
      transition: theme.transitions.duration.standard + "ms",
    },
    container: {
      display: "flex",
      alignItems: "center",
      paddingBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    label: {
      paddingRight: theme.spacing(1),
    },
    menuContainer: {
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      minWidth: 90,
      padding: theme.spacing(),
      position: "relative",
    },
    menuItem: {
      textAlign: "justify",
    },
    menuPaper: {
      maxHeight: `calc(100vh - ${theme.spacing(2)}px)`,
      overflow: "scroll",
    },
    popover: {
      zIndex: 1,
    },
    rotate: {
      transform: "rotate(180deg)",
    },
  }),
  { name: "ProductContextSwitcher" },
);
const ProductContextSwitcher: React.FC<ProductContextSwitcherProps> = ({
  languageCode,
  productId,
  selectedId,
}) => {
  const classes = useStyles();
  const navigate = useNavigator();
  const intl = useIntl();
  const { data } = useProductVariantListQuery({
    variables: { id: productId },
  });
  const [isExpanded, setExpandedState] = React.useState(false);
  const anchor = React.useRef();
  const items = [
    {
      label: intl.formatMessage({
        id: "QUyUJy",
        defaultMessage: "Main Product",
      }),
      value: productId,
      onClick: () =>
        navigate(languageEntityUrl(languageCode, TranslatableEntities.products, productId)),
    },
    ...(data?.product?.variants?.map(({ name, sku, id }) => ({
      label: name || sku,
      value: id,
      onClick: () => navigate(productVariantUrl(languageCode, productId, id)),
    })) || []),
  ];

  return (
    <div className={classes.container}>
      <Text className={classes.label}>
        <FormattedMessage id="tUlsq+" defaultMessage="Translating" />:
      </Text>
      <div ref={anchor}>
        <DashboardCard
          className={classes.menuContainer}
          onClick={() => setExpandedState(!isExpanded)}
        >
          <Text>{items.find(({ value }) => value === selectedId)?.label || "-"}</Text>
          <ArrowDropDown
            className={clsx(classes.arrow, {
              [classes.rotate]: isExpanded,
            })}
          />
        </DashboardCard>
        <Popper
          className={classes.popover}
          open={isExpanded}
          anchorEl={anchor.current}
          transition
          disablePortal
          placement="bottom-end"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "right top" : "right bottom",
              }}
            >
              <Paper className={classes.menuPaper}>
                <ClickAwayListener onClickAway={() => setExpandedState(false)} mouseEvent="onClick">
                  <Menu>
                    {items.map(({ label, value, onClick }) => (
                      <MenuItem
                        key={value}
                        className={classes.menuItem}
                        onClick={() => {
                          setExpandedState(false);
                          onClick();
                        }}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </Menu>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

ProductContextSwitcher.displayName = "ProductContextSwitcher";
export default ProductContextSwitcher;
