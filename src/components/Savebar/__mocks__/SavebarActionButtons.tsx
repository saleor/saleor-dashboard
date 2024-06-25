import React from "react";

export const CancelButton = ({ children, ...props }: { children?: React.ReactNode }) => (
  <button {...props}>cancel</button>
);

export const ConfirmButton = ({ children, ...props }: { children?: React.ReactNode }) => (
  <button {...props}>save</button>
);

export const DeleteButton = ({ children, ...props }: { children?: React.ReactNode }) => (
  <button {...props}>delete</button>
);
