import { isExternalURL } from "@dashboard/utils/urls";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { Button as MacawButton, ButtonTypeMap } from "@saleor/macaw-ui";
import React from "react";
import { Link } from "react-router-dom";

/**
 * Button 组件，作为 Macaw UI Button 组件的封装。
 *
 * 此组件会根据 `href` 属性的值来决定是渲染一个内部链接（使用 React Router 的 `Link`）还是一个标准的外部链接。
 *
 * @param {any} props - Button 组件的属性。
 * @param {string} [props.href] - 链接的目标 URL。
 * @param {React.Ref<any>} ref - 转发给底层 Button 组件的 ref。
 * @returns {React.ReactElement} 一个呈现 Button 的 React 元素。
 */
const _Button: React.FC<any> = React.forwardRef(({ href, ...props }, ref) => {
  if (href && !isExternalURL(href)) {
    return <MacawButton {...props} to={href} component={Link} ref={ref} />;
  }

  return <MacawButton href={href} {...props} ref={ref} />;
});

_Button.displayName = "Button";

/**
 * 具有可覆盖组件类型的 Button 组件。
 *
 * 这允许在需要时用其他组件替换 Button 组件。
 */
export const Button = _Button as OverridableComponent<ButtonTypeMap>;
