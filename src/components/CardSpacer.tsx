import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    spacer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(2),
      },
      marginTop: theme.spacing(4),
    },
  }),
  { name: "CardSpacer" },
);

/**
 * @interface CardSpacerProps
 * @property {React.ReactNode} [children] - CardSpacer 组件的子元素。
 *
 * CardSpacer 组件的属性。
 */
interface CardSpacerProps {
  children?: React.ReactNode;
}

/**
 * CardSpacer 组件，用于在卡片之间添加垂直间距。
 *
 * @param {CardSpacerProps} props - CardSpacer 组件的属性。
 * @returns {React.ReactElement} 一个带有垂直间距的 div 元素。
 */
export const CardSpacer: React.FC<CardSpacerProps> = props => {
  const { children } = props;
  const classes = useStyles(props);

  return <div className={classes.spacer}>{children}</div>;
};
CardSpacer.displayName = "CardSpacer";
export default CardSpacer;
