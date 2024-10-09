export const getInitials = (fullName: string): string => {
  const nameParts = fullName.trim().split(" ");

  const initials = nameParts.map((part) => part[0].toUpperCase()).join("");

  return initials.substring(0, 2);
};
