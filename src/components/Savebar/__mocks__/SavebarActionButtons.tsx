import * as React from "react";

export const CancelButton = ({ ...props }: { children?: React.ReactNode }) => (
  <button {...props}>cancel</button>
);

export const ConfirmButton = ({ ...props }: { children?: React.ReactNode }) => (
  <button {...props}>save</button>
);

export const DeleteButton = ({ ...props }: { children?: React.ReactNode }) => (
  <button {...props}>delete</button>
);
