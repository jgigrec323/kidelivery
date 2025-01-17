import { View, TouchableOpacity } from "react-native";
import React from "react";
import COLORS from "@/constants/Colors";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const icons = {
    index: (isFocused: boolean) => (
      <MaterialCommunityIcons
        name="home-variant"
        size={25}
        color={isFocused ? COLORS.orange : COLORS.black}
      />
    ),
    create: (isFocused: boolean) => (
      <View
        style={{ backgroundColor: COLORS.orange }}
        className="h-14 w-14 justify-center items-center rounded-full -translate-y-5"
      >
        <Feather name="box" size={27} color={COLORS.white} />
      </View>
    ),
    profile: (isFocused: boolean) => (
      <Ionicons
        name="person"
        size={25}
        color={isFocused ? COLORS.orange : COLORS.black}
      />
    ),
  };

  const isMiddleTabActive = state.routes[state.index].name === "create";

  // Hide the TabBar if the middle tab is active
  if (isMiddleTabActive) {
    return null; // Don't render the tab bar
  }

  return (
    <View className="flex items-center">
      <View
        className="bg-gray-50 flex 
        flex-row h-14 justify-around 
        items-center w-full 
        rounded-tr-3xl rounded-tl-3xl 
        shadow-md shadow-black"
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Check if the icon exists for the route; if not, use a fallback
          const Icon = icons[route.name as keyof typeof icons] || (() => null);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {Icon(isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
