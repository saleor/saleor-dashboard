import { ChangeEvent, FormEvent, ReactNode } from "react";

import Debounce from "./Debounce";

export interface DebounceFormProps {
  change: (event: ChangeEvent<any>, cb?: () => void) => void;
  children: (props: (event: ChangeEvent<any>) => void) => ReactNode;
  submit: (event: FormEvent<any>) => void;
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
