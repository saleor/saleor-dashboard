import { Button } from "../Button"
import useCopy from "../../hooks/useCopy"

type CopyButtonProps = {
  label?: string
  textToCopy: string
  className?: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const { textToCopy, className } = props
  const { isCopied, copy } = useCopy()
  const buttonLabel = props.label || "Copy"

  return (
    <div className={className}>
      <Button
        testId="copy-button"
        variant="contained"
        onClick={() => {
          copy(textToCopy)
        }}
      >
        {isCopied ? "Copied!" : buttonLabel}
      </Button>
    </div>
  )
}
