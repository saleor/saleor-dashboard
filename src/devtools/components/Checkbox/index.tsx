interface ICheckboxProps {
  id?: string
  label: string
  className?: string
  checked: boolean
  onChange: (value: boolean) => void
  testId?: string
}

export const Checkbox = (props: ICheckboxProps) => {
  const { id, label, className, onChange, checked, testId } = props

  const toggleChecked = () => {
    onChange(!checked)
  }

  return (
    <label
      htmlFor={id}
      className={`flex items-center whitespace-nowrap ${className}`}
      data-testid={testId}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={toggleChecked}
        onKeyPress={(e) => e.key === "Enter" && toggleChecked()}
        className="form-checkbox dark:bg-gray-900 rounded-md w-5 h-5"
      />
      <span className="pl-3 text-gray-500 dark:text-gray-400 font-bold">
        {label}
      </span>
    </label>
  )
}
