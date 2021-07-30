import { TextField } from "@material-ui/core";
import SingleSelectField, {
  Choices
} from "@saleor/components/SingleSelectField";
import { FormChange } from "@saleor/hooks/useForm";
import classNames from "classnames";
import React from "react";

import { useStyles } from "./styles";

export interface TextWithSelectFieldProps {
  change: FormChange;
  choices: Choices;
  textFieldLabel?: string;
  textFieldName: string;
  selectFieldName: string;
  textFieldValue: string;
  selectFieldValue: string;
  selectFieldClassName: string;
  containerClassName: string;
}

const TextWithSelectField: React.FC<TextWithSelectFieldProps> = ({
  change,
  choices,
  textFieldName,
  textFieldValue,
  textFieldLabel,
  selectFieldName,
  selectFieldValue,
  selectFieldClassName,
  containerClassName
}) => {
  const classes = useStyles();

  // in case one of the fields in the form is empty
  // we need to save the other part of the field as well
  const handleChange = (type: "selectField" | "textField") => (
    event: React.ChangeEvent<any>
  ) => {
    const otherTarget =
      type === "textField"
        ? {
            value: selectFieldValue,
            name: selectFieldName
          }
        : {
            value: textFieldValue,
            name: textFieldName
          };

    change(event);
    change({ target: otherTarget });
  };

  return (
    <div className={classNames(classes.container, containerClassName)}>
      <TextField
        className={classes.innerContainer}
        name={textFieldName}
        label={textFieldLabel}
        InputProps={{
          className: classNames(classes.textField, {
            [classes.textFieldCentered]: !textFieldLabel
          }),
          endAdornment: (
            <SingleSelectField
              name={selectFieldName}
              onChange={handleChange("selectField")}
              value={selectFieldValue}
              className={classNames(
                classes.autocompleteField,
                selectFieldClassName
              )}
              choices={choices}
            />
          )
        }}
        onChange={handleChange("textField")}
        value={textFieldValue}
      />
    </div>
  );
};

export default TextWithSelectField;
