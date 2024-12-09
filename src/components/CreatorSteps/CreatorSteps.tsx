import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";

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
  const CreatorSteps = ({ currentStep, steps, onStepClick }: CreatorStepsProps<T>) => {
    const classes = useStyles({});

    return (
      <div className={classes.root}>
        {steps.map((step, stepIndex) => {
          const visitedStep = steps.findIndex(step => step.value === currentStep) >= stepIndex;

          return (
            <div
              className={clsx(classes.tab, {
                [classes.tabActive]: step.value === currentStep,
                [classes.tabVisited]: visitedStep,
              })}
              onClick={visitedStep ? () => onStepClick(step.value) : undefined}
              key={step.value}
            >
              <Text className={classes.label} size={2} fontWeight="light">
                {step.label}
              </Text>
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
