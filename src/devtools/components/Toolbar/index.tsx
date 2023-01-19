import { Bar } from "../../components/Bar"
import { Button } from "../../components/Button"
import { Checkbox } from "../../components/Checkbox"
import { BinIcon } from "../../components/Icons/BinIcon"
import { OverflowPopover } from "../../components/OverflowPopover"
import { Textfield } from "../../components/Textfield"

interface IToolbarProps {
  filterValue: string
  onFilterValueChange: (filterValue: string) => void
  inverted: boolean
  onInvertedChange: (inverted: boolean) => void
  regexActive: boolean
  onRegexActiveChange: (regexActive: boolean) => void
  onClear: () => void
}

export const Toolbar = (props: IToolbarProps) => {
  const {
    filterValue,
    onFilterValueChange,
    inverted,
    onInvertedChange,
    regexActive,
    onRegexActiveChange,
    onClear,
  } = props

  return (
    <Bar testId="toolbar" className="border-b">
      <Button
        icon={<BinIcon />}
        onClick={onClear}
        testId="clear-network-table"
        className="-mr-3"
      />
      <Textfield
        className="w-80"
        value={filterValue}
        onChange={(event) => onFilterValueChange(event.currentTarget.value)}
        placeholder={regexActive ? "/ab+c/" : "Filter"}
        testId="filter-input"
      />
      <OverflowPopover
        className="flex-1 space-x-6"
        items={[
          <Checkbox
            id="invert"
            label="Invert"
            checked={inverted}
            onChange={onInvertedChange}
            testId="inverted-checkbox"
          />,
          <Checkbox
            id="regex"
            label="Regex"
            checked={regexActive}
            onChange={onRegexActiveChange}
            testId="regex-checkbox"
          />,
        ]}
      />
    </Bar>
  )
}
