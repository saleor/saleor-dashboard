import { ChangeEvent } from "react";

export type InputValue = string | number | readonly string[] | undefined;
export type ChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;
