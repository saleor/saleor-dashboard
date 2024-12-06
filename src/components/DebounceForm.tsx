import * as React from "react";

import Debounce from "./Debounce";

export interface DebounceFormProps {
  change: (event: React.ChangeEvent<any>, cb?: () => void) => void;
  children: (props: (event: React.ChangeEvent<any>) => void) => React.ReactNode;
  submit: (event: React.FormEvent<any>) => void;
  time?: number;
}

export const DebounceForm = ({ change, children, submit, time }: DebounceFormProps) => (
  <Debounce debounceFn={submit} time={time}>
    {debounceFn =>
      children(event => {
        change(event, debounceFn);
      })
    }
  </Debounce>
);
export default DebounceForm;
