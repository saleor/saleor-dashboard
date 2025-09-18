import { isExternalURL } from "@dashboard/utils/urls";
import { Backlink as MacawBacklink, BacklinkProps } from "@saleor/macaw-ui";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

/**
 * @typedef {React.FunctionComponent<LinkProps>} LinkType
 *
 * React Router Link 组件的类型定义。
 */
type LinkType = React.FunctionComponent<LinkProps>;

/**
 * Backlink 组件，用于创建返回链接。
 *
 * 此组件会根据 `href` 属性的值来决定是渲染一个内部链接（使用 React Router 的 `Link`）还是一个标准的外部链接。
 * 如果未提供 `href`，则渲染一个按钮。
 *
 * @param {BacklinkProps<"a"> & BacklinkProps<"button">} props - Backlink 组件的属性。
 * @param {string} [props.href] - 链接的目标 URL。
 * @returns {React.ReactElement} 一个返回链接元素。
 */
export const Backlink = ({ href, ...props }: BacklinkProps<"a"> & BacklinkProps<"button">) => {
  if (href && !isExternalURL(href)) {
    return <MacawBacklink<LinkType> {...props} component={Link as unknown as LinkType} to={href} />;
  }

  if (href) {
    return <MacawBacklink<"a"> href={href} {...props} />;
  }

  return <MacawBacklink<"button"> {...props} />;
};
