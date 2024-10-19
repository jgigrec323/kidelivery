import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
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
  const [chartData, setChartData] = useState<number[]>(Array(12).fill(0));

  const shortMonthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Jul",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

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

  useEffect(() => {
    const monthlyData = Array(12).fill(0);

    deliveries.forEach((delivery) => {
      const deliveryDate = new Date(delivery.createdAt);
      const monthIndex = deliveryDate.getMonth(); // Get the month index (0-11)
      monthlyData[monthIndex] += 1; // Count deliveries per month
    });

    setChartData(monthlyData); // Set the chart data with delivery counts
  }, [deliveries]);

  useEffect(() => {
    const filteredDeliveries = deliveries.filter(
      (delivery) =>
        new Date(delivery.createdAt) >= startDate &&
        new Date(delivery.createdAt) <= endDate
    );

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

    // Calculate the total fee-at-door for delivered parcels
    const feeAtDoorDeliveries = filteredDeliveries.reduce((total, delivery) => {
      // Handle both 'parcel' and 'Parcel' (case difference)
      const parcel = delivery.parcel || delivery.Parcel;

      if (parcel && delivery.status === "COMPLETED") {
        // For single parcels
        if (parcel.isFeeAtDoor && parcel.feeAtDoor) {
          total += parcel.feeAtDoor;
        }

        // For multiple parcels, check if 'parcelsInMultiple' exists
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
  }, [deliveries, startDate, endDate]);

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
                labels: shortMonthNames,
                datasets: [{ data: chartData }],
              }}
              width={screenWidth - 70}
              height={210}
              chartConfig={{
                backgroundGradientFrom: "#1c1c1e",
                backgroundGradientTo: "#1c1c1e",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                // strokeWidth: 2,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: COLORS.orange,
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
