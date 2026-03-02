import {
  chevronCell,
  loadingCell,
  readonlyTextCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

interface TreeNode {
  id: string;
  name: string;
  productsCount: number;
  subcategoriesCount: number;
  loadingChildren?: boolean;
  children?: TreeNode[];
}

interface VisibleRow {
  depth: number;
  node: TreeNode;
}

const columns: AvailableColumn[] = [
  {
    id: "expand",
    title: "",
    width: 20,
  },
  {
    id: "name",
    title: "Category",
    width: 420,
  },
  {
    id: "subcategories",
    title: "Subcategories",
    width: 220,
  },
  {
    id: "products",
    title: "Products",
    width: 220,
  },
];

const tree: TreeNode[] = [
  {
    id: "electronics",
    name: "Electronics",
    productsCount: 140,
    subcategoriesCount: 3,
    children: [
      {
        id: "phones",
        name: "Phones",
        productsCount: 64,
        subcategoriesCount: 2,
        children: [
          {
            id: "android",
            name: "Android",
            productsCount: 35,
            subcategoriesCount: 0,
          },
          {
            id: "ios",
            name: "iOS",
            productsCount: 29,
            subcategoriesCount: 0,
          },
        ],
      },
      {
        id: "laptops",
        name: "Laptops",
        productsCount: 51,
        subcategoriesCount: 0,
      },
      {
        id: "appliances",
        name: "Appliances",
        productsCount: 25,
        subcategoriesCount: 0,
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    productsCount: 93,
    subcategoriesCount: 2,
    children: [
      {
        id: "men",
        name: "Men",
        productsCount: 44,
        subcategoriesCount: 0,
      },
      {
        id: "women",
        name: "Women",
        productsCount: 49,
        subcategoriesCount: 0,
      },
    ],
  },
  {
    id: "books",
    name: "Books",
    productsCount: 72,
    subcategoriesCount: 4,
    loadingChildren: true,
  },
  {
    id: "home",
    name: "Home",
    productsCount: 38,
    subcategoriesCount: 1,
    children: [
      {
        id: "decor",
        name: "Decor",
        productsCount: 38,
        subcategoriesCount: 0,
      },
    ],
  },
  {
    id: "gift-cards",
    name: "Gift Cards",
    productsCount: 8,
    subcategoriesCount: 0,
  },
];

const initialExpandedIds = new Set(["electronics", "home"]);

const flattenTree = (nodes: TreeNode[], expandedIds: Set<string>, depth = 0): VisibleRow[] =>
  nodes.flatMap(node => {
    const row: VisibleRow = { node, depth };

    if (!expandedIds.has(node.id) || node.loadingChildren || !node.children?.length) {
      return [row];
    }

    return [row, ...flattenTree(node.children, expandedIds, depth + 1)];
  });

const getIndentedName = (name: string, depth: number): string =>
  `${"\u00A0".repeat(depth * 4)}${name}`;

const ChevronCellTreeGridPreview = () => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(initialExpandedIds));
  const visibleRows = useMemo(() => flattenTree(tree, expandedIds), [expandedIds]);

  const getCellContent = ([column, row]: Item): GridCell => {
    const columnId = columns[column]?.id;
    const rowData = visibleRows[row];

    if (!columnId || !rowData) {
      return readonlyTextCell("", false);
    }

    const { node } = rowData;

    switch (columnId) {
      case "expand":
        if (node.subcategoriesCount === 0) {
          return readonlyTextCell("", false);
        }

        if (node.loadingChildren) {
          return loadingCell();
        }

        return chevronCell(expandedIds.has(node.id));
      case "name":
        return readonlyTextCell(getIndentedName(node.name, rowData.depth));
      case "subcategories":
        return readonlyTextCell(node.subcategoriesCount.toString(), false);
      case "products":
        return readonlyTextCell(node.productsCount.toString(), false);
      default:
        return readonlyTextCell("", false);
    }
  };

  const handleRowClick = ([column, row]: Item) => {
    if (columns[column]?.id !== "expand") {
      return;
    }

    const rowData = visibleRows[row];

    if (!rowData || rowData.node.subcategoriesCount === 0 || rowData.node.loadingChildren) {
      return;
    }

    setExpandedIds(prev => {
      const next = new Set(prev);

      if (next.has(rowData.node.id)) {
        next.delete(rowData.node.id);
      } else {
        next.add(rowData.node.id);
      }

      return next;
    });
  };

  return (
    <Box padding={6}>
      <Datagrid
        readonly
        showTopBorder={false}
        verticalBorder={false}
        rowMarkers="checkbox-visible"
        availableColumns={columns}
        rows={visibleRows.length}
        getCellContent={getCellContent}
        getCellError={() => false}
        emptyText="No categories found"
        menuItems={() => []}
        selectionActions={() => null}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

const meta: Meta<typeof ChevronCellTreeGridPreview> = {
  title: "Components/Datagrid/ChevronCell",
  component: ChevronCellTreeGridPreview,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ChevronCellTreeGridPreview>;

export const FullTreeGrid: Story = {};
