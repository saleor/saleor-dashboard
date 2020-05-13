import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowIcon from "@material-ui/icons/ArrowDropDown";
import CardTitle from "@saleor/components/CardTitle";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import { buttonMessages } from "@saleor/intl";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import TranslationFieldsLong from "./TranslationFieldsLong";
import TranslationFieldsRich from "./TranslationFieldsRich";
import TranslationFieldsShort from "./TranslationFieldsShort";

interface TranslationField {
  displayName: string;
  name: string;
  translation: string;
  type: "short" | "long" | "rich";
  value: string;
}

export interface TranslationFieldsProps {
  activeField: string;
  disabled: boolean;
  title: string;
  fields: TranslationField[];
  initialState: boolean;
  saveButtonState: ConfirmButtonTransitionState;
  onEdit: (field: string) => void;
  onDiscard: () => void;
  onSubmit: (field: string, data: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    cardCaption: {
      fontSize: 14
    },
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(1)
      }
    },
    columnHeader: {
      marginBottom: theme.spacing(0.5)
    },
    content: {
      "& a": {
        color: theme.palette.secondary.light
      },
      "& blockquote": {
        borderLeft: `2px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1, 2)
      },
      "& h2": {
        fontSize: 22,
        marginBottom: theme.spacing(1)
      },
      "& h3": {
        fontSize: 19,
        marginBottom: theme.spacing(1)
      },
      "& p": {
        "&:last-child": {
          marginBottom: 0
        },
        marginBottom: theme.spacing(),
        marginTop: 0
      },
      paddingBottom: theme.spacing(2)
    },
    editButtonContainer: {
      alignItems: "center",
      display: "flex",
      justifyContent: "flex-end"
    },
    fieldName: {
      color: theme.typography.caption.color,
      fontSize: 14,
      fontWeight: 500,
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(2),
      textTransform: "uppercase"
    },
    grid: {
      gridRowGap: 0
    },
    hr: {
      gridColumnEnd: "span 2"
    },

    rotate: {
      transform: "rotate(180deg)"
    }
  }),
  { name: "TranslationFields" }
);
const TranslationFields: React.FC<TranslationFieldsProps> = props => {
  const {
    activeField,

    disabled,
    fields,
    initialState,
    title,
    saveButtonState,
    onEdit,
    onDiscard,
    onSubmit
  } = props;
  const classes = useStyles(props);

  const [expanded, setExpandedState] = React.useState(initialState);

  return (
    <Card>
      <CardTitle
        title={title}
        toolbar={
          <IconButton onClick={() => setExpandedState(!expanded)}>
            <ArrowIcon
              className={classNames({
                [classes.rotate]: expanded
              })}
            />
          </IconButton>
        }
      />
      {expanded ? (
        <CardContent className={classes.cardContent}>
          <Grid className={classes.grid} variant="uniform">
            <Typography className={classes.columnHeader} variant="body1">
              <FormattedMessage defaultMessage="Original String" />
            </Typography>
            <Typography className={classes.columnHeader} variant="body1">
              <FormattedMessage
                defaultMessage="Translation"
                description="Translated Name"
              />
            </Typography>
            {fields.map(field => (
              <React.Fragment key={field.name}>
                <Hr className={classes.hr} />
                <Typography className={classes.fieldName} variant="body1">
                  {field.displayName}
                </Typography>
                <div className={classes.editButtonContainer}>
                  <Button color="primary" onClick={() => onEdit(field.name)}>
                    <FormattedMessage {...buttonMessages.edit} />
                  </Button>
                </div>
                <div className={classes.content}>
                  {field && field.value !== undefined ? (
                    field.type === "short" ? (
                      <TranslationFieldsShort
                        disabled={disabled}
                        edit={false}
                        initial={field.value}
                        saveButtonState="default"
                        onDiscard={onDiscard}
                        onSubmit={undefined}
                      />
                    ) : field.type === "long" ? (
                      <TranslationFieldsLong
                        disabled={disabled}
                        edit={false}
                        initial={field.value}
                        saveButtonState="default"
                        onDiscard={onDiscard}
                        onSubmit={undefined}
                      />
                    ) : (
                      <TranslationFieldsRich
                        disabled={disabled}
                        edit={false}
                        initial={field.value}
                        saveButtonState="default"
                        onDiscard={onDiscard}
                        onSubmit={undefined}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}
                </div>
                <Typography className={classes.content}>
                  {field && field.translation !== undefined ? (
                    field.type === "short" ? (
                      <TranslationFieldsShort
                        disabled={disabled}
                        edit={activeField === field.name}
                        initial={field.translation}
                        saveButtonState={saveButtonState}
                        onDiscard={onDiscard}
                        onSubmit={data => onSubmit(field.name, data)}
                      />
                    ) : field.type === "long" ? (
                      <TranslationFieldsLong
                        disabled={disabled}
                        edit={activeField === field.name}
                        initial={field.translation}
                        saveButtonState={saveButtonState}
                        onDiscard={onDiscard}
                        onSubmit={data => onSubmit(field.name, data)}
                      />
                    ) : (
                      <TranslationFieldsRich
                        disabled={disabled}
                        edit={activeField === field.name}
                        initial={field.translation}
                        saveButtonState={saveButtonState}
                        onDiscard={onDiscard}
                        onSubmit={data => onSubmit(field.name, data)}
                      />
                    )
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </React.Fragment>
            ))}
          </Grid>
        </CardContent>
      ) : (
        <CardContent>
          <Typography className={classes.cardCaption} variant="caption">
            <FormattedMessage
              defaultMessage="{numberOfFields} Translations, {numberOfTranslatedFields} Completed"
              values={{
                numberOfFields: fields.length,
                numberOfTranslatedFields: fields.reduce(
                  (acc, field) => acc + +(field.translation !== null),
                  0
                )
              }}
            />
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};
TranslationFields.displayName = "TranslationFields";
export default TranslationFields;
