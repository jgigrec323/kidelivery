import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import { selectAllParcels } from "@/store/slices/parcelSlice";
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "@/components/progress-bar";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
  format,
  subDays,
  isSameDay,
} from "date-fns";
import CustomHeader from "@/components/custom-header";

const History = () => {
  const [selectedRange, setSelectedRange] = useState<
    "DAY" | "WEEK" | "MONTH" | "YEAR"
  >("DAY");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isStartDatePicker, setIsStartDatePicker] = useState(true);
  const navigation = useNavigation();
  const parcels = useSelector(selectAllParcels);

  useEffect(() => {
    updateDateRange(selectedRange);
  }, [selectedRange]);

  const updateDateRange = (range: "DAY" | "WEEK" | "MONTH" | "YEAR") => {
    const today = new Date();
    switch (range) {
      case "DAY":
        setStartDate(startOfDay(today));
        setEndDate(endOfDay(today));
        break;
      case "WEEK":
        setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
        setEndDate(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case "MONTH":
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case "YEAR":
        setStartDate(startOfYear(today));
        setEndDate(endOfYear(today));
        break;
      default:
        setStartDate(today);
        setEndDate(today);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      if (selectedRange === "DAY") {
        setStartDate(startOfDay(date));
        setEndDate(endOfDay(date));
      } else if (isStartDatePicker) {
        setStartDate(date);
        setIsStartDatePicker(false);
        setShowDatePicker(true);
      } else {
        setEndDate(date);
        setIsStartDatePicker(true);
      }
    }
  };

  const getDisplayDate = () => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    if (isSameDay(startDate, today)) {
      return "Aujourd'hui";
    } else if (isSameDay(startDate, yesterday)) {
      return "Hier";
    } else {
      return selectedRange === "DAY"
        ? `Le: ${format(startDate, "dd/MM/yyyy")}`
        : `Du: ${format(startDate, "dd/MM/yyyy")} au ${format(
            endDate,
            "dd/MM/yyyy"
          )}`;
    }
  };

  const filteredParcels = parcels.filter((parcel) => {
    const parcelDate = new Date(parcel.createdAt);
    return parcelDate >= startDate && parcelDate <= endDate;
  });

  const parcelCounts = {
    total: filteredParcels.length,
    pending: filteredParcels.filter((parcel) => parcel.status === "PENDING")
      .length,
    inTransit: filteredParcels.filter(
      (parcel) => parcel.status === "IN_TRANSIT"
    ).length,
    delivered: filteredParcels.filter((parcel) => parcel.status === "DELIVERED")
      .length,
    returned: filteredParcels.filter((parcel) => parcel.status === "RETURNED")
      .length,
  };

  const getProgress = (status: string) => {
    switch (status) {
      case "PENDING":
      case "IN_TRANSIT":
        return 50;
      case "DELIVERED":
      case "RETURNED":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <CustomHeader h={100} title="Historique" />

      {/* Date Range Selector */}
      <View className="p-4 bg-white rounded-md shadow-md mx-4 mb-4">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="flex-row items-center space-x-2"
        >
          <Ionicons name="calendar-outline" size={20} color={COLORS.black} />
          <Text className="text-lg font-semibold text-black">
            {getDisplayDate()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={isStartDatePicker ? startDate : endDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={isStartDatePicker ? undefined : startDate}
          />
        )}
      </View>

      {/* Range Selection Buttons */}
      <View className="flex-row justify-around mb-4 mx-4">
        {["DAY", "WEEK", "MONTH", "YEAR"].map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() =>
              setSelectedRange(range as "DAY" | "WEEK" | "MONTH" | "YEAR")
            }
            className={`py-2 px-4 rounded-full shadow-md ${
              selectedRange === range ? "bg-orange" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedRange === range ? "text-white" : "text-black"
              }`}
            >
              {range === "DAY"
                ? "Jour"
                : range === "WEEK"
                ? "Semaine"
                : range === "MONTH"
                ? "Mois"
                : "Année"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Parcels Count with Icons */}
      <View className="p-4 bg-white rounded-md shadow-md mx-4">
        <Text className="text-lg font-bold text-black mb-2">
          Total: {parcelCounts.total} livraisons
        </Text>
        <View className="flex-row flex-wrap justify-between mt-2">
          <View className="flex-row items-center space-x-2 p-2 bg-gray-100 rounded-full mb-2">
            <Ionicons name="time-outline" size={22} color={COLORS.orange} />
            <Text className="text-gray-700">
              {parcelCounts.pending} En attente
            </Text>
          </View>
          <View className="flex-row items-center space-x-2 p-2 bg-gray-100 rounded-full mb-2">
            <Ionicons name="bicycle-outline" size={22} color={COLORS.orange} />
            <Text className="text-gray-700">
              {parcelCounts.inTransit} En transit
            </Text>
          </View>
          <View className="flex-row items-center space-x-2 p-2 bg-gray-100 rounded-full mb-2">
            <Ionicons
              name="checkmark-done-outline"
              size={22}
              color={COLORS.orange}
            />
            <Text className="text-gray-700">
              {parcelCounts.delivered} Livré
            </Text>
          </View>
          <View className="flex-row items-center space-x-2 p-2 bg-gray-100 rounded-full mb-2">
            <Ionicons
              name="arrow-undo-outline"
              size={22}
              color={COLORS.orange}
            />
            <Text className="text-gray-700">
              {parcelCounts.returned} Retourné
            </Text>
          </View>
        </View>
      </View>

      {/* Parcel List */}
      <FlatList
        data={filteredParcels}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center mt-10">
            <Text className="text-lg text-gray-500">
              Aucune livraison pour cette période
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white border border-gray-300 rounded-lg mb-4 p-4 shadow-md mx-4"
            onPress={() =>
              navigation.navigate("ParcelDetail", { parcelId: item.id })
            }
          >
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg text-black">
                {item.trackingNumber}
              </Text>
              <Text className="text-sm text-gray-500">{item.status}</Text>
            </View>

            <ProgressBar progress={getProgress(item.status)} />

            <View className="flex-row justify-between mt-3">
              <View className="flex-row items-center">
                <MaterialIcons
                  name="my-location"
                  size={16}
                  color={COLORS.orange}
                />
                <Text className="text-sm text-gray-500 ml-1">
                  {item.senderQuartier || "Non disponible"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.orange}
                />
                <Text className="text-sm text-gray-500 ml-1">
                  {item.deliveryQuartier || "Non disponible"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default History;
