import { format } from 'date-fns';

export const getDateNow = (inDate?: Date) => {
  return format(inDate || new Date(), "dd.MM.yyyy - HH:mm");
}
