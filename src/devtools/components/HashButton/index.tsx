import { Button } from "../Button"
import useHash, { EditorContent } from "../../hooks/useHash"

type HashButtonProps = {
  label?: string
  content: EditorContent
}

export const HashButton = (props: HashButtonProps) => {
  const { content } = props

  const { isHashed, hash } = useHash()
  const buttonLabel = props.label || "Hash"

  return (
    <div>
      <Button
        testId="copy-button"
        variant="contained"
        onClick={() => {
          hash(content)
        }}
      >
        {isHashed ? "Hashed!" : buttonLabel}
      </Button>
    </div>
  )
}
