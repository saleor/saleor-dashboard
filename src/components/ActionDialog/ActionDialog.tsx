import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import BackButton from "../BackButton";
import { DashboardModal, DashboardModalContentSize } from "../Modal";
import { ActionDialogVariant } from "./types";

/**
 * @interface ActionDialogProps
 * @extends {DialogProps}
 * @property {React.ReactNode} [children] - 对话框中显示的内容。
 * @property {string} [confirmButtonLabel] - 确认按钮上显示的标签。
 * @property {ConfirmButtonTransitionState} confirmButtonState - 确认按钮的过渡状态。
 * @property {boolean} [disabled] - 如果为 true，则禁用确认按钮。
 * @property {string} title - 对话框的标题。
 * @property {ActionDialogVariant} [variant] - 对话框的变体，可以是 'default'、'delete' 或 'info'。
 * @property {string} [backButtonText] - 返回按钮上显示的文本。
 * @property {() => any} onConfirm - 当用户点击确认按钮时调用的回调函数。
 * @property {DashboardModalContentSize} [size] - 对话框内容的大小。
 *
 * ActionDialog 组件的属性。
 */
export interface ActionDialogProps extends DialogProps {
  children?: React.ReactNode;
  confirmButtonLabel?: string;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  title: string;
  variant?: ActionDialogVariant;
  backButtonText?: string;
  onConfirm: () => any;
  size?: DashboardModalContentSize;
}

/**
 * ActionDialog 组件，用于显示一个带有操作（如确认或删除）的模式对话框。
 *
 * @param {ActionDialogProps} props - ActionDialog 组件的属性。
 * @returns {React.ReactElement} 一个呈现 ActionDialog 的 React 元素。
 */
const ActionDialog = ({
  children,
  open,
  title,
  onClose,
  variant,
  confirmButtonState,
  backButtonText,
  disabled,
  onConfirm,
  confirmButtonLabel,
  size = "sm",
}: ActionDialogProps) => {
  const intl = useIntl();

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size={size}>
        <DashboardModal.Header>{title}</DashboardModal.Header>
        <Box fontSize={3}>{children}</Box>
        <DashboardModal.Actions>
          <BackButton onClick={onClose}>{backButtonText}</BackButton>
          {variant !== "info" && (
            <ConfirmButton
              transitionState={confirmButtonState}
              disabled={disabled}
              onClick={onConfirm}
              variant={variant === "delete" ? "error" : "primary"}
              data-test-id="submit"
            >
              {confirmButtonLabel ||
                (variant === "delete"
                  ? intl.formatMessage(buttonMessages.delete)
                  : intl.formatMessage(buttonMessages.confirm))}
            </ConfirmButton>
          )}
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ActionDialog.displayName = "ActionDialog";
export default ActionDialog;
