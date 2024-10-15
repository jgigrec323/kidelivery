// utils/calculateFee.ts
import { communes } from "./communesGn";

// Define neighboring communes for simplicity
const neighboringCommunes: Record<string, string[]> = {
  Ratoma: ["Lambanyi", "Sonfonia"],
  Lambanyi: ["Ratoma", "Sonfonia"],
  Sonfonia: ["Ratoma", "Lambanyi"],
  Gbessia: ["Matoto", "Tombolia"],
  Matoto: ["Gbessia", "Tombolia"],
  Tombolia: ["Matoto", "Gbessia"],
};

// Define the type for the function parameters
interface CalculateDeliveryFeeParams {
  senderCommune: string;
  deliveryCommune: string;
  parcelType: "SINGLE" | "MULTIPLE" | "CARGO" | "EXPRESS";
}

// Function to determine the fee based on commune distance and parcel type
export const calculateDeliveryFee = ({
  senderCommune,
  deliveryCommune,
  parcelType,
}: CalculateDeliveryFeeParams): number => {
  let fee = 10000; // Base fee for deliveries within the same commune

  // Adjust fee if the delivery is to a different commune
  if (senderCommune !== deliveryCommune) {
    const isNeighboring =
      neighboringCommunes[senderCommune]?.includes(deliveryCommune) ||
      neighboringCommunes[deliveryCommune]?.includes(senderCommune);

    fee = isNeighboring ? 15000 : 25000; // Use 15,000 GNF for neighboring communes, 25,000 GNF otherwise
  }

  // If parcel type is EXPRESS, set fee to 20,000 GNF
  if (parcelType === "EXPRESS") {
    fee = 20000;
  }

  return fee;
};
