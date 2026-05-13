export const convertToUTC = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toISOString();
};
