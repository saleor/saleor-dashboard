import { alpha } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";

/**
 * @interface ChipProps
 * @property {string} [className] - 应用于 Chip 组件根元素的 CSS 类名。
 * @property {React.ReactNode} label - Chip 组件中显示的标签内容。
 * @property {() => void} [onClose] - 当用户点击关闭图标时调用的回调函数。
 *
 * Chip 组件的属性。
 */
export interface ChipProps {
  className?: string;
  label: React.ReactNode;
  onClose?: () => void;
}

const useStyles = makeStyles(
  theme => ({
    closeIcon: {
      cursor: "pointer",
      fontSize: 16,
      marginLeft: theme.spacing(),
      verticalAlign: "middle",
    },
    label: {
      color: theme.palette.common.white,
    },
    root: {
      background: alpha(theme.palette.primary.main, 0.8),
      borderRadius: 18,
      display: "inline-block",
      marginRight: theme.spacing(2),
      padding: "6px 12px",
    },
  }),
  { name: "Chip" },
);

/**
 * Chip 组件，用于以紧凑的形式显示信息。
 *
 * @param {ChipProps} props - Chip 组件的属性。
 * @returns {React.ReactElement} 一个呈现 Chip 的 React 元素。
 */
const Chip: React.FC<ChipProps> = props => {
  const { className, label, onClose } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, className)}>
      <Text className={classes.label} size={2} fontWeight="light">
        {label}
        {onClose && <CloseIcon className={classes.closeIcon} onClick={onClose} />}
      </Text>
    </div>
  );
};

Chip.displayName = "Chip";
export default Chip;
