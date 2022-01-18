import { FormHelperTextProps } from "@material-ui/core/FormHelperText";

export type ExtendedFormHelperTextProps = FormHelperTextProps & {
  "data-test-id": string;
};
