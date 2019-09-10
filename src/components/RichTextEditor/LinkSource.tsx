import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { EditorState, EntityInstance, RichUtils } from "draft-js";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { buttonMessages } from "@saleor/intl";
import Form from "../Form";

interface LinkSourceProps {
  editorState: EditorState;
  entity?: EntityInstance;
  entityType: {
    type: string;
  };
  onComplete: (updateState: EditorState) => void;
  onClose: () => void;
}

const LinkSource: React.FC<LinkSourceProps> = ({
  editorState,
  entity,
  entityType,
  onComplete,
  onClose
}) => {
  const intl = useIntl();
  const initial = entity ? entity.getData().url : "";

  const handleSubmit = (url: string) => {
    if (url) {
      const content = editorState.getCurrentContent();
      const contentWithEntity = content.createEntity(
        entityType.type,
        "MUTABLE",
        { url }
      );
      const entityKey = contentWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentWithEntity
      });
      const nextState = RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      );

      onComplete(nextState);
    } else {
      onComplete(editorState);
    }
  };

  return (
    <Dialog onClose={onClose} open={true} fullWidth maxWidth="sm">
      <Form
        initial={{ url: initial }}
        onSubmit={({ url }) => handleSubmit(url)}
      >
        {({ data, change, submit }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Add or Edit Link"
                description="button"
              />
            </DialogTitle>
            <DialogContent>
              <TextField
                name="url"
                fullWidth
                label={intl.formatMessage({
                  defaultMessage: "URL Linked"
                })}
                value={data.url}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.cancel} />
              </Button>
              <Button onClick={submit} color="primary" variant="contained">
                <FormattedMessage {...buttonMessages.save} />
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export default LinkSource;
