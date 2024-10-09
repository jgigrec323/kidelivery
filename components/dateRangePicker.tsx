import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateRangePickerProps {
  initialRange?: "DAY" | "WEEK" | "MONTH" | "YEAR";
  onRangeChange: (
    startDate: Date,
    endDate: Date,
    range: "DAY" | "WEEK" | "MONTH" | "YEAR"
  ) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialRange = "DAY",
  onRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      if (selectedRange === "DAY") {
        setSelectedDate(date);
        onRangeChange(date, date, "DAY");
      } else if (selectedRange === "WEEK") {
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + 6);
        setStartDate(date);
        setEndDate(endOfWeek);
        onRangeChange(date, endOfWeek, "WEEK");
      } else if (selectedRange === "MONTH") {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setStartDate(startOfMonth);
        setEndDate(endOfMonth);
        onRangeChange(startOfMonth, endOfMonth, "MONTH");
      } else if (selectedRange === "YEAR") {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const endOfYear = new Date(date.getFullYear(), 11, 31);
        setStartDate(startOfYear);
        setEndDate(endOfYear);
        onRangeChange(startOfYear, endOfYear, "YEAR");
      }
    }
  };

  const getDisplayDate = () => {
    if (selectedRange === "DAY") {
      return `Le: ${selectedDate.toLocaleDateString()}`;
    } else {
      return `Du: ${startDate.toLocaleDateString()} au ${endDate.toLocaleDateString()}`;
    }
  };

  return (
    <View className="p-4 bg-grayLight rounded-md mb-4">
      {/* Range Selection Buttons */}
      <View className="flex-row justify-around mb-4">
        {["DAY", "WEEK", "MONTH", "YEAR"].map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => {
              setSelectedRange(range as "DAY" | "WEEK" | "MONTH" | "YEAR");
              setShowDatePicker(true);
            }}
            className={`py-1.5 px-4 rounded-md ${
              selectedRange === range ? "bg-orange" : "bg-gray-100"
            }`}
          >
            <Text
              className={selectedRange === range ? "text-white" : "text-black"}
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

      {/* Date Range Picker Display */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text className="text-lg">{getDisplayDate()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DateRangePicker;
