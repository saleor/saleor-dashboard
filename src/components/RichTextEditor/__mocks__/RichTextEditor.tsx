import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";

import { RichTextEditorProps } from "../RichTextEditor";

export const HOLDER = "TEST_HOLDER";

const RichTextEditor = ({ disabled, error, label, name, helperText }: RichTextEditorProps) => (
  <FormControl
    data-test-id={"rich-text-editor-" + name}
    disabled={disabled}
    error={error}
    fullWidth
    variant="outlined"
  >
    <InputLabel focused={true} shrink={true}>
      {label}
    </InputLabel>

    <FormHelperText>{helperText}</FormHelperText>
  </FormControl>
);

export default RichTextEditor;
