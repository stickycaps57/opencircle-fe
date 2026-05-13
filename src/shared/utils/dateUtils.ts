export const convertToUTC = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toISOString().slice(0, -1);
};

export const getLocalDateTimeString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00`;
};
