// @ts-strict-ignore
import { useIntl } from "react-intl";

import AssignContainerDialog, { AssignContainerDialogProps } from "../AssignContainerDialog";
import { messages } from "./messages";

type Categories = {
  id: string;
  name: string;
}[];

interface AssignCategoryDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  categories: Categories | null;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
}

const AssignCategoryDialog = ({ categories, labels, ...rest }: AssignCategoryDialogProps) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={categories}
      emptyMessage={intl.formatMessage(messages.noCategoriesFound)}
      labels={{
        title: intl.formatMessage(messages.assignCategoryDialogHeader),
        label: intl.formatMessage(messages.assignCategoryDialogLabel),
        placeholder: intl.formatMessage(messages.assignCategoryDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmButton),
        ...labels,
      }}
      {...rest}
    />
  );
};

AssignCategoryDialog.displayName = "AssignCategoryDialog";
export default AssignCategoryDialog;
