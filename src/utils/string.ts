import { DATE_FORMAT } from "constants/date";
import dayjs from "dayjs";

export const pluralize = (value: any, word: string = "") =>
  `${value.length} ${word}${value?.length > 1 ? "s" : ""}`;

export const formatDate = (date: string = "") =>
  dayjs(date).format(DATE_FORMAT);

export const serialize = (data: any) => JSON.parse(JSON.stringify(data));
