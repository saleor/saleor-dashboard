import { Button } from "../Button"
import { CodeIcon } from "../Icons/CodeIcon"

interface IAutoFormatToggleButtonProps {
  active?: boolean
  onToggle?: (value: boolean) => void
  className?: string
}

export const AutoFormatToggleButton = (props: IAutoFormatToggleButtonProps) => {
  const { active, onToggle, className } = props

  return (
    <div className={className}>
      <Button
        testId="auto-format-toggle-button"
        icon={<CodeIcon className={active ? "text-blue-500" : ""} />}
        onClick={() => {
          // eslint-disable-next-line chai-friendly/no-unused-expressions
          onToggle?.(!active)
        }}
      >
        Auto Format
      </Button>
    </div>
  )
}
