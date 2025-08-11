import { CommandMenu } from "@dashboard/command-menu/command-menu-model";
import { Command } from "cmdk";
import React from "react";

export const CommandMenuUi = () => {
  const { query, updateQuery, open } = CommandMenu.useCommandBar();

  if (!open) {
    return null;
  }

  return (
    <Command>
      <Command.Input value={query} onValueChange={updateQuery} />
      <Command.Item>asd</Command.Item>
    </Command>
  );
};
