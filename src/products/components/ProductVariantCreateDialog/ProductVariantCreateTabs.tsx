import { Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { ProductVariantCreateStep } from "./types";

interface Step {
  label: string;
  value: ProductVariantCreateStep;
}
function getSteps(intl: IntlShape): Step[] {
  return [
    {
      label: intl.formatMessage({
        defaultMessage: "Select Values",
        description: "attribute values, variant creation step"
      }),
      value: "values"
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Prices and SKU",
        description: "variant creation step"
      }),
      value: "prices"
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Summary",
        description: "variant creation step"
      }),
      value: "summary"
    }
  ];
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    label: {
      fontSize: 14,
      textAlign: "center"
    },
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing.unit * 3
    },
    tab: {
      flex: 1,
      paddingBottom: theme.spacing.unit,
      userSelect: "none"
    },
    tabActive: {
      fontWeight: 600
    },
    tabVisited: {
      borderBottom: `3px solid ${theme.palette.primary.main}`,
      cursor: "pointer"
    }
  }),
  {
    name: "ProductVariantCreateTabs"
  }
);

export interface ProductVariantCreateTabsProps {
  step: ProductVariantCreateStep;
  onStepClick: (step: ProductVariantCreateStep) => void;
}

const ProductVariantCreateTabs: React.FC<
  ProductVariantCreateTabsProps
> = props => {
  const { step: currentStep, onStepClick } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const steps = getSteps(intl);

  return (
    <div className={classes.root}>
      {steps.map((step, stepIndex) => {
        const visitedStep =
          steps.findIndex(step => step.value === currentStep) >= stepIndex;

        return (
          <div
            className={classNames(classes.tab, {
              [classes.tabActive]: step.value === currentStep,
              [classes.tabVisited]: visitedStep
            })}
            onClick={visitedStep ? () => onStepClick(step.value) : undefined}
            key={step.value}
          >
            <Typography className={classes.label} variant="caption">
              {step.label}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

ProductVariantCreateTabs.displayName = "ProductVariantCreateTabs";
export default ProductVariantCreateTabs;
