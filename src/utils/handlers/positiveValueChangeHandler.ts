import { FormChange } from "@saleor/hooks/useForm";

function createPositiveValueChangeHandler(change: FormChange) {
  return (event: React.ChangeEvent<any>) => {
    if (/^([1-9]\d*)?(\.\d*)?$/.test(event.target.value)) {
      change(event);
    }
  };
}

export default createPositiveValueChangeHandler;
