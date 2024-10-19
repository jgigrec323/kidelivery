import { View, Text, Pressable } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import COLORS from "@/constants/Colors";
import ProgressBar from "./progress-bar";
import { useSelector } from "react-redux";
import { selectMostRecentInTransitParcel } from "@/store/slices/parcelSlice";
import { formatDate } from "@/utils/formatDate";

const BeingShippedBox = () => {
  // Fetching the most recent parcel in transit from Redux
  const mostRecentInTransitParcel = useSelector(
    selectMostRecentInTransitParcel
  );

  // If there is no parcel in transit, render a placeholder
  if (!mostRecentInTransitParcel) {
    return (
      <View className="flex justify-center items-center h-16">
        <Text>Aucune livraison en cours</Text>
      </View>
    );
  }

  // Destructuring the parcel data
  const {
    trackingNumber,
    pickupDate,
    senderQuartier,
    dropoffDate,
    deliveryQuartier,
  } = mostRecentInTransitParcel;

  return (
    <View className="bg-black rounded-[30px] py-[15px] px-7 mt-3">
      {/* Display tracking number */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-white font-bold text-lg">
          {trackingNumber ? `${trackingNumber}` : "Tracking Unavailable"}
        </Text>

        <Pressable
          style={{ backgroundColor: COLORS.grayDark, columnGap: 5 }}
          className="flex flex-row justify-center items-center rounded-full w-20 h-5"
          onPress={() => {
            // Add logic to navigate to the tracking page or any other action
            //console.log(`Tracking ${trackingNumber}`);
          }}
        >
          <Text className="text-white text-xs">Suivre</Text>
          <Entypo name="chevron-right" size={12} color="white" />
        </Pressable>
      </View>

      {/* Display progress bar */}
      <View>
        <ProgressBar progress={0} />

        {/* Pickup and Delivery Information */}
        <View className="flex flex-row justify-between mt-4">
          <View>
            {/* Pickup date and location */}
            <Text style={{ color: COLORS.grayDark }}>
              {pickupDate ? formatDate(pickupDate) : "Date Unavailable"}
            </Text>
            <Text style={{ color: COLORS.white }}>
              {senderQuartier || "Location Unavailable"}
            </Text>
          </View>

          <View className="flex items-end">
            {/* Estimated delivery date and location */}
            <Text style={{ color: COLORS.grayDark }}>
              {dropoffDate
                ? `Estimated: ${formatDate(dropoffDate)}`
                : "Estimation Unavailable"}
            </Text>
            <Text style={{ color: COLORS.white }}>
              {deliveryQuartier || "Location Unavailable"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BeingShippedBox;
