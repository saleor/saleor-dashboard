import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";

import CardTitle from "../CardTitle";
import CompanyAddressForm, {
  CompanyAddressFormProps
} from "./CompanyAddressForm";

interface CompanyAddressInputProps extends CompanyAddressFormProps {
  className?: string;
  header: string;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "CompanyAddressInput" }
);

const CompanyAddressInput: React.FC<CompanyAddressInputProps> = props => {
  const { className, header, ...formProps } = props;
  const classes = useStyles(props);

  return (
    <Card className={classNames(classes.root, className)}>
      <CardTitle title={header} />
      <CardContent>
        <CompanyAddressForm {...formProps} />
      </CardContent>
    </Card>
  );
};
CompanyAddressInput.displayName = "CompanyAddressInput";
export default CompanyAddressInput;
