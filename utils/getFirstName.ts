export const getFirstName = (fullname: string | null | undefined): string => {
  return fullname?.split(" ")[0] || "";
};
