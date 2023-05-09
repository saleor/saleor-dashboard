import { FormChange } from "@dashboard/hooks/useForm";

export const createPositiveIntegerChangeHandler =
  (change: FormChange) => (event: React.ChangeEvent<any>) => {
    if (/^[0-9]{0,9}$/.test(event.target.value)) {
      change(event);
    }
  };
