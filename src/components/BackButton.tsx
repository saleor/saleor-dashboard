import { buttonMessages } from "@dashboard/intl";
import { Button, ButtonProps } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

/**
 * @interface BackButtonProps
 * @extends {ButtonProps}
 * @property {ReactNode} [children] - 按钮中显示的内容。如果未提供，将显示默认的“返回”文本。
 *
 * BackButton 组件的属性。
 */
interface BackButtonProps extends ButtonProps {
  children?: ReactNode;
}

/**
 * 返回按钮组件，用于导航回上一页。
 *
 * @param {BackButtonProps} props - BackButton 组件的属性。
 * @param {ReactNode} [props.children] - 按钮中显示的内容。如果未提供，将显示默认的“返回”文本。
 * @returns {React.FC} 一个呈现返回按钮的 React 组件。
 */
const BackButton: React.FC<BackButtonProps> = ({ children, ...props }) => (
  <Button data-test-id="back" variant="secondary" {...props}>
    {children ?? <FormattedMessage {...buttonMessages.back} />}
  </Button>
);

BackButton.displayName = "BackButton";
export default BackButton;
