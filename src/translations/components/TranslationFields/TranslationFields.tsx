// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { TranslationField, TranslationFieldType } from "@dashboard/translations/types";
import { ListProps } from "@dashboard/types";
import { OutputData } from "@editorjs/editorjs";
import ArrowIcon from "@material-ui/icons/ArrowDropDown";
import { Button, IconButton, makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import TranslationFieldsLong from "./TranslationFieldsLong";
import TranslationFieldsRich from "./TranslationFieldsRich";
import TranslationFieldsShort from "./TranslationFieldsShort";

type Pagination = Pick<ListProps, Exclude<keyof ListProps, "getRowHref" | "disabled">>;

interface TranslationFieldsProps {
  activeField: string | string[];
  disabled: boolean;
  title: string;
  fields: TranslationField[];
  initialState: boolean;
  saveButtonState: ConfirmButtonTransitionState;
  pagination?: Pagination;
  richTextResetKey: string; // temporary workaround TODO: fix rich text editor
  onEdit: (field: string) => void;
  onDiscard: () => void;
  onSubmit: (field: TranslationField, data: string | OutputData) => SubmitPromise;
  onValueChange?(field: TranslationField, currentValue: string): void;
}

const useStyles = makeStyles(
  theme => ({
    cardCaption: {
      fontSize: 14,
    },
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(1),
      },
    },
    columnHeader: {
      marginBottom: theme.spacing(0.5),
    },
    content: {
      "& a": {
        color: theme.palette.textHighlighted.active,
      },
      "& blockquote": {
        borderLeft: `2px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1, 2),
      },
      "& h2": {
        fontSize: 22,
        marginBottom: theme.spacing(1),
      },
      "& h3": {
        fontSize: 19,
        marginBottom: theme.spacing(1),
      },
      "& p": {
        "&:last-child": {
          marginBottom: 0,
        },
        marginBottom: theme.spacing(),
        marginTop: 0,
      },
      paddingBottom: theme.spacing(2),
    },
    editButtonContainer: {
      alignItems: "center",
      display: "flex",
      justifyContent: "flex-end",
    },
    fieldName: {
      color: theme.typography.caption.color,
      fontSize: 14,
      fontWeight: 500,
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(2),
    },
    grid: {
      gridRowGap: 0,
    },
    hr: {
      gridColumnEnd: "span 2",
    },

    rotate: {
      transform: "rotate(180deg)",
    },
  }),
  { name: "TranslationFields" },
);
const numberOfColumns = 2;
const TranslationFields = (props: TranslationFieldsProps) => {
  const {
    activeField,
    disabled,
    fields,
    initialState,
    title,
    saveButtonState,
    pagination,
    richTextResetKey,
    onEdit,
    onDiscard,
    onSubmit,
    onValueChange,
  } = props;
  const classes = useStyles(props);
  const [expanded, setExpandedState] = useState(initialState);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{title}</DashboardCard.Title>
        <DashboardCard.Toolbar>
          <IconButton variant="secondary" onClick={() => setExpandedState(!expanded)}>
            <ArrowIcon
              className={clsx({
                [classes.rotate]: expanded,
              })}
            />
          </IconButton>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      {expanded ? (
        <DashboardCard.Content className={classes.cardContent}>
          <Grid className={classes.grid} variant="uniform">
            <Text className={classes.columnHeader} fontSize={3}>
              <FormattedMessage id="Xtd0AT" defaultMessage="Original String" />
            </Text>
            <Text className={classes.columnHeader} fontSize={3}>
              <FormattedMessage
                id="bVY7j0"
                defaultMessage="Translation"
                description="Translated Name"
              />
            </Text>
            {fields.map(field => (
              <Fragment key={field.name}>
                <Hr className={classes.hr} />
                <Text className={classes.fieldName} fontSize={3}>
                  {field.displayName}
                </Text>
                <div className={classes.editButtonContainer}>
                  <Button data-test-id={`edit-${field.name}`} onClick={() => onEdit(field.name)}>
                    <FormattedMessage {...buttonMessages.edit} />
                  </Button>
                </div>
                <div className={classes.content}>
                  {field && field.value !== undefined ? (
                    field.type === TranslationFieldType.SHORT ? (
                      <TranslationFieldsShort
                        disabled={disabled}
                        edit={false}
                        initial={field.value}
                        saveButtonState="default"
                        onDiscard={onDiscard}
                        onSubmit={undefined}
                        onValueChange={v => {
                          if (onValueChange) {
                            onValueChange(field, v);
                          }
                        }}
                      />
                    ) : field.type === TranslationFieldType.LONG ? (
                      <TranslationFieldsLong
                        disabled={disabled}
                        edit={false}
                        initial={field.value}
                        saveButtonState="default"
                        onDiscard={onDiscard}
                        onSubmit={undefined}
                        onValueChange={v => {
                          if (onValueChange) {
                            onValueChange(field, v);
                          }
                        }}
                      />
                    ) : (
                      <TranslationFieldsRich
                        resetKey={richTextResetKey}
                        disabled={disabled}
                        edit={false}
                        initial={field.value}
                        saveButtonState="default"
                        onDiscard={onDiscard}
                        onSubmit={undefined}
                        onValueChange={v => {
                          if (onValueChange) {
                            onValueChange(field, v);
                          }
                        }}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}
                </div>
                <Text className={classes.content}>
                  {field && field.translation !== undefined ? (
                    field.type === TranslationFieldType.SHORT ? (
                      <TranslationFieldsShort
                        disabled={disabled}
                        edit={
                          Array.isArray(activeField)
                            ? activeField.includes(field.name)
                            : activeField === field.name
                        }
                        initial={field.translation}
                        saveButtonState={saveButtonState}
                        onDiscard={onDiscard}
                        onSubmit={data => onSubmit(field, data)}
                        onValueChange={v => {
                          if (onValueChange) {
                            onValueChange(field, v);
                          }
                        }}
                      />
                    ) : field.type === TranslationFieldType.LONG ? (
                      <TranslationFieldsLong
                        disabled={disabled}
                        edit={
                          Array.isArray(activeField)
                            ? activeField.includes(field.name)
                            : activeField === field.name
                        }
                        initial={field.translation}
                        saveButtonState={saveButtonState}
                        onDiscard={onDiscard}
                        onSubmit={data => onSubmit(field, data)}
                        onValueChange={v => {
                          if (onValueChange) {
                            onValueChange(field, v);
                          }
                        }}
                      />
                    ) : (
                      <TranslationFieldsRich
                        resetKey={richTextResetKey}
                        disabled={disabled}
                        edit={
                          Array.isArray(activeField)
                            ? activeField.includes(field.name)
                            : activeField === field.name
                        }
                        initial={field.translation}
                        saveButtonState={saveButtonState}
                        onDiscard={onDiscard}
                        onSubmit={data => onSubmit(field, data)}
                        onValueChange={v => {
                          if (onValueChange) {
                            onValueChange(field, v);
                          }
                        }}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}
                </Text>
              </Fragment>
            ))}
          </Grid>
          {pagination && (
            <TablePaginationWithContext
              colSpan={numberOfColumns}
              settings={pagination.settings}
              onUpdateListSettings={pagination.onUpdateListSettings}
              component="div"
            />
          )}
        </DashboardCard.Content>
      ) : (
        <DashboardCard.Content>
          <Text className={classes.cardCaption} size={2} fontWeight="light">
            <FormattedMessage
              id="bh+Keo"
              defaultMessage="{numberOfFields} Translations, {numberOfTranslatedFields} Completed"
              values={{
                numberOfFields: fields.length,
                numberOfTranslatedFields: fields.reduce(
                  (acc, field) => acc + +(field.translation !== null),
                  0,
                ),
              }}
            />
          </Text>
        </DashboardCard.Content>
      )}
    </DashboardCard>
  );
};

TranslationFields.displayName = "TranslationFields";
export default TranslationFields;
