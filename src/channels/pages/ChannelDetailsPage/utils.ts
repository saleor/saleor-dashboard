import uniq from "lodash/uniq";

export const getUpdatedIdsWithNewId = (ids: string[], newId: string) => uniq([...ids, newId]);

export const getUpdatedIdsWithoutNewId = (ids: string[], newId: string) =>
  ids.filter(id => id !== newId);

export const parseDateTimeToDateAndTime = (
  dateTime: string | null | undefined,
): { date: string; time: string } => {
  if (!dateTime) {
    return { date: "", time: "" };
  }

  const dateObj = new Date(dateTime);

  if (isNaN(dateObj.getTime())) {
    return { date: "", time: "" };
  }

  const date = [
    dateObj.getFullYear(),
    String(dateObj.getMonth() + 1).padStart(2, "0"),
    String(dateObj.getDate()).padStart(2, "0"),
  ].join("-");
  const time = dateObj.toTimeString().slice(0, 5);

  return { date, time };
};
