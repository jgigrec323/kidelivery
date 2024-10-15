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
} from "date-fns";
import { LineChart } from "react-native-chart-kit";
import { fetchOrders, fetchDeliveries } from "@/utils/fetchData";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const Finances = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.id);
  const orders = useSelector((state: RootState) => state.orders.orders);
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

  const [paidAmount, setPaidAmount] = useState(0);
  const [unpaidAmount, setUnpaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inTransit, setInTransit] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);
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
    await fetchOrders(userId, dispatch);
    await fetchDeliveries(userId, dispatch);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  useEffect(() => {
    const monthlyData = Array(12).fill(0); // Initialize array for 12 months

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthIndex = orderDate.getMonth(); // Get the month index (0-11)
      monthlyData[monthIndex] += order.amount; // Sum up amounts per month
    });

    setChartData(monthlyData); // Set the chart data with real values
  }, [orders]);

  useEffect(() => {
    const filteredOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= startDate &&
        new Date(order.createdAt) <= endDate
    );

    const paidOrderAmount = filteredOrders
      .filter((order) => order.status === "PAID")
      .reduce((sum, order) => sum + order.amount, 0);

    const unpaidOrderAmount = filteredOrders
      .filter((order) => order.status === "PENDING")
      .reduce((sum, order) => sum + order.amount, 0);

    const totalOrderAmount = filteredOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const filteredDeliveries = deliveries.filter(
      (delivery) =>
        new Date(delivery.createdAt) >= startDate &&
        new Date(delivery.createdAt) <= endDate
    );

    setPaidAmount(paidOrderAmount);
    setUnpaidAmount(unpaidOrderAmount);
    setTotalAmount(totalOrderAmount);
    setInTransit(
      filteredDeliveries.filter((d) => d.status === "IN_TRANSIT").length
    );
    setCompleted(
      filteredDeliveries.filter((d) => d.status === "COMPLETED").length
    );
    setCancelled(
      filteredDeliveries.filter((d) => d.status === "CANCELLED").length
    );
  }, [orders, deliveries, startDate, endDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getDisplayDate = () => {
    return selectedRange === "DAY"
      ? `${format(startDate, "dd/MM/yyyy")}`
      : `${format(startDate, "dd/MM/yyyy")} au ${format(
          endDate,
          "dd/MM/yyyy"
        )}`;
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

          {/* Money Overview */}
          <View className="mb-1">
            <Text className="text-xl font-bold mb-2">Finances</Text>
            <View className="flex-row justify-between mb-3">
              <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 mr-2">
                <Text className="text-white text-lg">Revenus (Payé)</Text>
                <Text className="text-white text-2xl font-bold">
                  {paidAmount} GNF
                </Text>
              </View>
              <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 ml-2">
                <Text className="text-lg text-white">Montant Impayé</Text>
                <Text className="text-white text-2xl font-bold">
                  {unpaidAmount} GNF
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery Overview */}
          <Text className="text-xl font-bold mb-2">Livraisons</Text>
          <View className="flex-row justify-between mb-4">
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 mr-2">
              <Text className="text-white text-lg">En transit</Text>
              <Text className="text-2xl font-bold text-white">{inTransit}</Text>
            </View>
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 ml-2">
              <Text className="text-white text-lg">Complétés</Text>
              <Text className="text-white text-2xl font-bold">{completed}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3">
            <View className="bg-[#1c1c1e] py-3 px-3 rounded-lg flex-1 mr-2">
              <Text className="text-white text-lg">Annulés</Text>
              <Text className="text-2xl font-bold text-white">{cancelled}</Text>
            </View>
          </View>

          {/* Line Chart */}

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
              height={200}
              chartConfig={{
                backgroundGradientFrom: "#1c1c1e",
                backgroundGradientTo: "#1c1c1e",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                strokeWidth: 2,
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

export default Finances;
