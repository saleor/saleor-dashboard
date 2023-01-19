interface ISpinnerProps {}

export const Spinner = (props: ISpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin inline-block w-6 h-6 border-2 border-gray-500 dark:border-white rounded-full"
        style={{ borderLeftColor: "transparent" }}
        role="status"
      />
    </div>
  )
}
