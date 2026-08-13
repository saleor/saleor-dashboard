import columnStyles from "@dashboard/attributes/components/AttributeListTableSkeleton/attributeListTableColumns.module.css";
import { AttributeListTableSkeletonRows } from "@dashboard/attributes/components/AttributeListTableSkeleton/AttributeListTableSkeleton";
import { AttributeValueRequiredCell } from "@dashboard/attributes/components/AttributeValueRequiredCell/AttributeValueRequiredCell";
import { messages as valueRequiredMessages } from "@dashboard/attributes/components/AttributeValueRequiredCell/messages";
import { rippleTypePageCreateAttribute } from "@dashboard/attributes/ripples/typePageCreateAttribute";
import { attributeUrl } from "@dashboard/attributes/urls";
import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import { ASSIGNABLE_LIST_TABLE_ACTION_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { AttributeNameWithTypeIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeNameWithTypeIcon";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import { useOptimisticListReorder } from "@dashboard/hooks/useOptimisticListReorder";
import { buttonMessages } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { TableBody, TableCell } from "@material-ui/core";
import { Box, Button, Checkbox, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { type MouseEvent, type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AssignedAttributesCard.module.css";

export interface AssignedAttributeListItem {
  id: string;
  name: string | null;
  slug: string | null;
  inputType?: AttributeInputTypeEnum | null;
  valueRequired: boolean;
}

interface AssignedAttributesCardProps extends ListActions {
  attributes: AssignedAttributeListItem[] | undefined;
  disabled: boolean;
  title: ReactNode;
  intro: ReactNode;
  empty: ReactNode;
  cardTestId: string;
  assignTestId: string;
  createTestId: string;
  createOptionLabel: string;
  skeletonTestId: string;
  variantColumn?: "spacer";
  onAttributeAssign: () => void;
  onAttributeCreate: () => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const stopRowNavigation = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};

export const AssignedAttributesCard = ({
  attributes,
  disabled,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar,
  title,
  intro,
  empty,
  cardTestId,
  assignTestId,
  createTestId,
  createOptionLabel,
  skeletonTestId,
  variantColumn,
  onAttributeAssign,
  onAttributeCreate,
  onAttributeReorder,
  onAttributeUnassign,
}: AssignedAttributesCardProps): JSX.Element => {
  const intl = useIntl();
  const { items: orderedAttributes, onSortEnd } = useOptimisticListReorder(
    attributes,
    onAttributeReorder,
  );
  const isLoading = attributes === undefined;
  const showVariantSpacer = variantColumn === "spacer";
  const numberOfColumns = showVariantSpacer ? 6 : 5;

  return (
    <AssignableListCard
      data-test-id={cardTestId}
      title={title}
      intro={
        <Text size={3} color="default2">
          {intro}
        </Text>
      }
      headerEnd={
        <Box position="relative">
          <ButtonGroupWithDropdown
            variant="secondary"
            disabled={disabled}
            onClick={onAttributeAssign}
            testId={assignTestId}
            options={[
              {
                label: createOptionLabel,
                testId: createTestId,
                onSelect: onAttributeCreate,
              },
            ]}
          >
            <FormattedMessage id="uxPpRx" defaultMessage="Assign attribute" description="button" />
          </ButtonGroupWithDropdown>
          <Box position="absolute" __top="-4px" __right="-4px">
            <Ripple model={rippleTypePageCreateAttribute} />
          </Box>
        </Box>
      }
    >
      {!isLoading && attributes?.length === 0 ? (
        <Box padding={4}>
          <Placeholder>{empty}</Placeholder>
        </Box>
      ) : (
        <ResponsiveTable bleed className={tableStyles.assignableTable}>
          <colgroup>
            <col className={tableStyles.dragCell} />
            <col className={tableStyles.checkboxCell} />
            <col />
            <col className={columnStyles.colValueRequired} />
            {showVariantSpacer ? <col className={columnStyles.colVariant} /> : null}
            <col className={tableStyles.actionsCell} />
          </colgroup>
          <TableHead
            colSpan={numberOfColumns}
            compact
            disabled={disabled || isLoading}
            dragRows
            selected={selected}
            items={isLoading ? undefined : orderedAttributes}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell>
              <Text size={2} lineHeight={2} color="default2">
                <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
              </Text>
            </TableCell>
            <TableCell className={columnStyles.colValueRequired}>
              <Text size={2} lineHeight={2} color="default2">
                <FormattedMessage {...valueRequiredMessages.column} />
              </Text>
            </TableCell>
            {showVariantSpacer ? (
              <TableCell className={columnStyles.colVariant} aria-hidden />
            ) : null}
            <TableCell />
          </TableHead>
          {isLoading ? (
            <TableBody data-test-id={skeletonTestId} aria-busy="true">
              <AttributeListTableSkeletonRows variantColumn={variantColumn} />
            </TableBody>
          ) : (
            <SortableTableBody onSortEnd={onSortEnd}>
              {orderedAttributes.map((attribute, attributeIndex) => {
                const isSelected = isChecked(attribute.id);

                return (
                  <SortableTableRow
                    selected={isSelected}
                    className={clsx(styles.link, tableStyles.row)}
                    hover
                    href={attributeUrl(attribute.id)}
                    key={attribute.id}
                    id={attribute.id}
                    index={attributeIndex || 0}
                    data-test-id={"id-" + attribute.id}
                  >
                    <TableCell className={tableStyles.checkboxCell}>
                      <Box
                        display="flex"
                        alignItems="center"
                        height="100%"
                        onClick={stopRowNavigation}
                        onMouseDown={stopRowNavigation}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled}
                          onCheckedChange={() => toggle(attribute.id)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell data-test-id="name">
                      {attribute.name ? (
                        <AttributeNameWithTypeIcon
                          name={attribute.name}
                          inputType={attribute.inputType}
                          secondary={attribute.slug}
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={columnStyles.colValueRequired}>
                      <AttributeValueRequiredCell valueRequired={attribute.valueRequired} />
                    </TableCell>
                    {showVariantSpacer ? (
                      <TableCell className={columnStyles.colVariant} aria-hidden />
                    ) : null}
                    <TableCell className={tableStyles.actionsCell}>
                      <Box
                        className={tableStyles.rowDelete}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
                        width="100%"
                        height="100%"
                      >
                        <TableButtonWrapper>
                          <Button
                            data-test-id="delete-icon"
                            disabled={disabled}
                            variant="tertiary"
                            type="button"
                            onClick={() => onAttributeUnassign(attribute.id)}
                            title={intl.formatMessage(buttonMessages.delete)}
                            icon={
                              <Trash2
                                size={iconSize.small}
                                strokeWidth={iconStrokeWidthBySize.small}
                              />
                            }
                          />
                        </TableButtonWrapper>
                      </Box>
                    </TableCell>
                  </SortableTableRow>
                );
              })}
            </SortableTableBody>
          )}
        </ResponsiveTable>
      )}
    </AssignableListCard>
  );
};
