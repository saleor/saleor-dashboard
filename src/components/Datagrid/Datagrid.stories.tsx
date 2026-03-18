import { type GridCell, GridCellKind, type Item } from "@glideapps/glide-data-grid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { Datagrid, type GetCellContentOpts } from "./Datagrid";
import { initialData } from "./fixtures";
import { DatagridChangeStateContext, useDatagridChangeState } from "./hooks/useDatagridChange";
import { type AvailableColumn } from "./types";

const DatagridChangeProvider = ({ children }: { children: ReactElement }) => {
  const state = useDatagridChangeState();

  return (
    <DatagridChangeStateContext.Provider value={state}>
      {children}
    </DatagridChangeStateContext.Provider>
  );
};

const columns: AvailableColumn[] = [
  { id: "name", title: "Name", width: 200 },
  { id: "age", title: "Age", width: 100 },
  { id: "eyeColor", title: "Eye color", width: 120 },
  { id: "balance", title: "Balance", width: 150 },
  { id: "job", title: "Job", width: 150 },
];

const columnsWithGroups: AvailableColumn[] = [
  { id: "name", title: "Name", width: 200, group: "Personal" },
  { id: "age", title: "Age", width: 100, group: "Personal" },
  { id: "eyeColor", title: "Eye color", width: 120, group: "Personal" },
  { id: "balance", title: "Balance", width: 150, group: "Financial" },
  { id: "job", title: "Job", width: 150, group: "Work" },
];

const getCellContent = ([column, row]: Item, _opts: GetCellContentOpts): GridCell => {
  const item = initialData[row];

  if (!item) {
    return {
      kind: GridCellKind.Text,
      data: "",
      displayData: "",
      allowOverlay: false,
      readonly: true,
    };
  }

  const columnId = columns[column]?.id;

  switch (columnId) {
    case "name":
      return {
        kind: GridCellKind.Text,
        data: item.name,
        displayData: item.name,
        allowOverlay: false,
        readonly: true,
        cursor: "pointer",
      };
    case "age":
      return {
        kind: GridCellKind.Number,
        data: item.age,
        displayData: String(item.age),
        allowOverlay: true,
        readonly: false,
      };
    case "eyeColor":
      return {
        kind: GridCellKind.Text,
        data: item.eyeColor,
        displayData: item.eyeColor,
        allowOverlay: false,
        readonly: true,
      };
    case "balance":
      return {
        kind: GridCellKind.Text,
        data: `${item.balance.amount} ${item.balance.currency}`,
        displayData: `${item.balance.amount.toFixed(2)} ${item.balance.currency}`,
        allowOverlay: false,
        readonly: true,
      };
    case "job":
      return {
        kind: GridCellKind.Text,
        data: item.job.label,
        displayData: item.job.label,
        allowOverlay: false,
        readonly: true,
      };
    default:
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: false,
        readonly: true,
      };
  }
};

const getCellError = () => false;

const menuItems = () => [
  {
    label: "Delete",
    onSelect: fn(),
  },
];

const emptyMenuItems = () => [];

const meta: Meta<typeof Datagrid> = {
  title: "Components/Datagrid",
  component: Datagrid,
  decorators: [
    (Story: React.ComponentType) => (
      <DatagridChangeProvider>
        <Story />
      </DatagridChangeProvider>
    ),
  ],
  argTypes: {
    getCellContent: { table: { disable: true } },
    getCellError: { table: { disable: true } },
    menuItems: { table: { disable: true } },
    selectionActions: { table: { disable: true } },
    availableColumns: { table: { disable: true } },
    renderColumnPicker: { table: { disable: true } },
    renderRowActions: { table: { disable: true } },
    renderHeader: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onHeaderClicked: { table: { disable: true } },
    onRowClick: { table: { disable: true } },
    onColumnMoved: { table: { disable: true } },
    onColumnResize: { table: { disable: true } },
    onRowSelectionChange: { table: { disable: true } },
  },
  args: {
    availableColumns: columns,
    rows: initialData.length,
    emptyText: "No data to display",
    getCellContent,
    getCellError,
    menuItems,
    selectionActions: () => null,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Datagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    rows: 0,
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
  },
};

export const WithoutRowMarkers: Story = {
  args: {
    rowMarkers: "none",
  },
};

export const WithColumnGroups: Story = {
  args: {
    availableColumns: columnsWithGroups,
  },
};

export const WithoutMenuItems: Story = {
  args: {
    menuItems: emptyMenuItems,
  },
};

export const WithRowClick: Story = {
  args: {
    onRowClick: fn(),
    menuItems: emptyMenuItems,
  },
};

export const WithoutTopBorder: Story = {
  args: {
    showTopBorder: false,
  },
};

export const ShowEmptyDatagrid: Story = {
  args: {
    rows: 0,
    showEmptyDatagrid: true,
  },
};
