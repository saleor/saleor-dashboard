import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

export interface Step<T> {
  label: string;
  value: T;
}

const useStyles = makeStyles(
  theme => ({
    label: {
      fontSize: 14,
      textAlign: "center",
    },
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.spacing(3),
    },
    tab: {
      flex: 1,
      paddingBottom: theme.spacing(),
      userSelect: "none",
    },
    tabActive: {
      fontWeight: 600,
    },
    tabVisited: {
      borderBottom: `3px solid ${theme.palette.primary.main}`,
      cursor: "pointer",
    },
  }),
  {
    name: "CreatorSteps",
  },
);

export interface CreatorStepsProps<T> {
  currentStep: T;
  steps: Array<Step<T>>;
  onStepClick: (step: T) => void;
}

function makeCreatorSteps<T extends string | number>() {
  const CreatorSteps: React.FC<CreatorStepsProps<T>> = ({
    currentStep,
    steps,
    onStepClick,
  }) => {
    const classes = useStyles({});

    return (
      <div className={classes.root}>
        {steps.map((step, stepIndex) => {
          const visitedStep =
            steps.findIndex(step => step.value === currentStep) >= stepIndex;

          return (
            <div
              className={classNames(classes.tab, {
                [classes.tabActive]: step.value === currentStep,
                [classes.tabVisited]: visitedStep,
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
  CreatorSteps.displayName = "CreatorSteps";

  return CreatorSteps;
}

export default makeCreatorSteps;
