// @ts-strict-ignore

export type TreeOperationType = "move" | "remove";
export interface TreeOperation {
  id: string;
  type: TreeOperationType;
  parentId?: string;
  sortOrder?: number;
  simulatedMove?: boolean;
}
export interface TreeItemProps {
  id: string;
  onChange?: (operations: TreeOperation[]) => void;
  onClick?: () => void;
  onEdit?: () => void;
}
