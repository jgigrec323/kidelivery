import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import COLORS from "@/constants/Colors";
import CustomHeader from "@/components/custom-header";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  subDays,
  isSameDay,
} from "date-fns";
import { LineChart } from "react-native-chart-kit";
import { fetchDeliveries } from "@/utils/fetchData";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { formatMoney } from "@/utils/formatMoney";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.id);
  const deliveries = useSelector(
    (state: RootState) => state.deliveries.deliveries
  );

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<
    "DAY" | "WEEK" | "MONTH" | "YEAR"
  >("DAY");
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [pending, setPending] = useState(0);
  const [inTransit, setInTransit] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [feeAtDoorTotal, setFeeAtDoorTotal] = useState(0);

  // Grouping hours into 4 periods
  const chartLabels = useMemo(() => {
    switch (selectedRange) {
      case "DAY":
        return ["00-06h", "06-12h", "12-18h", "18-24h"];
      case "WEEK":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      case "MONTH":
        const daysInMonth = new Date().getDate();
        return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      case "YEAR":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      default:
        return [];
    }
  }, [selectedRange]);

  const updateDateRange = (range: "DAY" | "WEEK" | "MONTH" | "YEAR") => {
    const today = new Date();
    switch (range) {
      case "DAY":
        const newDate = startOfDay(today);
        setStartDate(newDate);
        setEndDate(newDate); // Set the same start and end date for a single day
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
    }
  };

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    await fetchDeliveries(userId, dispatch);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  // Dynamically generate chart data based on the selected range
  const chartData = useMemo(() => {
    const periodData = Array(4).fill(0);
    const weeklyData = Array(7).fill(0);
    const dailyData = Array(31).fill(0); // Max 31 days in a month
    const monthlyData = Array(12).fill(0);

    const filteredDeliveries = deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.createdAt);
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });

    switch (selectedRange) {
      case "DAY":
        // Group deliveries into periods
        filteredDeliveries.forEach((delivery) => {
          const hour = new Date(delivery.createdAt).getHours();
          if (hour >= 0 && hour < 6) periodData[0] += 1;
          else if (hour >= 6 && hour < 12) periodData[1] += 1;
          else if (hour >= 12 && hour < 18) periodData[2] += 1;
          else periodData[3] += 1;
        });
        return periodData;
      case "WEEK":
        filteredDeliveries.forEach((delivery) => {
          const dayOfWeek = new Date(delivery.createdAt).getDay();
          weeklyData[dayOfWeek] += 1;
        });
        return weeklyData;
      case "MONTH":
        filteredDeliveries.forEach((delivery) => {
          const dayOfMonth = new Date(delivery.createdAt).getDate() - 1;
          dailyData[dayOfMonth] += 1;
        });
        return dailyData;
      case "YEAR":
        filteredDeliveries.forEach((delivery) => {
          const monthIndex = new Date(delivery.createdAt).getMonth();
          monthlyData[monthIndex] += 1;
        });
        return monthlyData;
      default:
        return [];
    }
  }, [deliveries, startDate, endDate, selectedRange]);

  useEffect(() => {
    const filteredDeliveries = deliveries.filter((delivery) => {
      const deliveryDate = new Date(delivery.createdAt);
      if (selectedRange === "DAY") {
        return isSameDay(deliveryDate, startDate);
      }
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });

    const pending = filteredDeliveries.filter(
      (d) => d.status === "PENDING"
    ).length;
    const inTransitDeliveries = filteredDeliveries.filter(
      (d) => d.status === "IN_TRANSIT"
    ).length;
    const completedDeliveries = filteredDeliveries.filter(
      (d) => d.status === "COMPLETED"
    ).length;
    const cancelledDeliveries = filteredDeliveries.filter(
      (d) => d.status === "CANCELLED"
    ).length;

    const feeAtDoorDeliveries = filteredDeliveries.reduce((total, delivery) => {
      const parcel = delivery.parcel || delivery.Parcel;
      if (parcel && delivery.status === "COMPLETED") {
        if (parcel.isFeeAtDoor && parcel.feeAtDoor) {
          total += parcel.feeAtDoor;
        }
        if (Array.isArray(parcel.parcelsInMultiple)) {
          parcel.parcelsInMultiple.forEach((multipleParcel) => {
            if (multipleParcel.isFeeAtDoor && multipleParcel.feeAtDoor) {
              total += multipleParcel.feeAtDoor;
            }
          });
        }
      }
      return total;
    }, 0);

    setPending(pending);
    setInTransit(inTransitDeliveries);
    setCompleted(completedDeliveries);
    setCancelled(cancelledDeliveries);
    setFeeAtDoorTotal(feeAtDoorDeliveries);
  }, [deliveries, startDate, endDate, selectedRange]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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

  return (
    <SafeAreaView>
      <ScrollView
        className="bg-white h-full"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CustomHeader h={80} title="Tableau de bord" />

        <View className="p-4">
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center space-x-2 mb-3"
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.black} />
            <Text className="text-lg font-semibold text-black">
              {getDisplayDate()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setStartDate(startOfDay(date));
              }}
            />
          )}
          <View className="flex-row justify-around mb-4">
            {["DAY", "WEEK", "MONTH", "YEAR"].map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => {
                  setSelectedRange(range as "DAY" | "WEEK" | "MONTH" | "YEAR");
                  updateDateRange(range as "DAY" | "WEEK" | "MONTH" | "YEAR");
                }}
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

          {/* Collection à la porte (Display on a separate row) */}
          <View className="mb-4">
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg">
              <Text className="text-white text-lg">Collection à la porte</Text>
              <Text className="text-white text-2xl font-bold">
                {formatMoney(feeAtDoorTotal)}
              </Text>
            </View>
          </View>

          {/* Delivery Overview */}
          <Text className="text-xl font-bold mb-2">Livraisons</Text>
          <View className="flex-row justify-between mb-4">
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 mr-2">
              <Text className="text-white text-lg">En attente</Text>
              <Text className="text-2xl font-bold text-white">{pending}</Text>
            </View>
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 mr-2">
              <Text className="text-white text-lg">En transit</Text>
              <Text className="text-2xl font-bold text-white">{inTransit}</Text>
            </View>
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 ml-2">
              <Text className="text-white text-lg">Complétés</Text>
              <Text className="text-white text-2xl font-bold">{completed}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 mr-2">
              <Text className="text-white text-lg">Annulés</Text>
              <Text className="text-2xl font-bold text-white">{cancelled}</Text>
            </View>
          </View>

          {/* Line Chart for Deliveries */}
          <View
            style={{
              backgroundColor: "#1c1c1e",
              borderRadius: 16,
              padding: 16,
              marginTop: 9,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
          >
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartData }],
              }}
              width={screenWidth - 70}
              height={210}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: "#1c1c1e",
                backgroundGradientTo: "#1c1c1e",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Orangered color
                propsForDots: {
                  r: "5", // Full dot without border
                  strokeWidth: "0", // Remove border
                  stroke: "rgba(255, 69, 0, 0)", // Ensure no stroke color
                },
              }}
              bezier
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
