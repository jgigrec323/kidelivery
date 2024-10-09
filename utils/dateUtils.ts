export const getStartOf = (
  date: Date,
  range: "DAY" | "WEEK" | "MONTH" | "YEAR"
): Date => {
  const newDate = new Date(date);
  switch (range) {
    case "DAY":
      return new Date(newDate.setHours(0, 0, 0, 0));
    case "WEEK":
      const firstDayOfWeek = newDate.getDate() - newDate.getDay(); // Get first day of the week (Sunday)
      newDate.setDate(firstDayOfWeek);
      return new Date(newDate.setHours(0, 0, 0, 0));
    case "MONTH":
      return new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    case "YEAR":
      return new Date(newDate.getFullYear(), 0, 1);
    default:
      return newDate;
  }
};

export const getEndOf = (
  date: Date,
  range: "DAY" | "WEEK" | "MONTH" | "YEAR"
): Date => {
  const newDate = new Date(date);
  switch (range) {
    case "DAY":
      return new Date(newDate.setHours(23, 59, 59, 999));
    case "WEEK":
      const lastDayOfWeek = newDate.getDate() - newDate.getDay() + 6; // Get last day of the week (Saturday)
      newDate.setDate(lastDayOfWeek);
      return new Date(newDate.setHours(23, 59, 59, 999));
    case "MONTH":
      return new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    case "YEAR":
      return new Date(newDate.getFullYear(), 11, 31);
    default:
      return newDate;
  }
};
