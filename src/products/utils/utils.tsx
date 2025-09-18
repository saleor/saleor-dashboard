import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Option, Text } from "@saleor/macaw-ui-next";
import React from "react";

/**
 * @typedef {object} Choice
 * @property {string} id - 选项的 ID。
 * @property {string} name - 选项的名称。
 *
 * 表示一个带有 ID 和名称的基本选项。
 */
type Choice = {
  id: string;
  name: string;
};

/**
 * @typedef {Choice & { ancestors: { edges: { node: Choice; }[]; }; level: number; parent: { id: string; name: string; } | null; }} ChoiceWithAncestors
 *
 * 表示一个带有其祖先、级别和父级的选项。
 */
export type ChoiceWithAncestors = Choice & {
  ancestors: {
    edges: {
      node: Choice;
    }[];
  };
  level: number;
  parent: {
    id: string;
    name: string;
  } | null;
};

/**
 * 获取选项祖先的标签。
 *
 * @param {ChoiceWithAncestors} choice - 要获取祖先标签的选项。
 * @returns {string} 祖先的标签。
 */
export const getAncestorsLabel = (choice: ChoiceWithAncestors): string => {
  const { parent, level, ancestors } = choice;

  if (level === 0) {
    return "";
  }

  if (level === 1) {
    return `${parent?.name} / ` || "";
  }

  const ancestor = mapEdgesToItems(ancestors)?.[0];

  const parentLabel = parent?.name ?? null;
  const rootCategoryLabel = ancestor?.name || null;

  return `${rootCategoryLabel} ${level > 2 ? "/ ... /" : "/"} ${parentLabel} / `;
};

/**
 * 获取一个选项列表，其中包含其祖先的标签作为装饰。
 *
 * @param {ChoiceWithAncestors[]} choices - 带有祖先的选项列表。
 * @returns {Option[]} 带有装饰的选项列表。
 */
export const getChoicesWithAncestors = (choices: ChoiceWithAncestors[]): Option[] =>
  choices.map(category => {
    const hasAncestors = category.level > 0;

    return {
      value: category.id,
      label: category.name,
      startAdornment: hasAncestors ? (
        <Text
          size={2}
          color="default2"
          key={`ancestor-${category.id}`}
          __display="inline"
          height="100%"
          alignItems="center"
        >
          {getAncestorsLabel(category)}
        </Text>
      ) : undefined,
    };
  });
