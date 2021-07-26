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
  textFieldName: string;
  selectFieldName: string;
  textFieldValue: string;
  selectFieldValue: string;
  selectFieldClassName: string;
}

const TextWithSelectField: React.FC<TextWithSelectFieldProps> = ({
  change,
  choices,
  textFieldName,
  textFieldValue,
  selectFieldName,
  selectFieldValue,
  selectFieldClassName
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TextField
        className={classes.innerContainer}
        name={textFieldName}
        InputProps={{
          className: classes.textField,
          endAdornment: (
            <SingleSelectField
              name={selectFieldName}
              onChange={change}
              value={selectFieldValue}
              className={classNames(
                classes.autocompleteField,
                selectFieldClassName
              )}
              choices={choices}
            />
          )
        }}
        onChange={change}
        value={textFieldValue}
      />
    </div>
  );
};

export default TextWithSelectField;
