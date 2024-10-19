export const formatMoney = (
  amount: number,
  locale: string = "fr-FR"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "GNF", // Change this to the currency you want, e.g., 'USD', 'EUR'
    minimumFractionDigits: 0, // No decimal places for GNF
  }).format(amount);
};
